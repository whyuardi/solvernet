'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { DollarSign, Users, Globe } from 'lucide-react'

interface StatsProps {
  stats: {
    totalValueSettled: number
    activeSolvers: number
    chainsSupported: number
  }
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

    const duration = 2000
    const steps = 60
    const increment = end / steps
    let current = 0
    const interval = setInterval(() => {
      current += increment
      if (current >= end) {
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

export default function ClientLanding({ stats }: StatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="flex items-stretch border-t border-[var(--border)]"
    >
      <div className="flex flex-1 items-center justify-center gap-6 sm:gap-10 px-4 py-4 sm:py-5">
        <div className="text-center">
          <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.1em] text-[var(--text-muted)] mb-1 flex items-center justify-center gap-1 font-[var(--font-mono)]">
            <DollarSign size={10} />
            <span className="hidden sm:inline">Total Value Settled</span>
            <span className="sm:hidden">TVS</span>
          </div>
          <div className="text-lg sm:text-xl font-bold font-[var(--font-mono)] text-[var(--accent)]">
            $<AnimatedCounter end={stats.totalValueSettled / 1_000_000} suffix="M" decimals={1} />
          </div>
        </div>

        <div className="w-px h-8 bg-[var(--border)]" />

        <div className="text-center">
          <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.1em] text-[var(--text-muted)] mb-1 flex items-center justify-center gap-1 font-[var(--font-mono)]">
            <Users size={10} />
            <span className="hidden sm:inline">Active Solvers</span>
            <span className="sm:hidden">Solvers</span>
          </div>
          <div className="text-lg sm:text-xl font-bold font-[var(--font-mono)]">
            <AnimatedCounter end={stats.activeSolvers} />
          </div>
        </div>

        <div className="w-px h-8 bg-[var(--border)]" />

        <div className="text-center">
          <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.1em] text-[var(--text-muted)] mb-1 flex items-center justify-center gap-1 font-[var(--font-mono)]">
            <Globe size={10} />
            Chains
          </div>
          <div className="text-lg sm:text-xl font-bold font-[var(--font-mono)]">
            <AnimatedCounter end={stats.chainsSupported} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
