import { Mail, MapPin, Phone, User, Users } from 'lucide-react'
import { PageHero } from '../components/Hero'
import { Card } from '../components/ui'
import { getSettings } from '../lib/store'

export default function Contact() {
  const s = getSettings()
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to the team."
        subtext="Coordinator details are published here once confirmed by the organising institution. Until then, use the official email below."
      />
      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
        <Card className="!p-8">
          <MapPin className="w-6 h-6 text-brand" />
          <h2 className="font-display text-3xl mt-4">Institution</h2>
          <p className="text-white/70 leading-relaxed mt-3">{s.institution}</p>
          <p className="text-white/60 text-sm leading-relaxed mt-2">{s.address}</p>
          <p className="text-sm text-white/60 mt-3">Venue: {s.venue}</p>
        </Card>
        <Card className="!p-8">
          <User className="w-6 h-6 text-brand" />
          <h2 className="font-display text-3xl mt-4">Faculty coordinator</h2>
          <p className="text-white/80 mt-3">{s.facultyCoordinator}</p>
          <p className="text-white/60 text-sm mt-1 flex items-center gap-2"><Phone className="w-4 h-4" /> {s.facultyPhone}</p>
          <p className="text-white/60 text-sm mt-1 flex items-center gap-2"><Mail className="w-4 h-4" /> {s.contactEmail}</p>
        </Card>
        <Card className="!p-8">
          <Users className="w-6 h-6 text-brand" />
          <h2 className="font-display text-3xl mt-4">Student coordinators</h2>
          <p className="text-white/70 leading-relaxed mt-3 whitespace-pre-line">{s.studentCoordinators}</p>
          <p className="text-white/60 text-sm mt-3 flex items-center gap-2"><Mail className="w-4 h-4" /> {s.contactEmail}</p>
          <p className="text-white/60 text-sm mt-1 flex items-center gap-2"><Phone className="w-4 h-4" /> {s.contactPhone}</p>
        </Card>
      </section>
    </>
  )
}
