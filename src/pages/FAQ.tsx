import { ChevronDown, MessageCircleQuestion } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHero } from '../components/Hero'
import { FAQS } from '../data/content'

export default function FAQ() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Questions, answered."
        subtext="Tap a question to expand it. Still stuck? The Contact page has the coordinators — or ask at the venue on event day."
      />
      <section className="max-w-3xl mx-auto px-6 py-16 space-y-3 pb-20">
        {FAQS.map((f) => (
          <details key={f.q} className="glass-card rounded-2xl px-6 py-5 group">
            <summary className="flex items-center justify-between gap-4 font-medium">
              <span className="flex items-center gap-3">
                <MessageCircleQuestion className="w-5 h-5 text-brand shrink-0" />
                {f.q}
              </span>
              <ChevronDown className="w-5 h-5 text-white/50 shrink-0 transition-transform group-open:rotate-180" />
            </summary>
            <p className="text-sm text-white/65 leading-relaxed mt-4 pl-8">{f.a}</p>
          </details>
        ))}
        <p className="text-sm text-white/50 text-center pt-6">
          Can’t find your answer? <Link to="/contact" className="text-brand-bright hover:text-white">Contact the coordinators →</Link>
        </p>
      </section>
    </>
  )
}
