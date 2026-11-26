import { CalendarDays } from 'lucide-react'
import { PageHero } from '../components/Hero'
import { Card } from '../components/ui'
import { getSettings } from '../lib/store'

export default function Schedule() {
  const s = getSettings()
  const steps = [
    { label: 'Registration opens', date: s.regOpen, note: 'Registration form goes live on this site.' },
    { label: 'Registration closes', date: s.regClose, note: 'No new registrations after this date.' },
    { label: 'Project submission deadline', date: s.submissionDeadline, note: 'Last chance to submit or replace your project.' },
    { label: 'Shortlisting announcement', date: s.shortlistDate, note: 'Shortlisted teams are emailed and listed in the Admin / Home announcements.' },
    { label: 'Competition rounds', date: s.eventDate, note: 'Judging rounds and demos, as per the event-day schedule.' },
    { label: 'Final presentation', date: s.finalDate, note: 'Shortlisted teams present live to the judges.' },
    { label: 'Award ceremony', date: s.awardDate, note: 'First Prize and Second Prize are announced.' },
  ]
  return (
    <>
      <PageHero
        eyebrow="Event Schedule"
        title="Every date, in order."
        subtext="Dates marked “To be announced” are confirmed by the organisers and updated here — and announced on the Home page when they change."
      />
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="relative pl-8 space-y-5">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/15" />
          {steps.map((step, i) => (
            <Card key={step.label} className="!p-6 relative">
              <span className="absolute -left-8 top-6 w-4 h-4 rounded-full bg-brand ring-4 ring-midnight" />
              <div className="flex flex-wrap justify-between gap-2">
                <h2 className="font-display text-3xl">{i + 1}. {step.label}</h2>
                <span className="inline-flex items-center gap-1.5 text-sm text-brand-bright"><CalendarDays className="w-4 h-4" />{step.date}</span>
              </div>
              <p className="text-sm text-white/60 mt-2">{step.note}</p>
            </Card>
          ))}
        </div>
        <p className="text-sm text-white/50 text-center mt-10">
          Venue: {s.venue} · Event date: {s.eventDate} · Registration fee: {s.registrationFee}
        </p>
      </section>
    </>
  )
}
