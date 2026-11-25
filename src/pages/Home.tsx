import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Code2, Lightbulb, Megaphone, ShoppingBag, Sparkles, Trophy } from 'lucide-react'
import VideoHero, { SectionHead } from '../components/Hero'
import CompetitionCanvas from '../components/CompetitionCanvas'
import { Badge, Card } from '../components/ui'
import { CATEGORIES } from '../data/content'
import { getAnnouncements, getSettings } from '../lib/store'

const ICONS: Record<string, typeof Code2> = {
  'app-dev': Code2,
  'business-innovation': Lightbulb,
  ecommerce: ShoppingBag,
  'emerging-tech': Sparkles,
}

export default function Home() {
  const settings = getSettings()
  const announcements = getAnnouncements()
  const ctaRef = useRef<HTMLElement | null>(null)
  const [ctaVisible, setCtaVisible] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    const section = ctaRef.current
    if (!section) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setCtaVisible(true)
        observer.disconnect()
      }
    }, { threshold: 0.16 })

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div className="home-hero-transition">
        <div className="home-hero-sticky">
          <VideoHero
            eyebrow="WELCOME TO APPTHON."
            title={
              <>
                <span className="hero-headline-line">Your idea. Your application.</span>
                <span className="hero-headline-line hero-gradient-text">Your chance to win.</span>
              </>
            }
            subtext="A one-month application-building challenge where students turn imagination into functional technology products."
            primaryLabel="Begin Journey"
            primaryTo="/register"
            secondaryLabel="Explore Competition"
            secondaryTo="/categories"
          >
            <div className="animate-fade-rise-delay-3 mt-8 flex flex-wrap justify-center gap-3">
              <Badge>Registration: {settings.regOpen} → {settings.regClose}</Badge>
              <Badge>Event: {settings.eventDate}</Badge>
              <Badge>Venue: {settings.venue}</Badge>
            </div>
          </VideoHero>
        </div>

        <CompetitionCanvas
          regOpen={settings.regOpen}
          regClose={settings.regClose}
          eventDate={settings.eventDate}
          venue={settings.venue}
        />
      </div>

      {/* Categories */}
      <section className="w-full bg-midnight px-6 pb-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <SectionHead eyebrow="Categories" title="Four ways in." sub="Pick the category that fits your project — each has its own eligibility and submission requirements." />
            <Link to="/categories" className="text-sm text-brand-bright hover:text-white inline-flex items-center gap-1">
              View all categories <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {CATEGORIES.map((c) => {
              const Icon = ICONS[c.id] ?? Code2
              return (
                <Link key={c.id} to={`/categories#${c.id}`}>
                  <Card className="h-full hover:border-brand/40 transition-colors">
                    <Icon className="w-6 h-6 text-brand" />
                    <h3 className="font-display text-3xl mt-4">{c.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed mt-2">{c.short}</p>
                    <span className="text-sm text-brand-bright inline-flex items-center gap-1 mt-4">
                      Eligibility &amp; requirements <ArrowRight className="w-4 h-4" />
                    </span>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Prizes teaser + announcements */}
      <section className="max-w-7xl mx-auto px-6 pb-20 grid lg:grid-cols-2 gap-4">
        <Card className="!p-8 bg-brand/10 border-brand/25">
          <Trophy className="w-7 h-7 text-brand" />
          <h3 className="font-display text-4xl mt-4">Prizes &amp; recognition</h3>
          <p className="text-white/65 leading-relaxed mt-3">
            First, second and third prizes, participation certificates, special recognition and
            mentorship opportunities. Exact prize details are confirmed by the organisers and
            published on the Prizes page.
          </p>
          <div className="flex gap-6 mt-6 text-sm">
            <span><span className="text-white/50 block text-xs">1st Prize</span>{settings.firstPrize}</span>
            <span><span className="text-white/50 block text-xs">2nd Prize</span>{settings.secondPrize}</span>
            <span><span className="text-white/50 block text-xs">3rd Prize</span>{settings.thirdPrize}</span>
          </div>
          <Link to="/prizes" className="inline-flex items-center gap-1 text-sm text-brand-bright mt-6 hover:text-white">
            See prizes <ArrowRight className="w-4 h-4" />
          </Link>
        </Card>
        <Card className="!p-8">
          <Megaphone className="w-7 h-7 text-brand" />
          <h3 className="font-display text-4xl mt-4">Important announcements</h3>
          <ul className="mt-5 space-y-4">
            {announcements.slice(0, 3).map((a) => (
              <li key={a.id} className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
                <p className="font-medium">{a.title} {a.pinned && <Badge className="ml-1">Pinned</Badge>}</p>
                <p className="text-sm text-white/60 leading-relaxed mt-1">{a.body}</p>
              </li>
            ))}
          </ul>
          <Link to="/schedule" className="inline-flex items-center gap-1 text-sm text-brand-bright mt-6 hover:text-white">
            Full schedule <ArrowRight className="w-4 h-4" />
          </Link>
        </Card>
      </section>

      {/* Final CTA */}
      <section
        ref={ctaRef}
        className={`home-final-cta${ctaVisible ? ' is-visible' : ''}`}
        aria-labelledby="home-final-cta-title"
      >
        <div className="home-final-cta__grid" aria-hidden="true" />
        <div className="home-final-cta__inner">
          <div className="home-final-cta__copy">
            <h2 id="home-final-cta-title">
              <span>Have an idea?</span>
              {' '}
              <span className="home-final-cta__accent">Build it here.</span>
            </h2>
            <p>
              Register your team and your project, submit your demo before the deadline, and present it on the AppThon stage.
            </p>
            <div className="home-final-cta__actions">
              <Link to="/register" className="home-final-cta__button home-final-cta__button--primary">
                Register Now <ArrowRight aria-hidden="true" />
              </Link>
              <Link to="/submit" className="home-final-cta__button home-final-cta__button--secondary">
                Submit Project
              </Link>
            </div>
          </div>
          <div className="home-final-cta__art" aria-hidden="true">
            <img src="/images/cta-glass-sculpture.png" alt="" />
            <span className="home-final-cta__sheen" />
          </div>
        </div>
      </section>
    </>
  )
}
