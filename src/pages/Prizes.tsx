import { Award, Medal, Trophy } from 'lucide-react'
import { PageHero } from '../components/Hero'
import { Badge, Card } from '../components/ui'
import { getSettings } from '../lib/store'

export default function Prizes() {
  const s = getSettings()
  const prizes = [
    { icon: Trophy, place: 'First Prize', value: s.firstPrize, note: 'Overall best project, based on the judges’ evaluation.' },
    { icon: Medal, place: 'Second Prize', value: s.secondPrize, note: 'Second-highest project score, based on the judges’ evaluation.' },
    { icon: Award, place: 'Participation Certificates', value: 'For participants', note: 'Participation certificates are provided for participants with a valid submission.' },
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
    </>
  )
}
