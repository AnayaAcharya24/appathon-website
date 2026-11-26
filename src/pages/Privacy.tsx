import { PageHero } from '../components/Hero'
import { Card } from '../components/ui'

export default function Privacy() {
  return (
    <>
      <PageHero
        eyebrow="Privacy & Consent"
        title="Your data, your call."
        subtext="Short version: we use your details only to run Appathon. We never sell participant data."
      />
      <section className="max-w-3xl mx-auto px-6 py-16 pb-20 space-y-4">
        {[
          { t: 'What we collect', b: 'Name, email, mobile, college, department, year, city/state, team details, and your project details (title, description, links, uploaded files). Nothing else is collected from the registration or submission forms.' },
          { t: 'Why we collect it', b: 'To register you, verify you at submission time, judge your project, contact you about shortlisting and results, and issue certificates. That is the whole purpose.' },
          { t: 'Who sees it', b: 'Organisers, coordinators and judges. Judges see project material and the details needed to evaluate it under the Social Impact theme. Your data is not shared with sponsors or third parties for marketing.' },
          { t: 'Files & links', b: 'Uploaded documents are stored in Supabase Storage (private bucket, signed access) when Supabase is connected, or recorded locally in demo mode. Demo / video links you provide are opened by judges to evaluate your work.' },
          { t: 'How long we keep it', b: 'For the duration of the competition and the certificate / records period afterwards, as decided by the organising institution. Ask the coordinators if you want your record deleted after the event.' },
          { t: 'Your consent', b: 'Registering means you consent to the above, and you confirm the information is true and the project is your team’s original work. You can withdraw by contacting the coordinators before judging begins — your registration will be removed.' },
          { t: 'Security', b: 'The site uses Supabase Auth for admin access, Row Level Security on all tables, server-side validation, file-type/size limits and duplicate-submission checks. Admin credentials are never stored in frontend code. See supabase/schema.sql and the README for the full setup.' },
        ].map((s) => (
          <Card key={s.t}>
            <h2 className="font-display text-3xl">{s.t}</h2>
            <p className="text-white/65 leading-relaxed mt-2 text-sm">{s.b}</p>
          </Card>
        ))}
      </section>
    </>
  )
}
