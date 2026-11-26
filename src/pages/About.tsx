import { Compass, Eye, GraduationCap, Rocket, Target, Users } from 'lucide-react'
import { PageHero, SectionHead } from '../components/Hero'
import { Card } from '../components/ui'
import { getSettings } from '../lib/store'

export default function About() {
  const settings = getSettings()
  return (
    <>
      <PageHero
        eyebrow="About Appathon"
        title="Technology meets possibility."
        subtext="Appathon — From Idea to Impact is an inter-collegiate innovation and application competition. It exists for one reason: to give students a real stage to turn what they learn into what they can build."
      />
      <section className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12">
        <div>
          <SectionHead
            eyebrow="Introduction"
            title="An idea is only the start."
            sub="Every product, startup and research breakthrough began as a rough idea in someone's notebook. Appathon is the space between that notebook and the real world — a competition where students design, build, test and present applications and business ideas, and get honest feedback from people who build for a living."
          />
          <p className="text-white/60 leading-relaxed mt-6">
            Participants work in the open: a real social problem, a real user, and a working
            application. Every team develops an application under the single Social Impact theme,
            using technology creatively to address community needs and improve lives.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: Eye, title: 'Vision', text: 'A generation of students who don’t wait for permission to build — who see a problem and ship a solution.' },
            { icon: Target, title: 'Mission', text: 'To give every participating student a fair, rigorous, encouraging platform to build, present and improve a real idea.' },
            { icon: Compass, title: 'How we judge', text: 'On what works, who it helps, and how clearly the team can explain it — not on polish alone.' },
            { icon: Rocket, title: 'What you leave with', text: 'A working project, judges’ feedback, a participation certificate, and the opportunity to compete for First Prize or Second Prize.' },
          ].map((c) => (
            <Card key={c.title}>
              <c.icon className="w-6 h-6 text-brand" />
              <h3 className="font-display text-2xl mt-4">{c.title}</h3>
              <p className="text-sm text-white/60 leading-relaxed mt-2">{c.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <SectionHead eyebrow="Objectives" title="What Appathon is trying to do." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {[
            'Encourage students to build innovative applications that solve real problems.',
            'Develop practical solutions that address community needs and can create lasting impact.',
            'Use technology creatively to solve meaningful social problems from campuses and communities.',
            'Teach teams to present, defend and iterate on their work under real evaluation.',
            'Connect students with judges and peers from other colleges.',
            'Create a portfolio-grade project every participant can show to employers and collaborators.',
          ].map((o, i) => (
            <Card key={o}>
              <span className="font-display text-4xl text-brand">0{i + 1}</span>
              <p className="leading-relaxed mt-3 text-white/80">{o}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20 grid lg:grid-cols-2 gap-4">
        <Card className="!p-8">
          <GraduationCap className="w-7 h-7 text-brand" />
          <h3 className="font-display text-4xl mt-4">Why participate?</h3>
          <ul className="mt-5 space-y-3 text-white/70 leading-relaxed list-disc pl-5">
            <li>You finish with a working product — the strongest thing a student portfolio can hold.</li>
            <li>You learn to scope, build and demo under a deadline, the way real teams work.</li>
            <li>Judges’ scores and comments tell you exactly what to improve next.</li>
            <li>First Prize and Second Prize are awarded as confirmed by the organisers; every valid submission earns a participation certificate.</li>
            <li>You meet builders from other colleges — future co-founders, teammates and friends.</li>
          </ul>
        </Card>
        <Card className="!p-8">
          <Users className="w-7 h-7 text-brand" />
          <h3 className="font-display text-4xl mt-4">Organising institution</h3>
          <p className="text-white/70 leading-relaxed mt-4">
            Appathon is organised by <strong className="text-white">{settings.institution}</strong>.
            Institution details, faculty coordinator and student coordinators are published on the
            Contact page as soon as they are confirmed by the organisers.
          </p>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-white/10 pb-3"><dt className="text-white/50">Event date</dt><dd>{settings.eventDate}</dd></div>
            <div className="flex justify-between gap-4 border-b border-white/10 pb-3"><dt className="text-white/50">Venue</dt><dd>{settings.venue}</dd></div>
            <div className="flex justify-between gap-4 border-b border-white/10 pb-3"><dt className="text-white/50">Registration</dt><dd>{settings.regOpen} → {settings.regClose}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-white/50">Contact</dt><dd>{settings.contactEmail}</dd></div>
          </dl>
          <p className="text-xs text-white/40 mt-6">
            Fields marked “To be announced” are editable placeholders in the Admin dashboard —
            they are filled in by the organisers, never invented by this website.
          </p>
        </Card>
      </section>
    </>
  )
}
