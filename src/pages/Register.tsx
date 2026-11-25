import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Copy, Mail, ShieldCheck, UserPlus } from 'lucide-react'
import { PageHero } from '../components/Hero'
import { Button, Card, FieldError, Input, Label, Select, Textarea } from '../components/ui'
import { CATEGORY_TITLES } from '../data/content'
import { createRegistration, getSettings, queueEmail } from '../lib/store'
import type { Registration, TeamMember } from '../lib/store'
import { storageMode } from '../lib/supabase'

type Errors = Record<string, string>

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Postgraduate', 'Other']
const STAGES = ['Idea', 'Prototype', 'MVP / Working product', 'Launched / Live users']

const emptyMember = (): TeamMember => ({ name: '', email: '', phone: '', role: 'Member' })

export default function Register() {
  const settings = getSettings()
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', college: '', department: '', year: '', city: '', state: '',
    participationType: 'individual' as 'individual' | 'team',
    teamName: '', teamLeader: '', teamSize: 1,
    projectTitle: '', category: '', problemStatement: '', projectDescription: '',
    innovation: '', technologies: '', stage: '', demoLink: '', consent: false,
  })
  const [members, setMembers] = useState<TeamMember[]>([emptyMember()])
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState<Registration | null>(null)
  const [duplicateOf, setDuplicateOf] = useState<Registration | null>(null)
  const [copied, setCopied] = useState(false)

  const set = (k: string, v: string | number | boolean) => setForm((f) => ({ ...f, [k]: v }))

  function validate(): Errors {
    const e: Errors = {}
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (form.fullName.trim().length < 3) e.fullName = 'Enter your full name.'
    if (!emailRe.test(form.email.trim())) e.email = 'Enter a valid email address.'
    if (form.phone.replace(/\D/g, '').length < 10) e.phone = 'Enter a valid 10-digit mobile number.'
    if (!form.college.trim()) e.college = 'College name is required.'
    if (!form.department.trim()) e.department = 'Department is required.'
    if (!form.year) e.year = 'Select your year of study.'
    if (!form.city.trim()) e.city = 'City is required.'
    if (!form.state.trim()) e.state = 'State is required.'
    if (form.participationType === 'team') {
      if (!form.teamName.trim()) e.teamName = 'Team name is required for team entries.'
      if (!form.teamLeader.trim()) e.teamLeader = 'Team leader name is required.'
      if (form.teamSize < 2 || form.teamSize > 4) e.teamSize = 'Teams are 2–4 members.'
    }
    if (!form.projectTitle.trim()) e.projectTitle = 'Project title is required.'
    if (!form.category) e.category = 'Choose a competition category.'
    if (form.problemStatement.trim().length < 20) e.problemStatement = 'Describe the problem in at least 20 characters.'
    if (form.projectDescription.trim().length < 30) e.projectDescription = 'Describe the project in at least 30 characters.'
    if (!form.innovation.trim()) e.innovation = 'Tell us what is innovative or unique.'
    if (!form.technologies.trim()) e.technologies = 'List the technologies you use.'
    if (!form.stage) e.stage = 'Select the development stage.'
    if (form.demoLink && !/^https?:\/\//.test(form.demoLink.trim())) e.demoLink = 'Demo link must start with http:// or https://'
    if (!form.consent) e.consent = 'You must accept the privacy consent to register.'
    return e
  }

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) {
      document.querySelector('[data-error]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setSubmitting(true)
    try {
      const { reg, duplicate } = await createRegistration({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        college: form.college.trim(),
        department: form.department.trim(),
        year: form.year,
        city: form.city.trim(),
        state: form.state.trim(),
        participationType: form.participationType,
        teamName: form.participationType === 'team' ? form.teamName.trim() : '',
        teamLeader: form.participationType === 'team' ? form.teamLeader.trim() : form.fullName.trim(),
        teamSize: form.participationType === 'team' ? form.teamSize : 1,
        members: form.participationType === 'team' ? members.filter((m) => m.name.trim()) : [],
        projectTitle: form.projectTitle.trim(),
        category: form.category,
        problemStatement: form.problemStatement.trim(),
        projectDescription: form.projectDescription.trim(),
        innovation: form.innovation.trim(),
        technologies: form.technologies.trim(),
        stage: form.stage,
        demoLink: form.demoLink.trim(),
        consent: true,
      })
      if (duplicate) {
        setDuplicateOf(duplicate)
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      await queueEmail(
        'confirmation',
        reg.email,
        `AppThon registration confirmed — ${reg.registrationId}`,
        `Hi ${reg.fullName},\n\nYour AppThon registration is confirmed.\nRegistration ID: ${reg.registrationId}\nProject: ${reg.projectTitle} (${reg.category})\nTeam: ${reg.teamName || 'Individual'}\n\nKeep this ID safe — you need it to submit your project. Submission deadline: ${settings.submissionDeadline}.\n\n— Team AppThon`,
      )
      setDone(reg)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setSubmitting(false)
    }
  }

  if (duplicateOf) {
    return (
      <section className="max-w-3xl mx-auto px-6 py-20">
        <Card className="!p-8 text-center">
          <ShieldCheck className="w-10 h-10 text-amber-400 mx-auto" />
          <h1 className="font-display text-4xl mt-4">You are already registered</h1>
          <p className="text-white/65 leading-relaxed mt-3">
            A registration already exists for this email or mobile number. Duplicate registrations
            are blocked to keep judging fair — use your existing registration ID below.
          </p>
          <p className="font-mono text-2xl text-brand-bright mt-6">{duplicateOf.registrationId}</p>
          <p className="text-sm text-white/60 mt-2">{duplicateOf.fullName} · {duplicateOf.projectTitle} · {duplicateOf.status}</p>
          <div className="flex justify-center gap-3 mt-8">
            <Link to="/submit" className="bg-brand rounded-full px-6 py-2.5 text-sm">Submit Project</Link>
            <Button variant="outline" onClick={() => setDuplicateOf(null)}>Back to form</Button>
          </div>
        </Card>
      </section>
    )
  }

  if (done) {
    return (
      <section className="max-w-3xl mx-auto px-6 py-20">
        <Card className="!p-8 text-center">
          <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto" />
          <h1 className="font-display text-5xl mt-4">Registration confirmed.</h1>
          <p className="text-white/65 leading-relaxed mt-3 max-w-lg mx-auto">
            Your registration has been saved{storageMode() === 'supabase' ? ' to Supabase' : ' (local demo mode — connect Supabase to store it in the cloud)'} and a
            confirmation email has been {storageMode() === 'supabase' ? 'sent' : 'queued — connect Resend in Supabase to send it automatically'}. Keep your registration ID safe.
          </p>
          <div className="glass-card rounded-2xl p-6 mt-8 text-left max-w-md mx-auto">
            <p className="text-xs text-white/50">YOUR REGISTRATION ID</p>
            <div className="flex items-center justify-between gap-3 mt-1">
              <span className="font-mono text-2xl text-brand-bright">{done.registrationId}</span>
              <button
                className="liquid-glass rounded-full px-4 py-2 text-xs inline-flex items-center gap-1"
                onClick={() => {
                  navigator.clipboard.writeText(done.registrationId).catch(() => undefined)
                  setCopied(true)
                }}
              >
                <Copy className="w-3.5 h-3.5" /> {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <dl className="text-sm mt-5 space-y-2">
              <div className="flex justify-between"><dt className="text-white/50">Name</dt><dd>{done.fullName}</dd></div>
              <div className="flex justify-between"><dt className="text-white/50">Project</dt><dd className="text-right">{done.projectTitle}</dd></div>
              <div className="flex justify-between"><dt className="text-white/50">Category</dt><dd>{done.category}</dd></div>
              <div className="flex justify-between"><dt className="text-white/50">Status</dt><dd className="capitalize">{done.status}</dd></div>
            </dl>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
            <Link to="/submit" className="bg-brand rounded-full px-6 py-3 text-sm">Submit Your Project →</Link>
            <Link to="/" className="liquid-glass rounded-full px-6 py-3 text-sm">Back to Home</Link>
          </div>
        </Card>
      </section>
    )
  }

  const isTeam = form.participationType === 'team'
  return (
    <>
      <PageHero
        eyebrow="Registration"
        title="Register for AppThon."
        subtext={`Registration: ${settings.regOpen} → ${settings.regClose}. Fee: ${settings.registrationFee}. One registration per email / mobile number — duplicates are blocked and shown, not silently created.`}
      />
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <form onSubmit={onSubmit} noValidate>
          {/* Participant */}
          <Card className="mb-5">
            <h2 className="font-display text-3xl flex items-center gap-2"><UserPlus className="w-6 h-6 text-brand" /> Participant information</h2>
            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              <div><Label htmlFor="fullName">Full name *</Label><Input id="fullName" value={form.fullName} onChange={(e) => set('fullName', e.target.value)} placeholder="Your full name" />{errors.fullName && <div data-error><FieldError>{errors.fullName}</FieldError></div>}</div>
              <div><Label htmlFor="email">Email *</Label><Input id="email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@college.edu" />{errors.email && <FieldError>{errors.email}</FieldError>}</div>
              <div><Label htmlFor="phone">Mobile number *</Label><Input id="phone" type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="98765 43210" />{errors.phone && <FieldError>{errors.phone}</FieldError>}</div>
              <div><Label htmlFor="college">College name *</Label><Input id="college" value={form.college} onChange={(e) => set('college', e.target.value)} placeholder="Your college / university" />{errors.college && <FieldError>{errors.college}</FieldError>}</div>
              <div><Label htmlFor="department">Department *</Label><Input id="department" value={form.department} onChange={(e) => set('department', e.target.value)} placeholder="e.g. Computer Science" />{errors.department && <FieldError>{errors.department}</FieldError>}</div>
              <div><Label htmlFor="year">Year of study *</Label><Select id="year" value={form.year} onChange={(e) => set('year', e.target.value)}><option value="">Select year</option>{YEARS.map((y) => <option key={y} value={y}>{y}</option>)}</Select>{errors.year && <FieldError>{errors.year}</FieldError>}</div>
              <div><Label htmlFor="city">City *</Label><Input id="city" value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="City" />{errors.city && <FieldError>{errors.city}</FieldError>}</div>
              <div><Label htmlFor="state">State *</Label><Input id="state" value={form.state} onChange={(e) => set('state', e.target.value)} placeholder="State" />{errors.state && <FieldError>{errors.state}</FieldError>}</div>
            </div>
          </Card>

          {/* Team */}
          <Card className="mb-5">
            <h2 className="font-display text-3xl">Team information</h2>
            <div className="flex gap-3 mt-5">
              {(['individual', 'team'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => set('participationType', t)}
                  className={`rounded-full px-5 py-2.5 text-sm capitalize transition ${form.participationType === t ? 'bg-brand text-white' : 'liquid-glass text-white/70'}`}
                >
                  {t === 'individual' ? 'Individual' : 'Team (2–4)'}
                </button>
              ))}
            </div>
            {isTeam && (
              <div className="grid sm:grid-cols-3 gap-4 mt-5">
                <div><Label>Team name *</Label><Input value={form.teamName} onChange={(e) => set('teamName', e.target.value)} placeholder="Team name" />{errors.teamName && <FieldError>{errors.teamName}</FieldError>}</div>
                <div><Label>Team leader *</Label><Input value={form.teamLeader} onChange={(e) => set('teamLeader', e.target.value)} placeholder="Leader's full name" />{errors.teamLeader && <FieldError>{errors.teamLeader}</FieldError>}</div>
                <div><Label>Number of members *</Label><Input type="number" min={2} max={4} value={form.teamSize} onChange={(e) => {
                  const n = Math.max(1, Math.min(4, parseInt(e.target.value || '1', 10)))
                  set('teamSize', n)
                  setMembers((m) => {
                    const next = [...m]
                    while (next.length < n) next.push(emptyMember())
                    return next.slice(0, n)
                  })
                }} />{errors.teamSize && <FieldError>{errors.teamSize}</FieldError>}</div>
              </div>
            )}
            {isTeam && (
              <div className="space-y-4 mt-5">
                <p className="text-sm text-white/60">Team member details — include the leader as member 1.</p>
                {members.slice(0, form.teamSize).map((m, i) => (
                  <div key={i} className="grid sm:grid-cols-4 gap-3 rounded-xl border border-white/10 p-4">
                    <Input placeholder="Name" value={m.name} onChange={(e) => setMembers((ms) => ms.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} />
                    <Input placeholder="Email" type="email" value={m.email} onChange={(e) => setMembers((ms) => ms.map((x, j) => (j === i ? { ...x, email: e.target.value } : x)))} />
                    <Input placeholder="Phone" value={m.phone} onChange={(e) => setMembers((ms) => ms.map((x, j) => (j === i ? { ...x, phone: e.target.value } : x)))} />
                    <Input placeholder="Role" value={m.role} onChange={(e) => setMembers((ms) => ms.map((x, j) => (j === i ? { ...x, role: e.target.value } : x)))} />
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Project */}
          <Card className="mb-5">
            <h2 className="font-display text-3xl">Project information</h2>
            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              <div><Label>Project title *</Label><Input value={form.projectTitle} onChange={(e) => set('projectTitle', e.target.value)} placeholder="A short, clear title" />{errors.projectTitle && <FieldError>{errors.projectTitle}</FieldError>}</div>
              <div><Label>Competition category *</Label><Select value={form.category} onChange={(e) => set('category', e.target.value)}><option value="">Select category</option>{CATEGORY_TITLES.map((c) => <option key={c} value={c}>{c}</option>)}</Select>{errors.category && <FieldError>{errors.category}</FieldError>}</div>
              <div className="sm:col-span-2"><Label>Problem statement *</Label><Textarea value={form.problemStatement} onChange={(e) => set('problemStatement', e.target.value)} placeholder="What problem does this solve, and for whom?" />{errors.problemStatement && <FieldError>{errors.problemStatement}</FieldError>}</div>
              <div className="sm:col-span-2"><Label>Project description *</Label><Textarea value={form.projectDescription} onChange={(e) => set('projectDescription', e.target.value)} placeholder="What does it do? How does it work?" />{errors.projectDescription && <FieldError>{errors.projectDescription}</FieldError>}</div>
              <div className="sm:col-span-2"><Label>Innovation &amp; uniqueness *</Label><Textarea value={form.innovation} onChange={(e) => set('innovation', e.target.value)} placeholder="What makes this different from what already exists?" />{errors.innovation && <FieldError>{errors.innovation}</FieldError>}</div>
              <div><Label>Technology used *</Label><Input value={form.technologies} onChange={(e) => set('technologies', e.target.value)} placeholder="e.g. React, Supabase, Python" />{errors.technologies && <FieldError>{errors.technologies}</FieldError>}</div>
              <div><Label>Development stage *</Label><Select value={form.stage} onChange={(e) => set('stage', e.target.value)}><option value="">Select stage</option>{STAGES.map((s) => <option key={s} value={s}>{s}</option>)}</Select>{errors.stage && <FieldError>{errors.stage}</FieldError>}</div>
              <div className="sm:col-span-2"><Label>Project demonstration link (optional)</Label><Input value={form.demoLink} onChange={(e) => set('demoLink', e.target.value)} placeholder="https://… (live demo, video or repo)" />{errors.demoLink && <FieldError>{errors.demoLink}</FieldError>}</div>
            </div>
          </Card>

          <Card>
            <label className="flex gap-3 items-start cursor-pointer">
              <input type="checkbox" checked={form.consent} onChange={(e) => set('consent', e.target.checked)} className="mt-1 w-4 h-4 accent-brand" />
              <span className="text-sm text-white/70 leading-relaxed">
                I consent to AppThon storing and using my details (and my team’s) only to run this
                competition — registration, verification, judging and certificates — and I confirm
                the information above is true and the project is our own original work. See the{' '}
                <Link to="/privacy" className="text-brand-bright underline">Privacy &amp; Consent</Link> page.
              </span>
            </label>
            {errors.consent && <FieldError>{errors.consent}</FieldError>}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
              <Button type="submit" variant="brand" className="px-10 py-3.5 text-base" disabled={submitting}>
                {submitting ? 'Registering…' : 'Submit Registration'}
              </Button>
              <p className="text-xs text-white/40 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> A confirmation email is {storageMode() === 'supabase' ? 'sent via Resend' : 'queued (connect Resend to send it)'} after registration.</p>
            </div>
          </Card>
        </form>
      </section>
    </>
  )
}
