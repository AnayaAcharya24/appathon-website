import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { CheckCircle2, FileUp, Search, UploadCloud, X } from 'lucide-react'
import { PageHero } from '../components/Hero'
import { Badge, Button, Card, FieldError, Input, Label, Textarea } from '../components/ui'
import { createSubmission, findRegistration, getSettings, getSubmissions, queueEmail } from '../lib/store'
import type { ProjectFileMeta, ProjectSubmission, Registration } from '../lib/store'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { formatDate } from '../lib/utils'

const ALLOWED = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'zip', 'png', 'jpg', 'jpeg', 'mp4', 'mov']
const MAX_FILE_MB = 10
const MAX_FILES = 5

export default function Submit() {
  const settings = getSettings()
  const [regId, setRegId] = useState('')
  const [email, setEmail] = useState('')
  const [reg, setReg] = useState<Registration | null>(null)
  const [verifyError, setVerifyError] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [demoLink, setDemoLink] = useState('')
  const [videoLink, setVideoLink] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [fileError, setFileError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [done, setDone] = useState<ProjectSubmission | null>(null)
  const [formError, setFormError] = useState('')

  function verify(ev: FormEvent) {
    ev.preventDefault()
    const found = findRegistration(regId, email)
    if (!found) {
      setReg(null)
      setVerifyError('No registration matches that ID + email. Check the confirmation email you received after registering — the ID looks like APP-2026-1001.')
      return
    }
    setVerifyError('')
    setReg(found)
    setTitle(found.projectTitle)
    setDescription(found.projectDescription)
    setDemoLink(found.demoLink)
    const existing = getSubmissions().find((s) => s.registrationId === found.registrationId)
    if (existing) {
      setVideoLink(existing.videoLink)
      setDescription(existing.description)
    }
  }

  function onFiles(ev: ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(ev.target.files ?? [])
    if (files.length + picked.length > MAX_FILES) {
      setFileError(`Maximum ${MAX_FILES} files per submission.`)
      return
    }
    for (const f of picked) {
      const ext = f.name.split('.').pop()?.toLowerCase() ?? ''
      if (!ALLOWED.includes(ext)) {
        setFileError(`"${f.name}" is not allowed. Allowed: ${ALLOWED.join(', ')}.`)
        return
      }
      if (f.size > MAX_FILE_MB * 1024 * 1024) {
        setFileError(`"${f.name}" is over ${MAX_FILE_MB} MB.`)
        return
      }
    }
    setFileError('')
    setFiles((prev) => [...prev, ...picked])
    ev.target.value = ''
  }

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault()
    if (!reg) return
    if (title.trim().length < 3) { setFormError('Project title is required.'); return }
    if (description.trim().length < 30) { setFormError('Add a description of at least 30 characters.'); return }
    setFormError('')
    setUploading(true)
    try {
      const metas: ProjectFileMeta[] = []
      for (const f of files) {
        let storagePath: string | undefined
        if (isSupabaseConfigured && supabase) {
          const path = `${reg.registrationId}/${Date.now()}-${f.name}`
          const { error } = await supabase.storage.from('project-files').upload(path, f, { upsert: false })
          if (!error) storagePath = path
        }
        metas.push({ name: f.name, size: f.size, type: f.type, storagePath })
      }
      const sub = await createSubmission({
        registrationId: reg.registrationId,
        email: reg.email,
        projectTitle: title.trim(),
        description: description.trim(),
        demoLink: demoLink.trim(),
        videoLink: videoLink.trim(),
        files: metas,
      })
      await queueEmail(
        'confirmation',
        reg.email,
        `Appathon project submitted — ${reg.registrationId}`,
        `Hi ${reg.fullName},\n\nYour project "${sub.projectTitle}" was submitted for Appathon.\nRegistration ID: ${reg.registrationId}\nStatus: submitted\n\nYou can re-submit before the deadline (${settings.submissionDeadline}) to replace this version.\n\n— Team Appathon`,
      )
      setDone(sub)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setUploading(false)
    }
  }

  if (done && reg) {
    return (
      <section className="max-w-3xl mx-auto px-6 py-20">
        <Card className="!p-8 text-center">
          <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto" />
          <h1 className="font-display text-5xl mt-4">Project submitted.</h1>
          <p className="text-white/65 mt-3">“{done.projectTitle}” is now with the Appathon team for review.</p>
          <dl className="text-sm max-w-md mx-auto mt-6 space-y-2 text-left">
            <div className="flex justify-between"><dt className="text-white/50">Registration ID</dt><dd className="font-mono">{done.registrationId}</dd></div>
            <div className="flex justify-between"><dt className="text-white/50">Status</dt><dd className="capitalize">{done.status}</dd></div>
            <div className="flex justify-between"><dt className="text-white/50">Submitted</dt><dd>{formatDate(done.submittedAt)}</dd></div>
            <div className="flex justify-between"><dt className="text-white/50">Files</dt><dd>{done.files.length ? done.files.map((f) => f.name).join(', ') : 'No files — links only'}</dd></div>
          </dl>
          <p className="text-xs text-white/40 mt-6">Submission deadline: {settings.submissionDeadline}. You can re-submit before then to replace this version.</p>
          <Button variant="brand" className="mt-6" onClick={() => { setDone(null); setReg(null); setFiles([]); setRegId(''); setEmail('') }}>Submit another / start over</Button>
        </Card>
      </section>
    )
  }

  return (
    <>
      <PageHero
        eyebrow="Project Submission"
        title="Submit your project."
        subtext={`Submission deadline: ${settings.submissionDeadline}. Verify with your registration ID and registered email first — only registered participants can submit.`}
      />
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <Card className="mb-5">
          <h2 className="font-display text-3xl flex items-center gap-2"><Search className="w-6 h-6 text-brand" /> Step 1 — Verify your registration</h2>
          <form onSubmit={verify} className="grid sm:grid-cols-[1fr_1fr_auto] gap-3 mt-6 items-end">
            <div><Label>Registration ID</Label><Input value={regId} onChange={(e) => setRegId(e.target.value)} placeholder="APP-2026-1001" /></div>
            <div><Label>Registered email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@college.edu" /></div>
            <Button type="submit" variant="brand">Verify</Button>
          </form>
          {verifyError && <FieldError>{verifyError}</FieldError>}
          {reg && (
            <p className="text-sm text-green-300 mt-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Verified — {reg.fullName}, {reg.college} · “{reg.projectTitle}” ({reg.category}) · Status: {reg.status}
            </p>
          )}
          <p className="text-xs text-white/40 mt-3">Lost your ID? It was in your registration confirmation email. If you never received it, contact the coordinators from the Contact page with your name, college and email.</p>
        </Card>

        {reg && (
          <form onSubmit={onSubmit}>
            <Card className="mb-5">
              <h2 className="font-display text-3xl flex items-center gap-2"><FileUp className="w-6 h-6 text-brand" /> Step 2 — Your submission</h2>
              <div className="space-y-4 mt-6">
                <div><Label>Project title *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
                <div><Label>Project description *</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What it does, who it helps, how it works — at least 30 characters." /></div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><Label>Demo / application link</Label><Input value={demoLink} onChange={(e) => setDemoLink(e.target.value)} placeholder="https://…" /></div>
                  <div><Label>Demo video link</Label><Input value={videoLink} onChange={(e) => setVideoLink(e.target.value)} placeholder="https://youtube.com/… or drive link" /></div>
                </div>
                <div>
                  <Label>Supporting documents</Label>
                  <label className="mt-1 flex flex-col items-center justify-center rounded-xl border border-dashed border-white/25 bg-white/[0.03] px-4 py-8 cursor-pointer hover:border-brand/60 transition">
                    <UploadCloud className="w-7 h-7 text-brand" />
                    <span className="text-sm mt-2">Click to upload files</span>
                    <span className="text-xs text-white/40 mt-1">PDF, DOC, PPT, ZIP, PNG/JPG, MP4 · max {MAX_FILE_MB} MB each · max {MAX_FILES} files</span>
                    <input type="file" multiple className="hidden" onChange={onFiles} accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.png,.jpg,.jpeg,.mp4,.mov" />
                  </label>
                  {fileError && <FieldError>{fileError}</FieldError>}
                  {files.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {files.map((f, i) => (
                        <li key={i} className="flex items-center justify-between gap-3 rounded-lg bg-white/5 px-3 py-2 text-sm">
                          <span className="truncate">{f.name} <span className="text-white/40">({(f.size / 1024).toFixed(0)} KB)</span></span>
                          <button type="button" onClick={() => setFiles((p) => p.filter((_, j) => j !== i))} aria-label="Remove file"><X className="w-4 h-4 text-white/60" /></button>
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="text-xs text-white/40 mt-2">
                    {isSupabaseConfigured
                      ? 'Files are uploaded to the Supabase Storage bucket “project-files” (private, signed access).'
                      : 'Supabase is not connected in this build, so files are recorded by name/size and stored with your submission record — connect Supabase Storage to upload the actual files (see README).'}
                  </p>
                </div>
              </div>
              {formError && <FieldError>{formError}</FieldError>}
              <div className="flex items-center gap-4 mt-6">
                <Button type="submit" variant="brand" className="px-8 py-3" disabled={uploading}>{uploading ? 'Uploading & submitting…' : 'Submit Project'}</Button>
                <Badge>Deadline: {settings.submissionDeadline}</Badge>
              </div>
            </Card>
          </form>
        )}
      </section>
    </>
  )
}
