import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { VIDEO_URL } from '../lib/store'

/** Shared video hero and page-hero components for the Appathon site. */
export default function VideoHero({
  eyebrow,
  title,
  subtext,
  primaryLabel = 'Begin Journey',
  primaryTo = '/register',
  secondaryLabel,
  secondaryTo,
  children,
}: {
  eyebrow: string
  title: ReactNode
  subtext: string
  primaryLabel?: string
  primaryTo?: string
  secondaryLabel?: string
  secondaryTo?: string
  children?: ReactNode
}) {
  return (
    <section className="home-video-hero relative isolate min-h-[100svh] overflow-hidden">
      <video
        className="home-hero-video pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
        src={VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
      <div className="hero-video-overlay" aria-hidden="true" />
      <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-4 pt-28 pb-16 text-center sm:px-6 sm:pt-32 sm:pb-24">
        <p className="animate-fade-rise text-[13px] font-medium uppercase tracking-[0.22em] text-brand-bright sm:text-sm">
          {eyebrow}
        </p>
        <h1 className="hero-headline animate-fade-rise mt-4 w-full max-w-7xl text-white">
          {title}
        </h1>
        <p className="animate-fade-rise-delay mt-6 max-w-2xl text-base leading-relaxed text-white/85 sm:text-xl">
          {subtext}
        </p>
        <div className="animate-fade-rise-delay-2 mt-8 flex flex-col items-center gap-4 sm:mt-10 sm:flex-row">
          <Link
            to={primaryTo}
            className="liquid-glass rounded-full px-10 py-4 text-base text-white transition-transform hover:scale-[1.03] sm:px-14 sm:py-5"
          >
            {primaryLabel}
          </Link>
          {secondaryLabel && secondaryTo && (
            <Link
              to={secondaryTo}
              className="brand-glow inline-block rounded-full bg-brand px-8 py-4 text-base text-white transition-colors hover:bg-brand-bright sm:py-5"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
        {children}
      </div>
    </section>
  )
}

export function PageHero({ eyebrow, title, subtext }: { eyebrow: string; title: string; subtext: string }) {
  return (
    <section className="relative isolate overflow-hidden">
      <video
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover opacity-40"
        src={VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
      <div className="hero-video-overlay" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-24 pb-20 text-center">
        <p className="animate-fade-rise text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-bright">{eyebrow}</p>
        <h1 className="animate-fade-rise mt-5 font-display text-5xl font-bold leading-[0.98] tracking-[-0.04em] sm:text-6xl md:text-7xl">
          {title}
        </h1>
        <p className="animate-fade-rise-delay mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
          {subtext}
        </p>
      </div>
    </section>
  )
}

export function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-bright">{eyebrow}</p>
      <h2 className="mt-3 font-display text-4xl font-semibold leading-[1.02] tracking-[-0.03em] sm:text-5xl">
        {title}
      </h2>
      {sub && <p className="mt-4 leading-relaxed text-white/70">{sub}</p>}
    </div>
  )
}
