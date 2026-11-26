import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Copy, Mail, ShieldCheck, UserPlus, Users } from 'lucide-react'
import { PageHero } from '../components/Hero'
import { Button, Card, FieldError, Input, Label, Select, Textarea } from '../components/ui'
import { createRegistration, getSettings, queueEmail } from '../lib/store'
import type { Registration } from '../lib/store'
import { storageMode } from '../lib/supabase'

type Errors = Record<string, string>
type ParticipantKey = 'fullName' | 'email' | 'phone' | 'college' | 'department' | 'year' | 'city' | 'state'

type Participant = Record<ParticipantKey, string>

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Postgraduate', 'Other']
const STAGES = ['Idea', 'Prototype', 'MVP / Working product', 'Launched / Live users']

const emptyParticipant = (): Participant => ({
  fullName: '',
  email: '',
  phone: '',
  college: '',
  department: '',
  year: '',
  city: '',
  state: '',
})

const PARTICIPANT_FIELDS: { key: ParticipantKey; label: string; placeholder: string }[] = [
  { key: 'fullName', label: 'Full name *', placeholder: 'Your full name' },
  { key: 'email', label: 'Email *', placeholder: 'you@college.edu' },
  { key: 'phone', label: 'Mobile number *', placeholder: '98765 43210' },
  { key: 'college', label: 'College name *', placeholder: 'Your college / university' },
  { key: 'department', label: 'Department *', placeholder: 'e.g. Computer Science' },
  { key: 'year', label: 'Year of study *', placeholder: 'Select year' },
  { key: 'city', label: 'City *', placeholder: 'City' },
  { key: 'state', label: 'State *', placeholder: 'State' },
]

function ParticipantCard({
  title,
  prefix,
  participant,
  errors,
  onChange,
}: {
  title: string
  prefix: 'leader' | 'partner'
  participant: Participant
  errors: Errors
  onChange: (key: ParticipantKey, value: string) => void
}) {
  return (
    <Card className="h-full">
      <h2 className="font-display text-3xl flex items-center gap-2">
        {prefix === 'leader' ? <UserPlus className="w-6 h-6 text-brand" /> : <Users className="w-6 h-6 text-brand" />}
        {title}
      </h2>
      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        {PARTICIPANT_FIELDS.map((field) => {
          const error = errors[`${prefix}.${field.key}`]
          const id = `${prefix}-${field.key}`
          return (
            <div key={field.key}>
              <Label htmlFor={id}>{field.label}</Label>
              {field.key === 'year' ? (
                <Select id={id} value={participant[field.key]} onChange={(e) => onChange(field.key, e.target.value)}>
                  <option value="">{field.placeholder}</option>
                  {YEARS.map((year) => <option key={year} value={year}>{year}</option>)}
                </Select>
              ) : (
                <Input
                  id={id}
                  type={field.key === 'email' ? 'email' : field.key === 'phone' ? 'tel' : 'text'}
                  value={participant[field.key]}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                />
              )}
              {error && <div data-error><FieldError>{error}</FieldError></div>}
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export default function Register() {
  const settings = getSettings()
  const [leader, setLeader] = useState<Participant>(emptyParticipant)
  const [partner, setPartner] = useState<Participant>(emptyParticipant)
  const [form, setForm] = useState({
    projectTitle: '', problemStatement: '', projectDescription: '', innovation: '', technologies: '', stage: '', demoLink: '', consent: false,
  })
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState<Registration | null>(null)
  const [duplicateOf, setDuplicateOf] = useState<Registration | null>(null)
  const [copied, setCopied] = useState(false)

  const setFormValue = (key: string, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }))

  function validateParticipant(participant: Participant, prefix: 'leader' | 'partner', nextErrors: Errors) {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (participant.fullName.trim().length < 3) nextErrors[`${prefix}.fullName`] = 'Enter the full name.'
    if (!emailRe.test(participant.email.trim())) nextErrors[`${prefix}.email`] = 'Enter a valid email address.'
    if (participant.phone.replace(/\D/g, '').length < 10) nextErrors[`${prefix}.phone`] = 'Enter a valid 10-digit mobile number.'
    if (!participant.college.trim()) nextErrors[`${prefix}.college`] = 'College name is required.'
    if (!participant.department.trim()) nextErrors[`${prefix}.department`] = 'Department is required.'
    if (!participant.year) nextErrors[`${prefix}.year`] = 'Select the year of study.'
    if (!participant.city.trim()) nextErrors[`${prefix}.city`] = 'City is required.'
    if (!participant.state.trim()) nextErrors[`${prefix}.state`] = 'State is required.'
  }

  function validate(): Errors {
    const nextErrors: Errors = {}
    validateParticipant(leader, 'leader', nextErrors)
    validateParticipant(partner, 'partner', nextErrors)
    if (leader.email.trim().toLowerCase() === partner.email.trim().toLowerCase() && leader.email.trim()) {
      nextErrors['partner.email'] = 'Use a different email address for the team partner.'
    }
    if (leader.phone.replace(/\D/g, '') === partner.phone.replace(/\D/g, '') && leader.phone.replace(/\D/g, '')) {
      nextErrors['partner.phone'] = 'Use a different mobile number for the team partner.'
    }
    if (!form.projectTitle.trim()) nextErrors.projectTitle = 'Project title is required.'
    if (form.problemStatement.trim().length < 20) nextErrors.problemStatement = 'Describe the problem in at least 20 characters.'
    if (form.projectDescription.trim().length < 30) nextErrors.projectDescription = 'Describe the project in at least 30 characters.'
    if (!form.innovation.trim()) nextErrors.innovation = 'Tell us what is innovative or unique.'
    if (!form.technologies.trim()) nextErrors.technologies = 'List the technologies you use.'
    if (!form.stage) nextErrors.stage = 'Select the development stage.'
    if (form.demoLink && !/^https?:\/\//.test(form.demoLink.trim())) nextErrors.demoLink = 'Demo link must start with http:// or https://'
    if (!form.consent) nextErrors.consent = 'You must accept the privacy consent to register.'
    return nextErrors
  }

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      document.querySelector('[data-error]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setSubmitting(true)
    try {
      const { reg, duplicate } = await createRegistration({
        fullName: leader.fullName.trim(),
        email: leader.email.trim(),
        phone: leader.phone.trim(),
        college: leader.college.trim(),
        department: leader.department.trim(),
        year: leader.year,
        city: leader.city.trim(),
        state: leader.state.trim(),
        participationType: 'team',
        teamName: '',
        teamLeader: leader.fullName.trim(),
        teamSize: 2,
        members: [{
          name: partner.fullName.trim(),
          email: partner.email.trim(),
          phone: partner.phone.trim(),
          role: 'Team Partner',
          college: partner.college.trim(),
          department: partner.department.trim(),
          year: partner.year,
          city: partner.city.trim(),
          state: partner.state.trim(),
        }],
        projectTitle: form.projectTitle.trim(),
        category: 'Social Impact',
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
        `Appathon registration confirmed — ${reg.registrationId}`,
        `Hi ${reg.fullName},\n\nYour Appathon registration is confirmed.\nRegistration ID: ${reg.registrationId}\nProject: ${reg.projectTitle} (Social Impact)\nTeam: 2 participants — ${reg.teamLeader} and ${reg.members[0]?.name || 'Team Partner'}\n\nKeep this ID safe — you need it to submit your project. Submission deadline: ${settings.submissionDeadline}.\n\n— Team Appathon`,
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
              <div className="flex justify-between"><dt className="text-white/50">Theme</dt><dd>{done.category}</dd></div>
              <div className="flex justify-between"><dt className="text-white/50">Participants</dt><dd>2</dd></div>
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

  const updateParticipant = (setter: typeof setLeader) => (key: ParticipantKey, value: string) => {
    setter((current) => ({ ...current, [key]: value }))
  }

  return (
    <>
      <PageHero
        eyebrow="Registration"
        title="Register for Appathon."
        subtext={`Registration: ${settings.regOpen} → ${settings.regClose}. Fee: ${settings.registrationFee}. One registration per team — exactly two participants, one leader and one partner.`}
      />
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <form onSubmit={onSubmit} noValidate>
          <div className="grid lg:grid-cols-2 gap-5 mb-5">
            <ParticipantCard
              title="Team Leader Information"
              prefix="leader"
              participant={leader}
              errors={errors}
              onChange={updateParticipant(setLeader)}
            />
            <ParticipantCard
              title="Team Partner Information"
              prefix="partner"
              participant={partner}
              errors={errors}
              onChange={updateParticipant(setPartner)}
            />
          </div>

          <Card className="mb-5">
            <h2 className="font-display text-3xl">Project information</h2>
            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              <div className="sm:col-span-2"><Label>Project title *</Label><Input value={form.projectTitle} onChange={(e) => setFormValue('projectTitle', e.target.value)} placeholder="A short, clear title" />{errors.projectTitle && <FieldError>{errors.projectTitle}</FieldError>}</div>
              <div className="sm:col-span-2"><Label>Problem statement *</Label><Textarea value={form.problemStatement} onChange={(e) => setFormValue('problemStatement', e.target.value)} placeholder="What problem does this solve, and for whom?" />{errors.problemStatement && <FieldError>{errors.problemStatement}</FieldError>}</div>
              <div className="sm:col-span-2"><Label>Project description *</Label><Textarea value={form.projectDescription} onChange={(e) => setFormValue('projectDescription', e.target.value)} placeholder="What does it do? How does it work?" />{errors.projectDescription && <FieldError>{errors.projectDescription}</FieldError>}</div>
              <div className="sm:col-span-2"><Label>Innovation &amp; uniqueness *</Label><Textarea value={form.innovation} onChange={(e) => setFormValue('innovation', e.target.value)} placeholder="What makes this different from what already exists?" />{errors.innovation && <FieldError>{errors.innovation}</FieldError>}</div>
              <div><Label>Technology used *</Label><Input value={form.technologies} onChange={(e) => setFormValue('technologies', e.target.value)} placeholder="e.g. React, Supabase, Python" />{errors.technologies && <FieldError>{errors.technologies}</FieldError>}</div>
              <div><Label>Development stage *</Label><Select value={form.stage} onChange={(e) => setFormValue('stage', e.target.value)}><option value="">Select stage</option>{STAGES.map((stage) => <option key={stage} value={stage}>{stage}</option>)}</Select>{errors.stage && <FieldError>{errors.stage}</FieldError>}</div>
              <div><Label>Project demonstration link (optional)</Label><Input value={form.demoLink} onChange={(e) => setFormValue('demoLink', e.target.value)} placeholder="https://… (live demo, video or repo)" />{errors.demoLink && <FieldError>{errors.demoLink}</FieldError>}</div>
            </div>
          </Card>

          <Card>
            <label className="flex gap-3 items-start cursor-pointer">
              <input type="checkbox" checked={form.consent} onChange={(e) => setFormValue('consent', e.target.checked)} className="mt-1 w-4 h-4 accent-brand" />
              <span className="text-sm text-white/70 leading-relaxed">
                I consent to Appathon storing and using my details (and my team’s) only to run this
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
