'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'


/* ─── Types ─────────────────────────────────────────────── */

interface Solver {
  id: string
  name: string
  avatar: string
  bondedCapital: number
  currentBid: number
  reputation: number // 1-5
  successRate: number // 0-100
  avgFillTime: number // seconds
  isActive: boolean
  specialty: 'fast' | 'cheap' | 'reliable' | 'whale'
}

type SortKey = 'bid' | 'reputation' | 'speed'

/* ─── Mock Data ─────────────────────────────────────────── */

const SOLVERS: Solver[] = [
  {
    id: 's1',
    name: 'Albedo Labs',
    avatar: 'A',
    bondedCapital: 12_500_000,
    currentBid: 0.0025,
    reputation: 4.9,
    successRate: 99.2,
    avgFillTime: 8,
    isActive: true,
    specialty: 'fast',
  },
  {
    id: 's2',
    name: 'Nexus Trade',
    avatar: 'N',
    bondedCapital: 8_200_000,
    currentBid: 0.0031,
    reputation: 4.7,
    successRate: 97.8,
    avgFillTime: 14,
    isActive: true,
    specialty: 'cheap',
  },
  {
    id: 's3',
    name: 'Cypher Capital',
    avatar: 'C',
    bondedCapital: 20_000_000,
    currentBid: 0.0019,
    reputation: 5.0,
    successRate: 99.9,
    avgFillTime: 6,
    isActive: true,
    specialty: 'reliable',
  },
  {
    id: 's4',
    name: 'Vertex Relay',
    avatar: 'V',
    bondedCapital: 5_600_000,
    currentBid: 0.0042,
    reputation: 4.3,
    successRate: 94.5,
    avgFillTime: 22,
    isActive: false,
    specialty: 'whale',
  },
  {
    id: 's5',
    name: 'Delta Prime',
    avatar: 'D',
    bondedCapital: 15_300_000,
    currentBid: 0.0028,
    reputation: 4.8,
    successRate: 98.6,
    avgFillTime: 10,
    isActive: true,
    specialty: 'fast',
  },
  {
    id: 's6',
    name: 'Aether Swap',
    avatar: 'Æ',
    bondedCapital: 3_800_000,
    currentBid: 0.0055,
    reputation: 4.1,
    successRate: 92.1,
    avgFillTime: 18,
    isActive: true,
    specialty: 'cheap',
  },
]

/* ─── Helpers ───────────────────────────────────────────── */

function ReputationStars({ score }: { score: number }) {
  const full = Math.floor(score)
  const hasHalf = score - full >= 0.5
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => {
        let fill = 'none'
        if (i < full) fill = 'var(--accent)'
        else if (i === full && hasHalf) fill = 'var(--accent)'
        return (
          <span
            key={i}
            className={`text-xs ${
              fill === 'var(--accent)' ? 'text-[var(--accent)]' : 'text-[var(--text-muted)] opacity-30'
            }`}
          >★</span>
        )
      })}
      <span className="text-[10px] font-mono text-[var(--text-muted)] ml-1">{score.toFixed(1)}</span>
    </span>
  )
}

function formatBond(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

/* ─── Solver Card ───────────────────────────────────────── */

function SolverCard({
  solver,
  isBestBid,
  index,
}: {
  solver: Solver
  isBestBid: boolean
  index: number
}) {
  const specialtyIcon = {
    fast: <span className="text-xs text-[var(--accent)]">⟡</span>,
    cheap: <span className="text-xs text-[var(--accent)]">$</span>,
    reliable: <span className="text-xs text-[var(--accent)]">◆</span>,
    whale: <span className="text-xs text-[var(--accent)]">↑</span>,
  }[solver.specialty]

  const specialtyLabel = {
    fast: 'Fast Fill',
    cheap: 'Low Fee',
    reliable: 'Reliable',
    whale: 'High Cap',
  }[solver.specialty]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      layout
      className={`relative group ${
        index === 0 ? 'col-span-1 row-span-1 sm:col-span-2 sm:row-span-1' : ''
      } ${index === 5 ? 'sm:col-span-2' : ''} ${index === 2 ? 'sm:row-span-2' : ''}`}
    >
      <div
        className={`card p-4 h-full transition-all duration-300 ${
          isBestBid
            ? 'border-[var(--accent)] animate-pulse-glow'
            : 'hover:border-[var(--border-hover)]'
        } ${!solver.isActive ? 'opacity-50' : ''}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                isBestBid ? 'bg-[var(--accent)] text-[#0A0A0F]' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
              }`}
            >
              {solver.avatar}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold">{solver.name}</span>
                {isBestBid && (
                  <span className="text-[9px] uppercase tracking-widest bg-[var(--accent-dim)] text-[var(--accent)] px-1.5 py-0.5 rounded-[var(--radius-full)] font-medium">
                    Best
                  </span>
                )}
              </div>
              <ReputationStars score={solver.reputation} />
            </div>
          </div>
          <span
            className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-[var(--radius-full)] ${
              solver.isActive
                ? 'bg-[var(--success)]/10 text-[var(--success)]'
                : 'bg-[var(--text-muted)]/10 text-[var(--text-muted)]'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${solver.isActive ? 'bg-[var(--success)]' : 'bg-[var(--text-muted)]'}`} />
            {solver.isActive ? 'Active' : 'Idle'}
          </span>
        </div>

        {/* Stats Grid — varies layout by card size */}
        <div className={`grid gap-2 ${index === 2 ? 'grid-cols-2' : 'grid-cols-1'} mb-3`}>
          <div className="bg-[var(--bg-secondary)] rounded-[var(--radius-sm)] p-2.5">
            <div className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] mb-0.5">Bonded</div>
            <div className="text-sm font-semibold font-mono">{formatBond(solver.bondedCapital)}</div>
          </div>
          <div className="bg-[var(--bg-secondary)] rounded-[var(--radius-sm)] p-2.5">
            <div className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] mb-0.5">Bid</div>
            <div className={`text-sm font-semibold font-mono ${isBestBid ? 'text-[var(--accent)]' : ''}`}>
              {solver.currentBid.toFixed(4)} ETH
            </div>
          </div>
          {index !== 2 && index !== 0 && (
            <div className="bg-[var(--bg-secondary)] rounded-[var(--radius-sm)] p-2.5">
              <div className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] mb-0.5">Success</div>
              <div className="text-sm font-semibold font-mono">{solver.successRate}%</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)]">
          <span className="flex items-center gap-1">
            {specialtyIcon}
            {specialtyLabel}
          </span>
          <span className="flex items-center gap-1">
            <span className="text-xs">⏱</span>
            {solver.avgFillTime}s avg
          </span>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Empty State ───────────────────────────────────────── */

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mb-4">
        <span className="text-2xl text-[var(--text-muted)]">⟐</span>
      </div>
      <h3 className="text-lg font-semibold mb-1">No Solvers Yet</h3>
      <p className="text-sm text-[var(--text-secondary)] max-w-xs">
        No active bidders for this intent. Try adjusting your parameters or increasing the reward.
      </p>
    </div>
  )
}

/* ─── Main Component ────────────────────────────────────── */

export default function SolverGrid() {
  const [sortKey, setSortKey] = useState<SortKey>('bid')
  const [solvers, setSolvers] = useState(SOLVERS)

  // Simulate bid updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSolvers((prev) =>
        prev.map((s) => {
          if (!s.isActive) return s
          const delta = (Math.random() - 0.45) * 0.0003
          return {
            ...s,
            currentBid: Math.max(0.0005, s.currentBid + delta),
          }
        }),
      )
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Sort
  const sorted = useMemo(() => {
    const copy = [...solvers]
    switch (sortKey) {
      case 'bid':
        return copy.sort((a, b) => a.currentBid - b.currentBid)
      case 'reputation':
        return copy.sort((a, b) => b.reputation - a.reputation)
      case 'speed':
        return copy.sort((a, b) => a.avgFillTime - b.avgFillTime)
    }
  }, [solvers, sortKey])

  const bestBidId = sorted.length > 0 ? sorted[0].id : null

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
        <h2 className="text-base sm:text-lg font-semibold">
          Competing Solvers{' '}
          <span className="text-xs sm:text-sm font-normal text-[var(--text-secondary)]">
            ({sorted.filter((s) => s.isActive).length} active)
          </span>
        </h2>
        <div className="flex items-center gap-1.5 flex-wrap">
          {(['bid', 'reputation', 'speed'] as SortKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setSortKey(key)}
              className={`px-2.5 py-1.5 text-[11px] font-medium rounded-[var(--radius-sm)] border transition-all cursor-pointer ${
                sortKey === key
                  ? 'border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)]'
                  : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]'
              }`}
            >
              <span className="text-xs inline mr-1">⇅</span>
              {key === 'bid' ? 'Bid (Low)' : key === 'reputation' ? 'Reputation' : 'Speed'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid — asymmetric bento layout */}
      {sorted.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto">
          <AnimatePresence mode="popLayout">
            {sorted.map((solver, i) => (
              <SolverCard
                key={solver.id}
                solver={solver}
                isBestBid={solver.id === bestBidId}
                index={i}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
