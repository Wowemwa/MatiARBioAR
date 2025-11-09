import { ReactNode, CSSProperties, HTMLAttributes, memo } from 'react'

type BaseProps = { className?: string; children: ReactNode; style?: CSSProperties } & HTMLAttributes<HTMLDivElement>
type ButtonProps = { variant?: 'primary' | 'secondary' | 'ghost'; size?: 'sm' | 'md' | 'lg'; className?: string; children: ReactNode; type?: 'button' | 'submit' | 'reset'; disabled?: boolean } & HTMLAttributes<HTMLButtonElement>
type BadgeProps = { tone?: 'default' | 'success' | 'warning' | 'error' | 'info'; size?: 'xs' | 'sm' | 'md'; className?: string; children: ReactNode } & HTMLAttributes<HTMLSpanElement>
type SectionTitleProps = { icon?: string; className?: string; children: ReactNode } & HTMLAttributes<HTMLDivElement>
type MediaThumbProps = { src: string; alt: string; className?: string } & HTMLAttributes<HTMLDivElement>

export const Card = memo(({ className = '', children, ...props }: BaseProps) => (
  <div className={`group relative overflow-hidden rounded-3xl border border-white/50 bg-white/85 p-8 shadow-2xl backdrop-blur-2xl transition-all duration-500 ease-out hover:shadow-3xl hover:shadow-emerald-500/15 dark:hover:shadow-blue-500/15 hover:scale-[1.02] hover:-translate-y-1 dark:border-white/20 dark:bg-slate-900/80 ${className}`} {...props}>
    {/* Enhanced card background effects */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-sky-50/30 to-emerald-50/40 dark:from-slate-800/30 dark:via-slate-700/20 dark:to-slate-800/25 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative z-10">
      {children}
    </div>
  </div>
))

export const SoftCard = memo(({ className = '', gradient = 'from-emerald-500/10 via-blue-500/10 to-purple-500/10', children, ...props }: BaseProps & { gradient?: string }) => (
  <div className={`group relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/90 p-8 shadow-2xl backdrop-blur-2xl transition-all duration-700 ease-out hover:shadow-3xl hover:shadow-emerald-500/20 dark:hover:shadow-blue-500/20 hover:scale-[1.03] hover:-translate-y-2 dark:border-white/25 dark:bg-slate-900/85 ${className}`} {...props}>
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-40 dark:opacity-30 group-hover:opacity-60 dark:group-hover:opacity-45 transition-opacity duration-500`} />
    <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(16,185,129,0.08),rgba(59,130,246,0.06),rgba(147,51,234,0.08),rgba(6,182,212,0.06))] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/10 to-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative z-10">
      {children}
    </div>
  </div>
))

export const Badge = memo(({ tone = 'default', size = 'sm', className = '', children, ...props }: BadgeProps) => {
  const tones = {
    default: 'bg-gradient-to-r from-slate-100/90 to-slate-200/80 text-slate-700 border border-slate-200/60 dark:from-slate-800/80 dark:to-slate-700/70 dark:text-slate-300 dark:border-slate-600/40',
    success: 'bg-gradient-to-r from-emerald-100/90 to-emerald-200/80 text-emerald-700 border border-emerald-200/60 dark:from-emerald-900/40 dark:to-emerald-800/30 dark:text-emerald-300 dark:border-emerald-700/40',
    warning: 'bg-gradient-to-r from-amber-100/90 to-amber-200/80 text-amber-700 border border-amber-200/60 dark:from-amber-900/40 dark:to-amber-800/30 dark:text-amber-300 dark:border-amber-700/40',
    error: 'bg-gradient-to-r from-red-100/90 to-red-200/80 text-red-700 border border-red-200/60 dark:from-red-900/40 dark:to-red-800/30 dark:text-red-300 dark:border-red-700/40',
    info: 'bg-gradient-to-r from-blue-100/90 to-blue-200/80 text-blue-700 border border-blue-200/60 dark:from-blue-900/40 dark:to-blue-800/30 dark:text-blue-300 dark:border-blue-700/40',
  }
  
  const sizes = {
    xs: 'px-3 py-1 text-xs rounded-xl',
    sm: 'px-4 py-1.5 text-sm rounded-2xl',
    md: 'px-5 py-2 text-base rounded-2xl',
  }

  return (
    <span
      className={`inline-flex items-center font-semibold backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 ${tones[tone]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
})

export const Button = memo(({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) => {
  const variants = {
    primary: 'group relative overflow-hidden text-white shadow-lg hover:shadow-glow token-gradient-brand hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
    secondary: 'group relative overflow-hidden button-secondary text-slate-700 dark:text-slate-200 border border-white/60 dark:border-white/20 hover:scale-[1.02] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
    ghost: 'group relative overflow-hidden bg-transparent text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50 border border-transparent hover:border-white/40 dark:hover:border-white/20 hover:scale-[1.02] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
  }
  
  const sizes = {
    sm: 'px-5 py-2.5 text-sm rounded-2xl',
    md: 'px-8 py-4 text-base rounded-3xl',
    lg: 'px-10 py-5 text-lg rounded-3xl',
  }

  return (
    <button
      className={`inline-flex items-center justify-center font-bold transition-all duration-500 ease-out backdrop-blur-xl ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {/* Enhanced button visual effects */}
  <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-white/20 via-white/10 to-white/20" />
  <div className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      <span className="relative z-10">
        {children}
      </span>
    </button>
  )
})

export const SectionTitle = memo(({ icon, className = '', children, ...props }: SectionTitleProps) => (
  <div className={`group relative flex items-center justify-center gap-4 mb-12 ${className}`} {...props}>
    {/* Enhanced background effects */}
    <div className="absolute -inset-8 bg-gradient-to-r from-emerald-500/5 via-blue-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    <div className="absolute -inset-4 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.08),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    {icon && (
      <span className="relative text-4xl lg:text-5xl filter drop-shadow-lg transform group-hover:scale-110 transition-transform duration-500">
        {icon}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </span>
    )}
    
    <h2 className="relative text-3xl lg:text-4xl xl:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white group-hover:from-emerald-600 group-hover:via-blue-600 group-hover:to-purple-600 transition-all duration-700 text-center tracking-tight">
      {/* Enhanced text shadow effect */}
      <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600/20 via-blue-600/20 to-purple-600/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        {children}
      </span>
      <span className="relative">
        {children}
      </span>
    </h2>
  </div>
))

export const MediaThumb = memo(({ src, alt, className = '', ...props }: MediaThumbProps) => (
  <div className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/20 dark:hover:shadow-blue-500/20 transition-all duration-500 hover:scale-105 hover:-translate-y-1 ${className}`} {...props}>
    {/* Enhanced image container */}
    <div className="relative overflow-hidden rounded-3xl">
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
        loading="lazy"
      />
      {/* Enhanced overlay effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-blue-500/15 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
    
    {/* Enhanced shine effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
  </div>
))

export default { Card, SoftCard, Badge, Button, SectionTitle, MediaThumb }