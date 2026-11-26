import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { ArrowRight, Mail, MapPin, Menu, Phone, X, Zap } from 'lucide-react'
import { getSettings } from '../lib/store'
import { cn } from '../lib/utils'

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/rules', label: 'Rules' },
  { to: '/prizes', label: 'Prizes' },
  { to: '/schedule', label: 'Schedule' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
]

const CURRENT_YEAR = new Date().getFullYear()

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function Layout() {
  const [open, setOpen] = useState(false)
  const [settings] = useState(getSettings)
  const location = useLocation()
  const [previousPathname, setPreviousPathname] = useState(location.pathname)
  if (location.pathname !== previousPathname) {
    setPreviousPathname(location.pathname)
    if (open) setOpen(false)
  }

  return (
    <div className="min-h-screen bg-midnight text-white font-body flex flex-col">
      <ScrollToTop />
      {/* Floating glass navigation */}
      <header
        className="fixed inset-x-3 top-3 z-50 mx-auto max-w-[1320px] pointer-events-none sm:inset-x-5 sm:top-5"
        style={{
          backgroundColor: 'transparent',
          border: '0',
          boxShadow: 'none',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
        }}
      >
        <nav className="relative pointer-events-auto mx-auto flex w-full flex-row items-center justify-between rounded-full border border-brand-bright/15 bg-midnight/70 px-3 py-3 shadow-[0_12px_36px_rgba(5,5,11,0.32)] backdrop-blur-xl sm:px-5 sm:py-3.5 xl:px-7">
          <Link to="/" className="flex items-center gap-2.5" aria-label="Appathon home">
            <span className="grid place-items-center w-9 h-9 rounded-full bg-brand text-white">
              <Zap className="w-5 h-5" fill="currentColor" />
            </span>
            <span className="font-display text-3xl tracking-tight leading-none">
              Appathon<sup className="text-xs align-super">®</sup>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-7">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "group relative text-sm transition-colors duration-200 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-brand-bright after:transition-transform after:duration-200 after:content-['']",
                    isActive
                      ? 'font-medium text-brand-bright after:scale-x-100'
                      : 'text-white/70 hover:text-brand-bright hover:after:scale-x-100',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/submit" className="text-sm text-white/70 transition-colors duration-200 hover:text-brand-bright">
              Submit Project
            </Link>
            <Link
              to="/register"
              className="liquid-glass inline-flex items-center gap-2 rounded-full border border-brand-bright/20 px-6 py-2.5 text-sm text-white transition-all duration-300 hover:scale-[1.02] hover:border-brand-bright/60 hover:shadow-[0_0_22px_rgba(166,74,255,0.18)]"
            >
              Begin Journey <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <button
            className="lg:hidden liquid-glass flex h-11 w-11 items-center justify-center rounded-full p-0 transition-all duration-200 hover:border-brand-bright/50 hover:text-brand-bright"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {open && (
            <div className="lg:hidden absolute left-0 right-0 top-full z-10 mt-3 max-h-[calc(100vh-6rem)] w-full overflow-y-auto rounded-2xl border border-brand-bright/15 bg-midnight/85 p-4 shadow-[0_12px_36px_rgba(5,5,11,0.32)] backdrop-blur-xl flex flex-col gap-1">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'rounded-lg px-3 py-3 text-sm transition-colors duration-200',
                      isActive ? 'bg-brand/15 text-brand-bright' : 'text-white/75 hover:bg-white/5 hover:text-brand-bright',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <Link to="/register" className="mt-2 bg-brand text-white rounded-full px-5 py-2.5 text-sm text-center font-medium">
                Register Now
              </Link>
              <Link to="/submit" className="liquid-glass rounded-full px-5 py-2.5 text-sm text-center">
                Submit Project
              </Link>
              <Link to="/admin" className="text-center text-xs text-white/50 py-2">
                Admin Portal
              </Link>
            </div>
          )}
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="relative z-10 border-t border-white/10 mt-4">
        <div className="max-w-7xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="grid place-items-center w-9 h-9 rounded-full bg-brand text-white">
                <Zap className="w-5 h-5" fill="currentColor" />
              </span>
              <span className="font-display text-3xl tracking-tight">
                Appathon<sup className="text-xs align-super">®</sup>
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mt-4 max-w-md">
              From Idea to Impact — an inter-collegiate innovation and application competition.
              Build something real, present it, and let it speak for you.
            </p>
            <p className="text-white/40 text-xs mt-4">
              Organising institution: {settings.institution}. Dates, venue, prizes and contact
              details are published here as soon as they are confirmed — nothing on this site is invented.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4">Competition</h3>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li><Link className="hover:text-white" to="/register">Register</Link></li>
              <li><Link className="hover:text-white" to="/submit">Project Submission</Link></li>
              <li><Link className="hover:text-white" to="/rules">Rules &amp; Guidelines</Link></li>
              <li><Link className="hover:text-white" to="/prizes">Prizes</Link></li>
              <li><Link className="hover:text-white" to="/schedule">Event Schedule</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex gap-2"><Mail className="w-4 h-4 mt-0.5 shrink-0" /> {settings.contactEmail}</li>
              <li className="flex gap-2"><Phone className="w-4 h-4 mt-0.5 shrink-0" /> {settings.contactPhone}</li>
              <li className="flex gap-2"><MapPin className="w-4 h-4 mt-0.5 shrink-0" /> {settings.address}</li>
            </ul>
            <Link to="/admin" className="inline-block mt-5 text-xs text-white/40 hover:text-white/80">
              Admin Portal →
            </Link>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between gap-2 text-xs text-white/40">
            <span>© {CURRENT_YEAR} Appathon. All rights reserved.</span>
            <span>
              <Link to="/privacy" className="hover:text-white/80">Privacy &amp; Consent</Link>
              {' · '}
              <Link to="/faq" className="hover:text-white/80">FAQ</Link>
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
