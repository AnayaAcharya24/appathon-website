import { supabase, isSupabaseConfigured } from './supabase'

export type RegistrationStatus = 'pending' | 'approved' | 'rejected' | 'shortlisted'
export type ParticipationType = 'individual' | 'team'

export interface TeamMember {
  name: string
  email: string
  phone: string
  role: string
}

export interface Registration {
  id: string
  registrationId: string
  fullName: string
  email: string
  phone: string
  college: string
  department: string
  year: string
  city: string
  state: string
  participationType: ParticipationType
  teamName: string
  teamLeader: string
  teamSize: number
  members: TeamMember[]
  projectTitle: string
  category: string
  problemStatement: string
  projectDescription: string
  innovation: string
  technologies: string
  stage: string
  demoLink: string
  consent: boolean
  status: RegistrationStatus
  createdAt: string
  isSample?: boolean
}

export interface ProjectFileMeta {
  name: string
  size: number
  type: string
  storagePath?: string
}

export interface ProjectSubmission {
  id: string
  registrationId: string
  email: string
  projectTitle: string
  description: string
  demoLink: string
  videoLink: string
  files: ProjectFileMeta[]
  status: 'submitted' | 'under-review' | 'shortlisted' | 'rejected'
  submittedAt: string
}

export interface Judge {
  id: string
  name: string
  expertise: string
  email: string
}

export interface Evaluation {
  id: string
  registrationId: string
  judgeId: string
  innovation: number
  technical: number
  impact: number
  presentation: number
  total: number
  comments: string
  createdAt: string
}

export interface Announcement {
  id: string
  title: string
  body: string
  date: string
  pinned: boolean
}

export interface Settings {
  eventName: string
  tagline: string
  institution: string
  regOpen: string
  regClose: string
  eventDate: string
  venue: string
  submissionDeadline: string
  shortlistDate: string
  finalDate: string
  awardDate: string
  registrationFee: string
  firstPrize: string
  secondPrize: string
  thirdPrize: string
  contactEmail: string
  contactPhone: string
  address: string
  facultyCoordinator: string
  facultyPhone: string
  studentCoordinators: string
}

export const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4'

export const TBA = 'To be announced'

const K = {
  settings: 'appthon_settings_v1',
  regs: 'appthon_registrations_v1',
  subs: 'appthon_submissions_v1',
  judges: 'appthon_judges_v1',
  evals: 'appthon_evaluations_v1',
  announcements: 'appthon_announcements_v1',
  outbox: 'appthon_email_outbox_v1',
  admin: 'appthon_admin_session_v1',
}

export const DEFAULT_SETTINGS: Settings = {
  eventName: 'AppThon',
  tagline: 'From Idea to Impact',
  institution: TBA,
  regOpen: TBA,
  regClose: TBA,
  eventDate: TBA,
  venue: TBA,
  submissionDeadline: TBA,
  shortlistDate: TBA,
  finalDate: TBA,
  awardDate: TBA,
  registrationFee: TBA,
  firstPrize: TBA,
  secondPrize: TBA,
  thirdPrize: TBA,
  contactEmail: TBA,
  contactPhone: TBA,
  address: TBA,
  facultyCoordinator: TBA,
  facultyPhone: TBA,
  studentCoordinators: TBA,
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}
function write<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage full / private mode — UI still works in-memory for the session */
  }
}
export function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

/* ---------- Settings ---------- */
export function getSettings(): Settings {
  return { ...DEFAULT_SETTINGS, ...read<Partial<Settings>>(K.settings, {}) }
}
export function saveSettings(s: Settings) {
  write(K.settings, s)
}

/* ---------- Announcements ---------- */
const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Registrations open soon',
    body: 'AppThon — From Idea to Impact is an inter-collegiate innovation and application competition. Registration dates, venue and prizes will be published here as soon as the organising institution confirms them.',
    date: new Date().toISOString(),
    pinned: true,
  },
  {
    id: 'ann-2',
    title: 'Four categories, one stage',
    body: 'Apply under Application Development, Business Innovation, E-commerce Solutions or Emerging Technology. Read the category page for eligibility and submission requirements before you register.',
    date: new Date().toISOString(),
    pinned: false,
  },
]
export function getAnnouncements(): Announcement[] {
  const list = read<Announcement[]>(K.announcements, [])
  if (!list.length) {
    write(K.announcements, DEFAULT_ANNOUNCEMENTS)
    return DEFAULT_ANNOUNCEMENTS
  }
  return list
}
export function saveAnnouncements(list: Announcement[]) {
  write(K.announcements, list)
}

/* ---------- Registrations ---------- */
function sampleRegistrations(): Registration[] {
  const now = new Date().toISOString()
  const base = (over: Partial<Registration>): Registration => ({
    id: uid(),
    registrationId: 'APP-2026-1001',
    fullName: 'Sample Student',
    email: 'sample@college.edu',
    phone: '9876543210',
    college: 'Sample College of Engineering',
    department: 'Computer Science',
    year: '3rd Year',
    city: 'Bengaluru',
    state: 'Karnataka',
    participationType: 'team',
    teamName: 'Sample Team',
    teamLeader: 'Sample Student',
    teamSize: 3,
    members: [
      { name: 'Sample Student', email: 'sample@college.edu', phone: '9876543210', role: 'Team Leader' },
      { name: 'Asha Rao', email: 'asha@college.edu', phone: '9876500001', role: 'Developer' },
    ],
    projectTitle: 'CampusCart — a campus marketplace app',
    category: 'E-commerce Solutions',
    problemStatement: 'Students struggle to buy and sell used books and notes on campus.',
    projectDescription: 'A mobile marketplace for verified campus buyers and sellers.',
    innovation: 'Verified college-ID listings with in-campus pickup slots.',
    technologies: 'React Native, Supabase',
    stage: 'Prototype',
    demoLink: '',
    consent: true,
    status: 'pending',
    createdAt: now,
    isSample: true,
    ...over,
  })
  return [
    base({}),
    base({
      registrationId: 'APP-2026-1002',
      fullName: 'Rohan Mehta',
      email: 'rohan@college.edu',
      college: 'National Institute of Technology',
      projectTitle: 'MediTrack — medicine reminders for elders',
      category: 'Application Development',
      status: 'approved',
      participationType: 'individual',
      teamName: '',
      teamSize: 1,
    }),
    base({
      registrationId: 'APP-2026-1003',
      fullName: 'Priya Nair',
      email: 'priya@college.edu',
      college: 'Sample College of Engineering',
      projectTitle: 'AgriSense — crop-price forecasting',
      category: 'Emerging Technology',
      status: 'shortlisted',
      technologies: 'Python, Machine Learning',
    }),
  ]
}

export function getRegistrations(): Registration[] {
  const list = read<Registration[]>(K.regs, [])
  if (!list.length) {
    const seed = sampleRegistrations()
    write(K.regs, seed)
    return seed
  }
  return list
}
export function saveRegistrations(list: Registration[]) {
  write(K.regs, list)
}

export function nextRegistrationId(list: Registration[]): string {
  const nums = list
    .map((r) => parseInt(r.registrationId.replace(/\D/g, '').slice(-4), 10))
    .filter((n) => !Number.isNaN(n))
  const next = (nums.length ? Math.max(...nums) : 1000) + 1
  return `APP-2026-${next}`
}

export function findDuplicate(email: string, phone: string, list: Registration[]): Registration | null {
  const e = email.trim().toLowerCase()
  const p = phone.replace(/\D/g, '')
  return (
    list.find(
      (r) => r.email.trim().toLowerCase() === e || r.phone.replace(/\D/g, '') === p,
    ) ?? null
  )
}

export async function createRegistration(
  data: Omit<Registration, 'id' | 'registrationId' | 'status' | 'createdAt'>,
): Promise<{ reg: Registration; duplicate: Registration | null }> {
  const list = getRegistrations()
  const duplicate = findDuplicate(data.email, data.phone, list)
  if (duplicate) return { reg: duplicate, duplicate }
  const reg: Registration = {
    ...data,
    id: uid(),
    registrationId: nextRegistrationId(list),
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  const next = [reg, ...list]
  saveRegistrations(next)
  // Best-effort Supabase sync — never blocks the confirmation screen.
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('registrations').insert({
        registration_id: reg.registrationId,
        full_name: reg.fullName,
        email: reg.email,
        phone: reg.phone,
        college: reg.college,
        department: reg.department,
        year_of_study: reg.year,
        city: reg.city,
        state: reg.state,
        participation_type: reg.participationType,
        team_name: reg.teamName || null,
        team_leader: reg.teamLeader || null,
        team_size: reg.teamSize,
        project_title: reg.projectTitle,
        category: reg.category,
        problem_statement: reg.problemStatement,
        project_description: reg.projectDescription,
        innovation: reg.innovation,
        technologies: reg.technologies,
        development_stage: reg.stage,
        demo_link: reg.demoLink || null,
        status: reg.status,
      })
    } catch {
      /* local copy is already saved; admin can retry the sync later */
    }
  }
  return { reg, duplicate: null }
}

export function updateRegistrationStatus(id: string, status: RegistrationStatus) {
  const list = getRegistrations().map((r) => (r.id === id ? { ...r, status } : r))
  saveRegistrations(list)
  return list
}

export function findRegistration(registrationId: string, email: string): Registration | null {
  const list = getRegistrations()
  const rid = registrationId.trim().toUpperCase()
  const em = email.trim().toLowerCase()
  return list.find((r) => r.registrationId.toUpperCase() === rid && r.email.trim().toLowerCase() === em) ?? null
}

export async function fetchRegistrationsFromSupabase(): Promise<Registration[] | null> {
  if (!isSupabaseConfigured || !supabase) return null
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false })
    if (error || !data) return null
    return data.map((row: Record<string, unknown>) => ({
      id: String(row.id ?? uid()),
      registrationId: String(row.registration_id ?? ''),
      fullName: String(row.full_name ?? ''),
      email: String(row.email ?? ''),
      phone: String(row.phone ?? ''),
      college: String(row.college ?? ''),
      department: String(row.department ?? ''),
      year: String(row.year_of_study ?? ''),
      city: String(row.city ?? ''),
      state: String(row.state ?? ''),
      participationType: (row.participation_type as ParticipationType) ?? 'individual',
      teamName: String(row.team_name ?? ''),
      teamLeader: String(row.team_leader ?? ''),
      teamSize: Number(row.team_size ?? 1),
      members: [],
      projectTitle: String(row.project_title ?? ''),
      category: String(row.category ?? ''),
      problemStatement: String(row.problem_statement ?? ''),
      projectDescription: String(row.project_description ?? ''),
      innovation: String(row.innovation ?? ''),
      technologies: String(row.technologies ?? ''),
      stage: String(row.development_stage ?? ''),
      demoLink: String(row.demo_link ?? ''),
      consent: true,
      status: (row.status as RegistrationStatus) ?? 'pending',
      createdAt: String(row.created_at ?? new Date().toISOString()),
    }))
  } catch {
    return null
  }
}

/* ---------- Project submissions ---------- */
export function getSubmissions(): ProjectSubmission[] {
  return read<ProjectSubmission[]>(K.subs, [])
}
export function saveSubmissions(list: ProjectSubmission[]) {
  write(K.subs, list)
}
export async function createSubmission(
  sub: Omit<ProjectSubmission, 'id' | 'status' | 'submittedAt'>,
): Promise<ProjectSubmission> {
  const full: ProjectSubmission = {
    ...sub,
    id: uid(),
    status: 'submitted',
    submittedAt: new Date().toISOString(),
  }
  const existing = getSubmissions()
  const idx = existing.findIndex((s) => s.registrationId === sub.registrationId)
  const next = idx >= 0 ? existing.map((s, i) => (i === idx ? full : s)) : [full, ...existing]
  saveSubmissions(next)
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('projects').insert({
        registration_id: sub.registrationId,
        title: sub.projectTitle,
        description: sub.description,
        demo_link: sub.demoLink || null,
        video_link: sub.videoLink || null,
        status: 'submitted',
      })
    } catch {
      /* local copy already saved */
    }
  }
  return full
}

/* ---------- Judges & evaluations ---------- */
export function getJudges(): Judge[] {
  const list = read<Judge[]>(K.judges, [])
  if (!list.length) {
    const seed: Judge[] = [
      { id: 'j1', name: 'Dr. Ananya Sharma', expertise: 'Software Engineering', email: 'ananya@institution.edu' },
      { id: 'j2', name: 'Prof. Karthik Rao', expertise: 'Entrepreneurship', email: 'karthik@institution.edu' },
      { id: 'j3', name: 'Ms. Divya Iyer', expertise: 'Product & UX', email: 'divya@institution.edu' },
    ]
    write(K.judges, seed)
    return seed
  }
  return list
}
export function saveJudges(list: Judge[]) {
  write(K.judges, list)
}
export function getEvaluations(): Evaluation[] {
  return read<Evaluation[]>(K.evals, [])
}
export function saveEvaluation(ev: Omit<Evaluation, 'id' | 'total' | 'createdAt'>): Evaluation {
  const full: Evaluation = {
    ...ev,
    id: uid(),
    total: ev.innovation + ev.technical + ev.impact + ev.presentation,
    createdAt: new Date().toISOString(),
  }
  saveEvaluations([full, ...getEvaluations()])
  return full
}
export function saveEvaluations(list: Evaluation[]) {
  write(K.evals, list)
}

/* ---------- Email outbox (Resend queue, visible in Admin) ---------- */
export interface QueuedEmail {
  id: string
  type: 'confirmation' | 'approval' | 'rejection' | 'announcement'
  to: string
  subject: string
  body: string
  status: 'queued' | 'sent' | 'failed'
  createdAt: string
}
export function getOutbox(): QueuedEmail[] {
  return read<QueuedEmail[]>(K.outbox, [])
}
export async function queueEmail(
  type: QueuedEmail['type'],
  to: string,
  subject: string,
  body: string,
): Promise<QueuedEmail> {
  const entry: QueuedEmail = {
    id: uid(),
    type,
    to,
    subject,
    body,
    status: 'queued',
    createdAt: new Date().toISOString(),
  }
  const next = [entry, ...getOutbox()]
  write(K.outbox, next)
  // Try the real Resend Edge Function when Supabase is configured.
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.functions.invoke('send-confirmation', {
        body: { type, to, subject, body },
      })
      if (!error) {
        write(
          K.outbox,
          getOutbox().map((e) => (e.id === entry.id ? { ...e, status: 'sent' as const } : e)),
        )
        return { ...entry, status: 'sent' }
      }
    } catch {
      /* stays queued — Admin can see it and resend once Resend is connected */
    }
  }
  return entry
}

/* ---------- Admin session ---------- */
export const DEMO_ADMIN = { email: 'admin@appthon.in', password: 'AppThon@2026' }
export function isAdminLoggedIn(): boolean {
  try {
    return localStorage.getItem(K.admin) === '1'
  } catch {
    return false
  }
}
export function setAdminLoggedIn(v: boolean) {
  try {
    if (v) localStorage.setItem(K.admin, '1')
    else localStorage.removeItem(K.admin)
  } catch {
    /* ignore */
  }
}
