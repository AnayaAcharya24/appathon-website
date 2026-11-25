import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CheckCircle2, Code2, Lightbulb, ShoppingBag, Sparkles } from 'lucide-react'
import { PageHero } from '../components/Hero'
import { Badge, Card } from '../components/ui'
import { CATEGORIES } from '../data/content'

const ICONS: Record<string, typeof Code2> = {
  'app-dev': Code2,
  'business-innovation': Lightbulb,
  ecommerce: ShoppingBag,
  'emerging-tech': Sparkles,
}

export default function Categories() {
  const { hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [hash])

  return (
    <>
      <PageHero
        eyebrow="Competition Categories"
        title="Four categories. One stage."
        subtext="Every category below is editable by the organisers in the Admin dashboard. Read the eligibility and submission requirements for your category before you register — they are part of how you will be judged."
      />
      <section className="max-w-7xl mx-auto px-6 py-16 space-y-5">
        {CATEGORIES.map((c, i) => {
          const Icon = ICONS[c.id] ?? Code2
          return (
            <Card key={c.id} id={c.id} className="!p-8 scroll-mt-28">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <span className="grid place-items-center w-12 h-12 rounded-2xl bg-brand/15 text-brand shrink-0">
                    <Icon className="w-6 h-6" />
                  </span>
                  <div>
                    <p className="text-xs text-brand-bright font-semibold tracking-widest">CATEGORY 0{i + 1}</p>
                    <h2 className="font-display text-4xl mt-1">{c.title}</h2>
                    <p className="text-white/60 mt-2 max-w-2xl leading-relaxed">{c.description}</p>
                  </div>
                </div>
                <Link to="/register" className="liquid-glass rounded-full px-5 py-2.5 text-sm whitespace-nowrap hover:scale-[1.03] transition-transform">
                  Register in this category
                </Link>
              </div>
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div>
                  <h3 className="text-sm font-semibold text-white/85">Eligibility</h3>
                  <p className="text-sm text-white/60 leading-relaxed mt-2">{c.eligibility}</p>
                  <h3 className="text-sm font-semibold text-white/85 mt-6">Also good for</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {c.examples.map((e) => <Badge key={e}>{e}</Badge>)}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white/85">Submission requirements</h3>
                  <ul className="mt-2 space-y-2.5">
                    {c.requirements.map((r) => (
                      <li key={r} className="flex gap-2 text-sm text-white/70 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-brand shrink-0" /> {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          )
        })}
        <p className="text-xs text-white/40 text-center pt-4">
          Category descriptions, eligibility and requirements can be updated by an admin in
          Admin → Content. If a category changes after you register, the change is announced on the Home page.
        </p>
      </section>
    </>
  )
}
