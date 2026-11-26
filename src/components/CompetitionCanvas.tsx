import { useEffect, useRef } from 'react'
import { Award, CalendarDays, Code2, MapPin, Trophy, Users } from 'lucide-react'
import './CompetitionCanvas.css'

interface CompetitionCanvasProps {
  regOpen: string
  regClose: string
  eventDate: string
  venue: string
}

const BENEFITS: Array<{
  id: string
  title: string
  text: string
  icon: typeof Code2
}> = [
  {
    id: 'build',
    title: 'Build for real',
    text: 'Working demos, not slideware. Judges test what you built.',
    icon: Code2,
  },
  {
    id: 'team',
    title: 'Team up',
    text: 'Exactly two participants per team: one leader and one partner.',
    icon: Users,
  },
  {
    id: 'win',
    title: 'Win & be seen',
    text: 'First Prize, Second Prize and Participation Certificates.',
    icon: Trophy,
  },
  {
    id: 'mentor',
    title: 'Social Impact',
    text: 'Every team builds an application that creates positive change.',
    icon: Award,
  },
]

function CompetitionArtwork() {
  return (
    <svg
      className="competition-art-svg"
      viewBox="0 0 400 340"
      role="img"
      aria-label="Appathon logo emblem: a code symbol inside a violet frame"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="emblem-frame" x1="40" y1="300" x2="360" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7024D8" />
          <stop offset="0.5" stopColor="#8B4DF2" />
          <stop offset="1" stopColor="#A66BFF" />
        </linearGradient>
        <radialGradient id="emblem-halo">
          <stop stopColor="#A64AFF" stopOpacity="0.42" />
          <stop offset="1" stopColor="#7024D8" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="200" cy="170" r="165" fill="url(#emblem-halo)" />

      <g transform="translate(200 170) rotate(-8) skewX(-8) translate(-200 -170)">
        <rect x="72" y="82" width="256" height="176" rx="46" fill="url(#emblem-frame)" />
        <rect x="92" y="100" width="216" height="140" rx="32" fill="#05040A" />
      </g>

      <g
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="19"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="rotate(-8 200 170)"
      >
        <path d="M159 144 128 171l31 27" />
        <path d="M241 144 272 171l-31 27" />
        <path d="M212 134 188 208" />
      </g>
    </svg>
  )
}

export default function CompetitionCanvas({ regOpen, regClose, eventDate, venue }: CompetitionCanvasProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || !('IntersectionObserver' in window)) {
      section.classList.add('is-visible')
      return
    }

    section.classList.add('is-observing')
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        section.classList.add('is-visible')
        observer.disconnect()
      }
    }, { threshold: 0, rootMargin: '0px 0px -22% 0px' })

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  const milestones = [
    { label: 'Registration opens', value: regOpen, icon: CalendarDays },
    { label: 'Registration closes', value: regClose, icon: CalendarDays },
    { label: 'Event date', value: eventDate, icon: CalendarDays },
    { label: 'Venue', value: venue, icon: MapPin },
  ]

  return (
    <section
      ref={sectionRef}
      id="competition"
      className="competition-section"
      aria-labelledby="competition-heading"
    >
      <div className="competition-canvas">
        <div className="competition-canvas__texture" aria-hidden="true" />
        <div className="competition-main">
          <div className="competition-editorial">
            <p className="competition-eyebrow competition-reveal competition-reveal--1">The competition</p>
            <h2 id="competition-heading" className="competition-heading competition-reveal competition-reveal--2">
              <span>From Idea to{' '}</span>
              <span className="competition-heading__impact">Impact.</span>
            </h2>
            <p className="competition-description competition-reveal competition-reveal--3">
              Appathon challenges students to identify real-world social problems and develop innovative applications that create positive change — then put them in front of real judges and peers.
            </p>
          </div>

          <div className="competition-art-stage competition-reveal competition-reveal--4">
            <div className="competition-art-glow competition-art-glow--one" aria-hidden="true" />
            <div className="competition-art-glow competition-art-glow--two" aria-hidden="true" />
            <div className="competition-artwork">
              <CompetitionArtwork />
            </div>
            <ul className="competition-benefits" aria-label="Competition benefits">
              {BENEFITS.map(({ id, title, text, icon: Icon }) => (
                <li key={id} className={`competition-benefit competition-benefit--${id}`}>
                  <span className="competition-benefit__icon" aria-hidden="true">
                    <Icon />
                    {id === 'build' && <span className="benefit-cursor" />}
                    {id === 'team' && (
                      <span className="benefit-avatars">
                        <i />
                        <i />
                        <i />
                      </span>
                    )}
                    {id === 'win' && <span className="benefit-shine" />}
                    {id === 'mentor' && (
                      <span className="benefit-network">
                        <i />
                        <i />
                        <i />
                        <b />
                      </span>
                    )}
                  </span>
                  <span className="competition-benefit__copy">
                    <span className="competition-benefit__title">{title}</span>
                    <span className="competition-benefit__text">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ol className="competition-timeline competition-reveal competition-reveal--5" aria-label="Competition event information">
          {milestones.map(({ label, value, icon: Icon }) => {
            const unannounced = value.trim().toLowerCase() === 'to be announced'
            return (
              <li key={label} className="competition-timeline__item">
                <span className="competition-timeline__node" aria-hidden="true" />
                <span className="competition-timeline__icon" aria-hidden="true"><Icon /></span>
                <span className="competition-timeline__label">{label}</span>
                <span className={`competition-timeline__value${unannounced ? ' is-unannounced' : ''}`}>{value}</span>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
