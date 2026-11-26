# Appathon — From Idea to Impact

A complete, working inter-collegiate innovation & application competition website:
information portal + participant registration + project submission + admin
competition-management system.

**Design:** the Velorah-style cinematic hero from the brief — fullscreen looping
background video, glassmorphic navigation, Instrument Serif display type + Inter
body, dark navy (`201 100% 13%`) with Electric Orange (`#FF5A1F`) as the Appathon
accent. Liquid-glass buttons use the exact `.liquid-glass` CSS from the spec,
with `fade-rise` entrance animations (0s / 0.2s / 0.4s).

**Stack in this repo:** React 19 + Vite + TypeScript + Tailwind CSS 3 + shadcn/ui-style
primitives (`src/components/ui.tsx`), React Router.
**Stack in the master prompt:** Next.js, Supabase, Resend, Vercel. This repo is
built on Vite (per the hero-design instruction) with the Supabase / Resend /
Vercel wiring included — see “Going live” below. The data layer
(`src/lib/store.ts` + `src/lib/supabase.ts`) already talks to Supabase when it
is configured, and falls back to localStorage so the whole site works offline
for testing.

> **Honest placeholders:** the brief says *do not invent* competition dates,
> prizes, institution details, registration fees or contact information. Every
> one of those fields ships as **“To be announced”** and is editable in
> **Admin → Content & Dates**. Fill them in there — never in code.

## Pages (all navigation links work)

| Route | Page |
|---|---|
| `/` | Home — video hero, intro, dates/venue, highlights, categories, prizes, announcements |
| `/about` | About — vision, mission, objectives, why participate, organising institution |
| `/categories` | 4 editable categories with eligibility + submission requirements |
| `/register` | Full registration form (participant / team / project) |
| `/submit` | Project submission — verify by registration ID + email, upload files, demo/video links |
| `/rules` | Eligibility, team rules, originality, submission, evaluation, disqualification |
| `/prizes` | 1st / 2nd / 3rd, certificates, special recognition, mentorship (if confirmed) |
| `/schedule` | Registration → submission → shortlisting → rounds → final → awards |
| `/faq` | Expandable FAQ |
| `/contact` | Institution, faculty + student coordinators, email, phone, address |
| `/privacy` | Privacy & consent |
| `/admin` | Password-protected admin portal (see below) |

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc + vite build
npm run preview    # serve the production build
```

## Registration — how it works

1. Participant, team (individual or 2–4 members, with member details) and
   project sections, with client-side validation on every required field.
2. **Duplicate check:** same email *or* same mobile number → the form stops
   and shows the existing registration ID instead of creating a second record.
3. A unique ID is generated (`APP-2026-1001`, `1002`, …) and shown on a
   confirmation screen with a copy button.
4. A confirmation email is queued (Admin → Emails). With Supabase + Resend
   connected it is sent; without it, it stays visibly “queued” — never silently lost.

## Project submission — how it works

1. Verify with **registration ID + registered email** (both must match).
2. Edit title/description, add demo + video links.
3. Upload supporting files: PDF / DOC / PPT / ZIP / PNG / JPG / MP4, **max
   10 MB each, max 5 files**. With Supabase connected, files go to the
   private Storage bucket `project-files`; otherwise name/size are recorded
   with the submission and the file-upload limitation is stated on the page.
4. Re-submitting before the deadline replaces the earlier version.
5. Status is shown on the confirmation screen and in Admin → Projects.

## Admin portal (`/admin`)

Demo login (change before any real deployment):

- Email: `admin@appthon.in`
- Password: `Appathon@2026`

Features, all working:

- **Overview:** total registrations, participating colleges, teams, projects,
  pending / approved / rejected / shortlisted counts.
- **Registrations:** search by name / college / project / ID, filter by
  category and status, open a full application, **approve / reject / shortlist**
  (approval & rejection queue an email), **export the filtered list to CSV**
  (Excel-compatible).
- **Projects:** every submission with files, demo/video links, status and
  average judge score; shortlist from here.
- **Judges & Scores:** add/remove judges, assign a judge to a project and
  record scores — Innovation / Technical / Impact / Presentation, each out of
  25 (100 total), with comments. Averages appear on the Projects tab.
- **Content & Dates:** edit every “To be announced” field (dates, venue,
  prizes, fees, contacts, coordinators) and publish announcements — they
  appear on Home immediately.
- **Emails:** the full automation log (confirmation / approval / rejection /
  submission), with queued vs sent status.

Three clearly-marked **sample registrations** are seeded on first run so the
dashboard can be explored immediately. Delete them (or clear the browser’s
localStorage keys `appthon_*`) before real registrations open.

## Going live — Supabase, Resend, Vercel

The brief asked for Next.js + Supabase + Resend + Vercel. This build ships
the Vite frontend the hero design specified, plus the full backend wiring:

1. **Supabase project** — create one, then run `supabase/schema.sql` in the
   SQL Editor. It creates all 10 tables (participants, teams, team_members,
   registrations, projects, project_files, announcements, judges, evaluations,
   admin_users), relationships, unique registration IDs and Row Level Security.
   Create the private Storage bucket `project-files`.
2. **Env vars** — copy `.env.example` to `.env` and set
   `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (anon key only — the
   **service-role key must never go in frontend code**). Set the same vars in
   Vercel. With them set, registrations/submissions sync to Supabase and
   files upload to Storage; without them the site runs in local demo mode and
   says so in Admin.
3. **Email (Resend)** — deploy the Edge Function and set its secret:
   ```bash
   supabase functions deploy send-confirmation
   supabase secrets set RESEND_API_KEY=re_... RESEND_FROM="Appathon <noreply@appthon.in>"
   ```
   Alternative: use `api/send-email.ts` as a Vercel Serverless Function with
   `RESEND_API_KEY` / `RESEND_FROM` set in Vercel env (server-side only).
4. **Admin auth (do this before real use)** — the demo password login in
   `src/lib/store.ts` (`DEMO_ADMIN`) is for evaluation only. Replace it with
   Supabase Auth: create admin users in `admin_users`, sign in with
   `supabase.auth.signInWithPassword`, and gate the Admin routes on the
   `admin_users` role. The schema and RLS comments in `supabase/schema.sql`
   show the exact policy to add.
5. **Vercel** — import the repo, framework **Vite**, build command
   `npm run build`, output `dist`. `vercel.json` already contains the SPA
   rewrite so deep links (`/register`, `/admin`, …) work on refresh.

## Security & reliability (implemented)

- Server-side validation is enforced by the database too: `CHECK`
  constraints (team size 1–4, scores 0–25, file size ≤ 10 MB), unique email /
  registration ID, and RLS policies (public may insert a registration or a
  project and read announcements — nothing else).
- File type/size limits on the Submit page; private Storage bucket (signed
  access, not public URLs).
- Duplicate-registration and duplicate-submission protection in the app and
  in the schema.
- Privacy consent checkbox is required on registration; see `/privacy`.
- **Backup:** Supabase provides point-in-time recovery for the database and
  Storage versioning for files. In local demo mode, export CSV from Admin
  regularly — that export *is* the backup.

## What was tested here

- `npm run build` (tsc + Vite) — clean.
- `vite preview` — HTTP 200 on `/`, and every route in the table above
  returns the SPA shell (client-side routing).
- Registration flow exercised end-to-end in the built app (validation errors,
  duplicate block, confirmation screen with a real generated ID); admin login,
  approve/reject, CSV export and score recording verified against the same
  local store the UI reads.
- **Not yet tested:** a live Supabase project, a real Resend send, and a
  Vercel deployment — those need your project keys (steps 1–5 above). The
  site tells you in Admin which mode it is in, so there is no silent
  “it worked in demo” surprise.

## Project layout

```
src/
  components/  Layout (glass nav + footer), Hero (video hero), ui (shadcn-style)
  data/        content.ts — categories, FAQs, evaluation criteria
  lib/         store.ts (data + Supabase sync), supabase.ts, utils.ts
  pages/       Home, About, Categories, Register, Submit, Rules, Prizes,
               Schedule, FAQ, Contact, Privacy, Admin
supabase/      schema.sql, functions/send-confirmation/ (Resend Edge Function)
api/           send-email.ts (Vercel alternative to the Edge Function)
```
