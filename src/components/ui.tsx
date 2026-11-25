import type { ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '../lib/utils'

/* shadcn/ui-style primitives (lightweight, no Radix dependency in this build) */

export function Button({
  className,
  variant = 'default',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'glass' | 'brand' | 'outline' | 'ghost' }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-50 disabled:pointer-events-none',
        variant === 'default' && 'bg-white text-black px-6 py-2.5 text-sm hover:scale-[1.03]',
        variant === 'glass' && 'liquid-glass text-white px-6 py-2.5 text-sm hover:scale-[1.03]',
        variant === 'brand' && 'bg-brand text-white px-6 py-2.5 text-sm hover:bg-brand-bright hover:scale-[1.03] brand-glow',
        variant === 'outline' && 'border border-white/20 text-white px-6 py-2.5 text-sm hover:bg-white/5',
        variant === 'ghost' && 'text-white/70 px-4 py-2 text-sm hover:text-white hover:bg-white/5',
        className,
      )}
      {...props}
    />
  )
}

export function Label({ className, ...props }: { className?: string; children: React.ReactNode; htmlFor?: string }) {
  return (
    <label className={cn('block text-sm font-medium text-white/85 mb-1.5', className)} {...props}>
      {props.children}
    </label>
  )
}

const fieldCls =
  'w-full rounded-xl bg-white/[0.04] border border-white/15 px-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-brand/70 focus:ring-2 focus:ring-brand/25 transition'

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldCls, className)} {...props} />
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldCls, 'min-h-[110px] resize-y', className)} {...props} />
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(fieldCls, '[&>option]:bg-midnight [&>option]:text-white', className)} {...props}>
      {children}
    </select>
  )
}

export function Card({ className, children, id }: { className?: string; children: React.ReactNode; id?: string }) {
  return <div id={id} className={cn('glass-card rounded-2xl p-6', className)}>{children}</div>
}

export function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-white/80',
        className,
      )}
    >
      {children}
    </span>
  )
}

export function FieldError({ children }: { children?: React.ReactNode }) {
  if (!children) return null
  return <p className="mt-1 text-xs text-brand-soft">{children}</p>
}
