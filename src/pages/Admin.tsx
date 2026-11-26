import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  Award, CheckCircle2, Download, Lock, LogOut, Mail, Megaphone, Search, Settings as SettingsIcon,
  ShieldCheck, Trash2, Users, XCircle,
} from 'lucide-react'
import { PageHero } from '../components/Hero'
import { Badge, Button, Card, Input, Label, Select, Textarea } from '../components/ui'
import {
  DEMO_ADMIN, fetchRegistrationsFromSupabase, getAnnouncements, getEvaluations, getJudges, getOutbox,
  getRegistrations, getSettings, getSubmissions, isAdminLoggedIn, queueEmail, saveAnnouncements,
  saveEvaluations, saveJudges, saveSettings, setAdminLoggedIn, updateRegistrationStatus,
} from '../lib/store'
import type { Announcement, Evaluation, Judge, Registration, RegistrationStatus, Settings } from '../lib/store'
import { isSupabaseConfigured, storageMode } from '../lib/supabase'
import { downloadFile, formatDate, toCsv } from '../lib/utils'

type Tab = 'overview' | 'registrations' | 'projects' | 'judges' | 'content' | 'emails'

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(isAdminLoggedIn())
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [tab, setTab] = useState<Tab>('overview')
  const [regs, setRegs] = useState<Registration[]>(() => getRegistrations())
  const [settings, setSettings] = useState<Settings>(() => getSettings())
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => getAnnouncements())
  const [judges, setJudges] = useState<Judge[]>(() => getJudges())
  const [evals, setEvals] = useState<Evaluation[]>(() => getEvaluations())
  const [query, setQuery] = useState('')
  const [catFilter, setCatFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selected, setSelected] = useState<Registration | null>(null)
  const [newAnn, setNewAnn] = useState({ title: '', body: '' })
  const [newJudge, setNewJudge] = useState({ name: '', expertise: '', email: '' })
  const [score, setScore] = useState({ registrationId: '', judgeId: '', innovation: 20, technical: 20, impact: 20, presentation: 10, comments: '' })

  const subs = getSubmissions()
  const outbox = getOutbox()

  useEffect(() => {
    if (!loggedIn) return
    fetchRegistrationsFromSupabase().then((remote) => {
      if (remote && remote.length) setRegs(remote)
    }).catch(() => undefined)
  }, [loggedIn])

  const stats = useMemo(() => {
    const colleges = new Set(regs.map((r) => r.college.trim().toLowerCase()))
    const teams = regs.filter((r) => r.participationType === 'team').length
    return {
      total: regs.length,
      colleges: colleges.size,
      teams,
      projects: subs.length,
      pending: regs.filter((r) => r.status === 'pending').length,
      approved: regs.filter((r) => r.status === 'approved').length,
      rejected: regs.filter((r) => r.status === 'rejected').length,
      shortlisted: regs.filter((r) => r.status === 'shortlisted').length,
    }
  }, [regs, subs.length])

  const filtered = regs.filter((r) => {
    const q = query.trim().toLowerCase()
    const matchesQ = !q || r.fullName.toLowerCase().includes(q) || r.college.toLowerCase().includes(q) || r.registrationId.toLowerCase().includes(q) || r.projectTitle.toLowerCase().includes(q)
    const matchesC = catFilter === 'All' || r.category === catFilter
    const matchesS = statusFilter === 'All' || r.status === statusFilter
    return matchesQ && matchesC && matchesS
  })

  function login(ev: FormEvent) {
    ev.preventDefault()
    if (email.trim().toLowerCase() === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
      setAdminLoggedIn(true)
      setLoggedIn(true)
      setLoginError('')
    } else {
      setLoginError('Invalid admin credentials. Use the demo login shown below — in production, replace this with Supabase Auth (see README).')
    }
  }

  async function setStatus(r: Registration, status: RegistrationStatus) {
    const next = updateRegistrationStatus(r.id, status)
    setRegs(next)
    setSelected(next.find((x) => x.id === r.id) ?? null)
    if (status === 'approved') {
      await queueEmail('approval', r.email, `Appathon registration approved — ${r.registrationId}`, `Hi ${r.fullName},\n\nYour Appathon registration (${r.registrationId}) has been approved. Submit your project before ${settings.submissionDeadline}.\n\n— Team Appathon`)
    }
    if (status === 'rejected') {
      await queueEmail('rejection', r.email, `Appathon registration update — ${r.registrationId}`, `Hi ${r.fullName},\n\nYour Appathon registration (${r.registrationId}) was not approved this time. Contact the coordinators if you believe this is a mistake.\n\n— Team Appathon`)
    }
  }

  function exportCsv() {
    const rows = filtered.map((r) => ({
      registration_id: r.registrationId, name: r.fullName, email: r.email, phone: r.phone,
      college: r.college, department: r.department, year: r.year, city: r.city, state: r.state,
      type: r.participationType, team_name: r.teamName, team_size: r.teamSize,
      project_title: r.projectTitle, category: r.category, stage: r.stage,
      technologies: r.technologies, status: r.status, created_at: r.createdAt,
    }))
    downloadFile(`appthon-registrations-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(rows))
  }

  function saveContent(ev: FormEvent) {
    ev.preventDefault()
    saveSettings(settings)
    alert('Competition details saved. They now appear on the Home, Schedule, Prizes and Contact pages.')
  }

  function addAnnouncement(ev: FormEvent) {
    ev.preventDefault()
    if (!newAnn.title.trim()) return
    const next = [{ id: `ann-${Date.now()}`, title: newAnn.title.trim(), body: newAnn.body.trim(), date: new Date().toISOString(), pinned: false }, ...announcements]
    setAnnouncements(next)
    saveAnnouncements(next)
    setNewAnn({ title: '', body: '' })
  }

  function addJudge(ev: FormEvent) {
    ev.preventDefault()
    if (!newJudge.name.trim()) return
    const next = [...judges, { id: `j-${Date.now()}`, ...newJudge }]
    setJudges(next)
    saveJudges(next)
    setNewJudge({ name: '', expertise: '', email: '' })
  }

  function saveScore(ev: FormEvent) {
    ev.preventDefault()
    if (!score.registrationId || !score.judgeId) return
    const full: Evaluation = {
      id: `ev-${Date.now()}`,
      registrationId: score.registrationId,
      judgeId: score.judgeId,
      innovation: score.innovation, technical: score.technical, impact: score.impact,
      presentation: score.presentation,
      total: score.innovation + score.technical + score.impact + score.presentation,
      comments: score.comments, createdAt: new Date().toISOString(),
    }
    const next = [full, ...evals]
    setEvals(next)
    saveEvaluations(next)
    setScore({ ...score, comments: '' })
  }

  if (!loggedIn) {
    return (
      <section className="max-w-md mx-auto px-6 py-20">
        <Card className="!p-8">
          <Lock className="w-8 h-8 text-brand" />
          <h1 className="font-display text-4xl mt-4">Admin Portal</h1>
          <p className="text-white/60 text-sm leading-relaxed mt-2">
            Password-protected. This demo login is for evaluation only — in production, admin
            sign-in uses Supabase Auth with role-based access (see README → Supabase setup).
          </p>
          <form onSubmit={login} className="space-y-4 mt-6">
            <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@appthon.in" /></div>
            <div><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" /></div>
            {loginError && <p className="text-xs text-brand-soft">{loginError}</p>}
            <Button type="submit" variant="brand" className="w-full py-3">Sign in to Admin</Button>
          </form>
          <p className="text-xs text-white/40 mt-5 text-center">
            Demo credentials — <span className="text-white/70">admin@appthon.in / Appathon@2026</span><br />
            Change or disable them before any real deployment.
          </p>
        </Card>
      </section>
    )
  }

  const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
    { id: 'overview', label: 'Overview', icon: ShieldCheck },
    { id: 'registrations', label: 'Registrations', icon: Users },
    { id: 'projects', label: 'Projects', icon: Award },
    { id: 'judges', label: 'Judges & Scores', icon: Award },
    { id: 'content', label: 'Content & Dates', icon: SettingsIcon },
    { id: 'emails', label: 'Emails', icon: Mail },
  ]

  return (
    <>
      <PageHero eyebrow="Admin Portal" title="Competition control room." subtext={`Storage mode: ${storageMode()} ${isSupabaseConfigured ? '(Supabase connected — registrations sync to the cloud)' : '(local demo mode — set VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY to connect Supabase)'}. Sample registrations are marked “Sample” — delete them before real registrations open.`} />
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`rounded-full px-4 py-2 text-sm transition ${tab === t.id ? 'bg-brand text-white' : 'liquid-glass text-white/70'}`}>
                {t.label}
              </button>
            ))}
          </div>
          <Button variant="outline" onClick={() => { setAdminLoggedIn(false); setLoggedIn(false) }}>
            <LogOut className="w-4 h-4" /> Sign out
          </Button>
        </div>

        {tab === 'overview' && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total registrations', value: stats.total },
                { label: 'Participating colleges', value: stats.colleges },
                { label: 'Teams', value: stats.teams },
                { label: 'Projects submitted', value: stats.projects },
                { label: 'Pending', value: stats.pending },
                { label: 'Approved', value: stats.approved },
                { label: 'Rejected', value: stats.rejected },
                { label: 'Shortlisted', value: stats.shortlisted },
              ].map((s) => (
                <Card key={s.label}><p className="font-display text-5xl text-brand">{s.value}</p><p className="text-sm text-white/60 mt-2">{s.label}</p></Card>
              ))}
            </div>
            <Card className="mt-5">
              <h3 className="font-display text-3xl flex items-center gap-2"><Megaphone className="w-6 h-6 text-brand" /> Latest announcements</h3>
              <ul className="mt-4 space-y-3">
                {announcements.slice(0, 3).map((a) => (
                  <li key={a.id} className="border-b border-white/10 pb-3 last:border-0"><p className="font-medium">{a.title}</p><p className="text-sm text-white/60">{a.body}</p></li>
                ))}
              </ul>
            </Card>
          </div>
        )}

        {tab === 'registrations' && (
          <div>
            <Card className="mb-4">
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-3.5 text-white/40" />
                  <Input className="pl-9" placeholder="Search by name, college, project or registration ID…" value={query} onChange={(e) => setQuery(e.target.value)} />
                </div>
                <Select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
                  <option>All</option>
                  {[...new Set(regs.map((r) => r.category))].map((c) => <option key={c}>{c}</option>)}
                </Select>
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option>All</option><option value="pending">pending</option><option value="approved">approved</option><option value="rejected">rejected</option><option value="shortlisted">shortlisted</option>
                </Select>
                <Button variant="brand" onClick={exportCsv}><Download className="w-4 h-4" /> Export CSV</Button>
              </div>
              <p className="text-xs text-white/40 mt-3">{filtered.length} of {regs.length} registrations · CSV export downloads the filtered list (Excel-compatible).</p>
            </Card>
            <div className="space-y-3">
              {filtered.map((r) => (
                <Card key={r.id} className="!p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <button className="text-left" onClick={() => setSelected(selected?.id === r.id ? null : r)}>
                      <p className="font-medium">{r.fullName} <span className="text-white/40 font-mono text-xs">{r.registrationId}</span> {r.isSample && <Badge>Sample</Badge>}</p>
                      <p className="text-sm text-white/60">{r.projectTitle} · {r.category} · {r.college}</p>
                      <p className="text-xs text-white/40 mt-1">{r.email} · {r.phone} · {formatDate(r.createdAt)}</p>
                    </button>
                    <div className="flex items-center gap-2">
                      <Badge className={r.status === 'approved' ? '!border-green-400/40 !text-green-300' : r.status === 'rejected' ? '!border-red-400/40 !text-red-300' : ''}>{r.status}</Badge>
                      <Button variant="outline" className="!px-3 !py-1.5 text-xs" onClick={() => setStatus(r, 'approved')}><CheckCircle2 className="w-3.5 h-3.5" /> Approve</Button>
                      <Button variant="outline" className="!px-3 !py-1.5 text-xs" onClick={() => setStatus(r, 'rejected')}><XCircle className="w-3.5 h-3.5" /> Reject</Button>
                      <Button variant="outline" className="!px-3 !py-1.5 text-xs" onClick={() => setStatus(r, 'shortlisted')}>Shortlist</Button>
                    </div>
                  </div>
                  {selected?.id === r.id && (
                    <div className="mt-5 pt-5 border-t border-white/10 grid md:grid-cols-2 gap-4 text-sm">
                      <div><p className="text-white/50 text-xs">PARTICIPANT</p><p className="mt-1">{r.fullName} · {r.department}, {r.year}</p><p className="text-white/60">{r.city}, {r.state} · {r.email} · {r.phone}</p><p className="text-white/60 mt-1">{r.participationType === 'team' ? `Team “${r.teamName}” — leader ${r.teamLeader}, ${r.teamSize} members` : 'Individual entry'}</p>{r.members.length > 0 && <p className="text-white/60 mt-1">Members: {r.members.map((m) => `${m.name} (${m.role})`).join(', ')}</p>}</div>
                      <div><p className="text-white/50 text-xs">PROJECT</p><p className="mt-1 font-medium">{r.projectTitle} — {r.stage}</p><p className="text-white/60 mt-1">{r.projectDescription}</p><p className="text-white/60 mt-1"><strong className="text-white/80">Problem:</strong> {r.problemStatement}</p><p className="text-white/60 mt-1"><strong className="text-white/80">Innovation:</strong> {r.innovation}</p><p className="text-white/60 mt-1"><strong className="text-white/80">Tech:</strong> {r.technologies}</p>{r.demoLink && <a className="text-brand-bright underline" href={r.demoLink} target="_blank" rel="noreferrer">Demo link →</a>}</div>
                    </div>
                  )}
                </Card>
              ))}
              {filtered.length === 0 && <p className="text-white/50 text-center py-10">No registrations match this search / filter.</p>}
            </div>
          </div>
        )}

        {tab === 'projects' && (
          <div className="space-y-3">
            {subs.length === 0 && <Card><p className="text-white/60">No project submissions yet. Submissions appear here once a verified participant submits — with their files, demo/video links and status. The 3 sample registrations above have not submitted projects yet.</p></Card>}
            {subs.map((s) => {
              const reg = regs.find((r) => r.registrationId === s.registrationId)
              const total = evals.filter((e) => e.registrationId === s.registrationId).reduce((a, e) => a + e.total, 0)
              const count = evals.filter((e) => e.registrationId === s.registrationId).length
              return (
                <Card key={s.id} className="!p-5">
                  <div className="flex flex-wrap justify-between gap-3">
                    <div>
                      <p className="font-medium">{s.projectTitle} <span className="text-white/40 font-mono text-xs">{s.registrationId}</span></p>
                      <p className="text-sm text-white/60 mt-1">{s.description}</p>
                      <p className="text-xs text-white/40 mt-2">By {reg?.fullName ?? s.email} · {formatDate(s.submittedAt)} · Files: {s.files.length ? s.files.map((f) => f.name).join(', ') : 'none'}</p>
                      {s.demoLink && <a className="text-sm text-brand-bright underline" href={s.demoLink} target="_blank" rel="noreferrer">Demo →</a>}{' '}
                      {s.videoLink && <a className="text-sm text-brand-bright underline" href={s.videoLink} target="_blank" rel="noreferrer">Video →</a>}
                    </div>
                    <div className="text-right">
                      <Badge>{s.status}</Badge>
                      <p className="text-sm text-white/60 mt-2">{count ? `Avg score: ${(total / count).toFixed(1)} / 100 (${count} judge${count > 1 ? 's' : ''})` : 'Not yet scored'}</p>
                      <div className="flex gap-2 mt-2 justify-end">
                        <Button variant="outline" className="!px-3 !py-1.5 text-xs" onClick={() => { const r = regs.find((x) => x.registrationId === s.registrationId); if (r) setStatus(r, 'shortlisted') }}>Shortlist</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        {tab === 'judges' && (
          <div className="grid lg:grid-cols-2 gap-4">
            <Card>
              <h3 className="font-display text-3xl">Judges</h3>
              <ul className="mt-4 space-y-3">
                {judges.map((j) => (
                  <li key={j.id} className="flex justify-between gap-3 border-b border-white/10 pb-3 last:border-0">
                    <span><strong>{j.name}</strong><span className="text-white/60 text-sm block">{j.expertise} · {j.email}</span></span>
                    <button aria-label="Remove judge" onClick={() => { const next = judges.filter((x) => x.id !== j.id); setJudges(next); saveJudges(next) }}><Trash2 className="w-4 h-4 text-white/50" /></button>
                  </li>
                ))}
              </ul>
              <form onSubmit={addJudge} className="grid gap-2 mt-5">
                <Input placeholder="Judge name" value={newJudge.name} onChange={(e) => setNewJudge({ ...newJudge, name: e.target.value })} />
                <Input placeholder="Expertise" value={newJudge.expertise} onChange={(e) => setNewJudge({ ...newJudge, expertise: e.target.value })} />
                <Input placeholder="Email" type="email" value={newJudge.email} onChange={(e) => setNewJudge({ ...newJudge, email: e.target.value })} />
                <Button type="submit" variant="brand">Add judge</Button>
              </form>
            </Card>
            <Card>
              <h3 className="font-display text-3xl">Record evaluation score</h3>
              <p className="text-xs text-white/50 mt-1">Each criterion is scored out of 25 (100 total). Innovation 30% / Technical 30% / Impact 25% / Presentation 15% — the total below is the raw /100 score.</p>
              <form onSubmit={saveScore} className="grid gap-3 mt-5">
                <Select value={score.registrationId} onChange={(e) => setScore({ ...score, registrationId: e.target.value })}>
                  <option value="">Select project…</option>
                  {regs.map((r) => <option key={r.id} value={r.registrationId}>{r.registrationId} — {r.projectTitle}</option>)}
                </Select>
                <Select value={score.judgeId} onChange={(e) => setScore({ ...score, judgeId: e.target.value })}>
                  <option value="">Select judge…</option>
                  {judges.map((j) => <option key={j.id} value={j.id}>{j.name}</option>)}
                </Select>
                <div className="grid grid-cols-2 gap-3">
                  {(['innovation', 'technical', 'impact', 'presentation'] as const).map((k) => (
                    <div key={k}><Label className="capitalize">{k} /25</Label><Input type="number" min={0} max={25} value={score[k]} onChange={(e) => setScore({ ...score, [k]: Math.max(0, Math.min(25, parseInt(e.target.value || '0', 10))) })} /></div>
                  ))}
                </div>
                <Textarea placeholder="Comments for the team (optional)" value={score.comments} onChange={(e) => setScore({ ...score, comments: e.target.value })} />
                <p className="text-sm">Total: <strong className="text-brand-bright">{score.innovation + score.technical + score.impact + score.presentation} / 100</strong></p>
                <Button type="submit" variant="brand">Save score</Button>
              </form>
              <ul className="mt-6 space-y-2">
                {evals.slice(0, 5).map((e) => (
                  <li key={e.id} className="text-sm border-b border-white/10 pb-2 last:border-0">
                    {e.registrationId} — <strong>{e.total}/100</strong> by {judges.find((j) => j.id === e.judgeId)?.name ?? 'judge'} · {formatDate(e.createdAt)}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        )}

        {tab === 'content' && (
          <div className="grid lg:grid-cols-2 gap-4">
            <Card>
              <h3 className="font-display text-3xl">Competition details</h3>
              <p className="text-xs text-white/50 mt-1">These are the editable placeholders the brief requires — fill in real dates, prizes and contacts here instead of inventing them in code.</p>
              <form onSubmit={saveContent} className="grid gap-3 mt-5">
                {([
                  ['institution', 'Organising institution'],
                  ['regOpen', 'Registration opens'], ['regClose', 'Registration closes'],
                  ['eventDate', 'Event date'], ['venue', 'Venue'],
                  ['submissionDeadline', 'Submission deadline'], ['shortlistDate', 'Shortlisting announcement'],
                  ['finalDate', 'Final presentation'], ['awardDate', 'Award ceremony'],
                  ['registrationFee', 'Registration fee'],
                  ['firstPrize', 'First prize'], ['secondPrize', 'Second prize'], ['thirdPrize', 'Third prize'],
                  ['contactEmail', 'Official email'], ['contactPhone', 'Contact number'],
                  ['address', 'Address'], ['facultyCoordinator', 'Faculty coordinator'],
                  ['facultyPhone', 'Faculty coordinator phone'], ['studentCoordinators', 'Student coordinators'],
                ] as [keyof Settings, string][]).map(([k, label]) => (
                  <div key={k}><Label>{label}</Label><Input value={settings[k]} onChange={(e) => setSettings({ ...settings, [k]: e.target.value })} /></div>
                ))}
                <Button type="submit" variant="brand">Save competition details</Button>
              </form>
            </Card>
            <Card>
              <h3 className="font-display text-3xl flex items-center gap-2"><Megaphone className="w-6 h-6 text-brand" /> Announcements</h3>
              <form onSubmit={addAnnouncement} className="grid gap-2 mt-5">
                <Input placeholder="Announcement title" value={newAnn.title} onChange={(e) => setNewAnn({ ...newAnn, title: e.target.value })} />
                <Textarea placeholder="Announcement body — shown on the Home page" value={newAnn.body} onChange={(e) => setNewAnn({ ...newAnn, body: e.target.value })} />
                <Button type="submit" variant="brand">Publish announcement</Button>
              </form>
              <ul className="mt-6 space-y-3">
                {announcements.map((a) => (
                  <li key={a.id} className="flex justify-between gap-3 border-b border-white/10 pb-3 last:border-0">
                    <span><strong>{a.title}</strong><span className="text-white/60 text-sm block">{a.body}</span></span>
                    <button aria-label="Delete announcement" onClick={() => { const next = announcements.filter((x) => x.id !== a.id); setAnnouncements(next); saveAnnouncements(next) }}><Trash2 className="w-4 h-4 text-white/50" /></button>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        )}

        {tab === 'emails' && (
          <Card>
            <h3 className="font-display text-3xl flex items-center gap-2"><Mail className="w-6 h-6 text-brand" /> Email automation log</h3>
            <p className="text-sm text-white/60 mt-2">
              Every registration, approval, rejection and submission queues an email here. With
              Supabase + Resend connected (Edge Function <code>send-confirmation</code>), status
              becomes “sent”; without it, entries stay “queued” so nothing is silently lost.
            </p>
            {outbox.length === 0 && <p className="text-white/50 mt-6">No emails yet — register a test participant to see the confirmation email queued here.</p>}
            <ul className="mt-5 space-y-3">
              {outbox.map((m) => (
                <li key={m.id} className="border-b border-white/10 pb-3 last:border-0 text-sm">
                  <p><Badge>{m.type}</Badge> <span className="ml-2">{m.subject}</span> <Badge className="ml-2">{m.status}</Badge></p>
                  <p className="text-white/50 text-xs mt-1">To {m.to} · {formatDate(m.createdAt)}</p>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </section>
    </>
  )
}
