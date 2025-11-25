import { useEffect, useMemo } from 'react'
import clsx from 'clsx'

interface AnimatedTextProps {
  text: string
  className?: string
  as?: keyof JSX.IntrinsicElements
  stagger?: number // ms between chars
  delay?: number
  gradient?: boolean // Enable gradient text effect
  color?: string // Custom color for the text
}

// Splits text into individually animated characters for a subtle typographic entrance.
export default function AnimatedText({ text, className, as = 'span', stagger = 28, delay = 0, gradient = false, color = 'text-white' }: AnimatedTextProps) {
  const Tag: any = as
  const chars = useMemo(() => text.split(''), [text])
  useEffect(() => { /* no-op hook reserved for future intersection observer */ }, [])
  return (
    <Tag
      className={clsx(
        'animated-text inline-block',
        gradient && 'bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent',
        !gradient && color,
        'drop-shadow-lg',
        className
      )}
      aria-label={text}
    >
      {chars.map((c, i) => (
        <span
          key={i + c + i}
          className={clsx('char inline-block will-change-transform')}
          style={{ animationDelay: `${delay + i * stagger}ms` }}
        >
          {c === ' ' ? '\u00A0' : c}
        </span>
      ))}
    </Tag>
  )
}
