'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

interface StatsProps {
  totalValueSettled: number
  activeSolvers: number
  chainsSupported: number
}

function AnimatedCounter({
  end,
  suffix = '',
  decimals = 0,
}: {
  end: number
  suffix?: string
  decimals?: number
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null!)
  const inView = useInView(ref, { once: true })
  const started = useRef(false)

  useEffect(() => {
    if (!inView || started.current) return

    started.current = true
    const duration = 1200
    const steps = 40
    const stepDuration = duration / steps
    let current = 0

    const interval = setInterval(() => {
      current++
      const progress = current / steps
      const eased = 1 - Math.pow(1 - progress, 3)

      if (current >= steps) {
        setCount(end)
        clearInterval(interval)
      } else {
        setCount(current)
      }
    }, duration / steps)

    return () => clearInterval(interval)
  }, [inView, end])

  return (
    <span ref={ref}>
      {count.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  )
}

export default function ClientLanding({ totalValueSettled, activeSolvers, chainsSupported }: StatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="flex items-stretch border-t border-[var(--border)]"
    >
      <div className="flex flex-1 items-center justify-center gap-6 sm:gap-10 px-4 py-4 sm:py-5">
        <div className="text-center">
          <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.1em] text-[var(--text-muted)] mb-1 font-[var(--font-mono)]">
            <span className="hidden sm:inline">Total Value Settled</span>
            <span className="sm:hidden">TVS</span>
          </div>
          <div className="text-lg sm:text-xl font-bold font-[var(--font-mono)] text-[var(--accent)]">
            $<AnimatedCounter end={totalValueSettled / 1_000_000} suffix="M" decimals={1} />
          </div>
        </div>

        <div className="w-px h-8 bg-[var(--border)]" />

        <div className="text-center">
          <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.1em] text-[var(--text-muted)] mb-1 font-[var(--font-mono)]">
            <span className="hidden sm:inline">Active Solvers</span>
            <span className="sm:hidden">Solvers</span>
          </div>
          <div className="text-lg sm:text-xl font-bold font-[var(--font-mono)]">
            <AnimatedCounter end={activeSolvers} />
          </div>
        </div>

        <div className="w-px h-8 bg-[var(--border)]" />

        <div className="text-center">
          <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.1em] text-[var(--text-muted)] mb-1 font-[var(--font-mono)]">
            Chains
          </div>
          <div className="text-lg sm:text-xl font-bold font-[var(--font-mono)]">
            <AnimatedCounter end={chainsSupported} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
