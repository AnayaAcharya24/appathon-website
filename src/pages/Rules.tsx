import { AlertTriangle, Scale, ShieldCheck, Users } from 'lucide-react'
import { PageHero, SectionHead } from '../components/Hero'
import { Card } from '../components/ui'
import { EVALUATION_CRITERIA } from '../data/content'

const SECTIONS = [
  {
    icon: Users,
    title: 'Eligibility',
    items: [
      'Open exclusively to students currently enrolled in undergraduate (UG) degree programmes.',
      'Each registration must include exactly two participants: one Team Leader and one Team Partner.',
      'Every team must develop an application based on the single Social Impact theme.',
      'Participants must register with a valid college email and mobile number and keep their registration ID.',
    ],
  },
  {
    icon: Users,
    title: 'Team participation rules',
    items: [
      'One registration per team, filed by the team leader. All members must be named at registration.',
      'Team composition cannot change after the submission deadline without coordinator approval.',
      'Only registered members may present in the final round.',
      'A team may submit one project only, under the Social Impact theme.',
    ],
  },
  {
    icon: ShieldCheck,
    title: 'Project originality',
    items: [
      'Projects must be the team’s own original work. Third-party libraries, APIs and open-source code must be credited.',
      'Submitting someone else’s project, or a project already submitted to Appathon in a previous edition, is disallowed.',
      'AI tools may assist (code, copy, design) but the team must be able to explain and defend every part of the submission.',
      'Plagiarised, purchased or copied projects will be disqualified at any stage, including after prizes are announced.',
    ],
  },
  {
    icon: Scale,
    title: 'Submission guidelines',
    items: [
      'Register first, then submit through the Project Submission page before the published deadline.',
      'Supporting documents: PDF / DOC / PPT / ZIP / images / video, max 10 MB per file, max 5 files.',
      'Demo links must be live at judging time. A broken demo link counts against the technical score.',
      'Late submissions are not accepted unless the organisers extend the deadline publicly.',
    ],
  },
]

export default function Rules() {
  return (
    <>
      <PageHero
        eyebrow="Rules & Guidelines"
        title="Play fair. Build honestly."
        subtext="Read these before you register. By submitting, you agree to every rule on this page. Organisers’ decisions on eligibility and disqualification are final."
      />
      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-4">
        {SECTIONS.map((s) => (
          <Card key={s.title} className="!p-7">
            <s.icon className="w-6 h-6 text-brand" />
            <h2 className="font-display text-3xl mt-4">{s.title}</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-white/70 leading-relaxed list-disc pl-5">
              {s.items.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </Card>
        ))}
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <SectionHead eyebrow="Evaluation criteria" title="How you are scored." sub="Every project is scored out of 25 per criterion (100 total) by at least two judges. Shortlisted teams present live in the final round." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {EVALUATION_CRITERIA.map((c) => (
            <Card key={c.name}>
              <p className="font-display text-4xl text-brand">{c.weight}</p>
              <h3 className="font-medium mt-3">{c.name}</h3>
              <p className="text-sm text-white/60 leading-relaxed mt-2">{c.detail}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <Card className="!p-8 border-red-400/25">
          <AlertTriangle className="w-7 h-7 text-red-400" />
          <h2 className="font-display text-4xl mt-4">Disqualification rules</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70 leading-relaxed list-disc pl-5">
            <li>Plagiarism, misrepresentation of authorship, or submitting another team’s work.</li>
            <li>Duplicate registrations to game shortlisting, or registering under false college / identity details.</li>
            <li>Offensive, discriminatory or unlawful content in the project, demo or presentation.</li>
            <li>Attempting to influence judges, or sharing confidential judging information.</li>
            <li>Missing the submission deadline or failing verification (registration ID + email).</li>
          </ul>
          <p className="text-sm text-white/50 mt-5">Disqualified teams forfeit prizes and certificates. The organisers may publish the reason in general terms; individual scores are not published.</p>
        </Card>
      </section>
    </>
  )
}
