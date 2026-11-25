import { Award, GraduationCap, Medal, Sparkles, Trophy } from 'lucide-react'
import { PageHero } from '../components/Hero'
import { Badge, Card } from '../components/ui'
import { getSettings } from '../lib/store'

export default function Prizes() {
  const s = getSettings()
  const prizes = [
    { icon: Trophy, place: 'First Prize', value: s.firstPrize, note: 'Winner — overall best project across categories, by total judges’ score.' },
    { icon: Medal, place: 'Second Prize', value: s.secondPrize, note: 'Runner-up — second-highest total score.' },
    { icon: Medal, place: 'Third Prize', value: s.thirdPrize, note: 'Third place — third-highest total score.' },
  ]
  return (
    <>
      <PageHero
        eyebrow="Prizes & Recognition"
        title="Worth building for."
        subtext="Prize amounts are published here only when the organisers confirm them. Until then they read “To be announced” — this site does not invent prize money."
      />
      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-4">
        {prizes.map((p, i) => (
          <Card key={p.place} className={`!p-8 text-center ${i === 0 ? 'border-brand/40 bg-brand/10' : ''}`}>
            <p.icon className="w-9 h-9 text-brand mx-auto" />
            <p className="text-xs tracking-[0.25em] uppercase text-white/50 mt-4">{p.place}</p>
            <p className="font-display text-4xl mt-2">{p.value}</p>
            <p className="text-sm text-white/60 leading-relaxed mt-3">{p.note}</p>
            {i === 0 && <Badge className="mt-4">Overall winner</Badge>}
          </Card>
        ))}
      </section>
      <section className="max-w-7xl mx-auto px-6 pb-20 grid md:grid-cols-3 gap-4">
        {[
          { icon: Award, title: 'Participation certificates', text: 'Every participant with a valid, on-time submission receives a participation certificate. Winners receive separate winner certificates.' },
          { icon: Sparkles, title: 'Special recognition', text: 'Category-best awards, Best Innovation, Best Presentation and similar special mentions may be awarded at the judges’ discretion and announced at the award ceremony.' },
          { icon: GraduationCap, title: 'Mentorship opportunities', text: 'Mentorship for shortlisted / winning teams is offered if confirmed by the organisers — it is not guaranteed until announced here. Check this page and the Home announcements for confirmation.' },
        ].map((c) => (
          <Card key={c.title} className="!p-7">
            <c.icon className="w-6 h-6 text-brand" />
            <h3 className="font-display text-3xl mt-4">{c.title}</h3>
            <p className="text-sm text-white/60 leading-relaxed mt-2">{c.text}</p>
          </Card>
        ))}
      </section>
    </>
  )
}
