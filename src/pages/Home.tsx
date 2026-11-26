import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Megaphone, Trophy } from 'lucide-react'
import VideoHero, { SectionHead } from '../components/Hero'
import CompetitionCanvas from '../components/CompetitionCanvas'
import { Badge, Card } from '../components/ui'
import { getAnnouncements, getSettings } from '../lib/store'

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
            eyebrow="WELCOME TO Appathon."
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
            secondaryTo="#social-impact"
          >
            <div className="hero-details-glass animate-fade-rise-delay-3 mt-8 flex flex-wrap justify-center gap-3">
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

      {/* Social Impact */}
	      <section id="social-impact" className="home-social-impact w-full bg-midnight px-6 pb-12">
	        <div className="home-social-impact__inner mx-auto max-w-7xl">
	          <SectionHead eyebrow="Social Impact" title="One theme. Meaningful change." sub="Every team must develop an application based on the single Social Impact theme." />
	          <Card className="home-social-impact__card mt-8 !p-8 border-brand/25 bg-brand/10">
            <p className="text-white/75 leading-relaxed">
              Social Impact is the central theme of Appathon. Participants are challenged to build innovative applications that address real-world social problems, meet community needs and create meaningful, lasting positive change through technology. Projects should combine creativity and practical solutions to make a genuine difference in people's lives.
            </p>
            <p className="text-sm text-brand-bright mt-5">Eligibility: Open exclusively to students currently enrolled in undergraduate (UG) degree programmes.</p>
            <Link to="/register" className="text-sm text-brand-bright hover:text-white inline-flex items-center gap-1 mt-5">
              Build for Social Impact <ArrowRight className="w-4 h-4" />
            </Link>
          </Card>
        </div>
      </section>

      {/* Prizes teaser + announcements */}
      <section className="max-w-7xl mx-auto px-6 pb-20 grid gap-4 lg:grid-cols-2 lg:items-start">
        <div className="home-awards-panel">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Trophy className="w-7 h-7 text-brand" />
              <h3 className="font-display text-4xl mt-4">Prizes &amp; recognition</h3>
              <p className="text-white/65 leading-relaxed mt-3 max-w-2xl">
                First Prize, Second Prize and Participation Certificates. Exact prize details are confirmed by the organisers and published on the Prizes page.
              </p>
            </div>
            <Link to="/prizes" className="inline-flex items-center gap-1 text-sm text-brand-bright hover:text-white">
              See prizes <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="home-awards-rail" aria-label="Prizes and recognition">
            <article className="home-award-card home-award-card--first">
              <div className="home-award-visual" aria-hidden="true"><span className="home-award-medal"><b>1</b></span></div>
              <p className="home-award-kicker">First Prize</p>
              <p className="home-award-value">{settings.firstPrize}</p>
            </article>
            <article className="home-award-card home-award-card--second">
              <div className="home-award-visual" aria-hidden="true"><span className="home-award-medal"><b>2</b></span></div>
              <p className="home-award-kicker">Second Prize</p>
              <p className="home-award-value">{settings.secondPrize}</p>
	            </article>
	            <article className="home-award-card home-award-card--certificates">
	              <div className="home-award-visual" aria-hidden="true"><span className="home-award-certificate" /></div>
	              <p className="home-award-kicker">Participation Certificate</p>
              <p className="home-award-value">For participants</p>
            </article>
          </div>
        </div>
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
              Register your team and your project, submit your demo before the deadline, and present it on the Appathon stage.
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
