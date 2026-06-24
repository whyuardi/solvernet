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
      className="flex flex-wrap items-center justify-center gap-6 mt-8"
    >
      <div className="glass-card px-5 py-3 text-center min-w-[130px]">
        <div className="text-[9px] uppercase tracking-widest text-[var(--text-muted)] mb-1 flex items-center justify-center gap-1">
          <DollarSign size={10} />
          Total Value Settled
        </div>
        <div className="text-lg font-bold font-mono text-[var(--accent)]">
          $<AnimatedCounter end={stats.totalValueSettled / 1_000_000} suffix="M" decimals={1} />
        </div>
      </div>
      <div className="glass-card px-5 py-3 text-center min-w-[110px]">
        <div className="text-[9px] uppercase tracking-widest text-[var(--text-muted)] mb-1 flex items-center justify-center gap-1">
          <Users size={10} />
          Active Solvers
        </div>
        <div className="text-lg font-bold font-mono">
          <AnimatedCounter end={stats.activeSolvers} />
        </div>
      </div>
      <div className="glass-card px-5 py-3 text-center min-w-[110px]">
        <div className="text-[9px] uppercase tracking-widest text-[var(--text-muted)] mb-1 flex items-center justify-center gap-1">
          <Globe size={10} />
          Chains
        </div>
        <div className="text-lg font-bold font-mono">
          <AnimatedCounter end={stats.chainsSupported} />
        </div>
      </div>
    </motion.div>
  )
}
