'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { getIntents, getActivity, getSolvers, subscribe } from '@/lib/intent-store'

export default function AnalyticsPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    return subscribe(() => setRefreshKey((k) => k + 1))
  }, [])

  const intents = useMemo(() => getIntents(), [refreshKey])
  const activity = useMemo(() => getActivity(50), [refreshKey])
  const solvers = useMemo(() => getSolvers(), [refreshKey])

  const filled = intents.filter((i) => i.status === 'filled')
  const pending = intents.filter((i) => i.status === 'pending' || i.status === 'auction')
  const expired = intents.filter((i) => i.status === 'expired')

  // Volume over time (hourly buckets for last 6h)
  const hourlyVolume = useMemo(() => {
    const now = Date.now()
    const buckets: { label: string; volume: number; count: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const start = now - (i + 1) * 3600000
      const end = now - i * 3600000
      const inBucket = filled.filter((f) => f.fillTime && f.createdAt >= start && f.createdAt < end)
      const vol = inBucket.reduce((sum, f) => sum + f.amount * 3500, 0)
      buckets.push({
        label: `${i === 0 ? 'Now' : `-${i}h`}`,
        volume: vol,
        count: inBucket.length,
      })
    }
    return buckets
  }, [filled])

  const maxVolume = Math.max(...hourlyVolume.map((b) => b.volume), 1)

  // Success rate per solver
  const solverData = useMemo(() => {
    return solvers.slice(0, 5).map((s) => ({
      name: s.name,
      wins: s.wins,
      fillRate: s.winRate,
      avgBid: s.avgBidPrice,
      volume: s.volume,
    }))
  }, [solvers])

  return (
    <div className="flex-1">
      <header className="border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold">Analytics</h1>
            <span className="text-[10px] text-[var(--text-muted)] bg-[var(--bg-secondary)] px-2 py-0.5 rounded-[var(--radius-full)]">
              Beta
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] shrink-0">
            <span className="text-xs text-[var(--accent)]">⟡</span>
            <span>Updated live</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Summary overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="card p-4">
            <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Total Intents</span>
            <div className="text-2xl font-bold font-mono mt-1">{intents.length}</div>
          </div>
          <div className="card p-4">
            <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Filled</span>
            <div className="text-2xl font-bold font-mono mt-1 text-[var(--success)]">{filled.length}</div>
          </div>
          <div className="card p-4">
            <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Pending</span>
            <div className="text-2xl font-bold font-mono mt-1 text-[var(--accent)]">{pending.length}</div>
          </div>
          <div className="card p-4">
            <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Expired</span>
            <div className="text-2xl font-bold font-mono mt-1 text-[var(--error)]">{expired.length}</div>
          </div>
        </div>

        {/* Volume Chart */}
        <div>
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <span className="text-sm text-[var(--accent)]">⟡</span>
            Volume (Last 6 Hours)
          </h2>
          <div className="card p-5">
            <div className="flex items-end justify-between gap-2 h-40">
              {hourlyVolume.map((bucket, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <span className="text-[9px] text-[var(--text-muted)] font-mono">
                    ${(bucket.volume / 1000).toFixed(0)}k
                  </span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(4, (bucket.volume / maxVolume) * 100)}%` }}
                    transition={{ duration: 0.6, delay: i * 0.08 }}
                    className="w-full rounded-[var(--radius-sm)]"
                    style={{
                      background: bucket.volume > 0
                        ? 'linear-gradient(to top, var(--accent), var(--accent-dim))'
                        : 'var(--border)',
                    }}
                  />
                  <span className="text-[9px] text-[var(--text-muted)]">{bucket.label}</span>
                  <span className="text-[8px] text-[var(--text-muted)]">{bucket.count} tx</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Solver Performance */}
        <div>
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <span className="text-sm text-[var(--accent)]">✦</span>
            Solver Performance
          </h2>
          <div className="card overflow-hidden">
            <div className="grid grid-cols-[1fr,60px,80px,80px] gap-2 px-4 py-2 text-[9px] uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border)]">
              <span>Solver</span>
              <span className="text-right">Wins</span>
              <span className="text-right">Fill Rate</span>
              <span className="text-right">Avg Bid</span>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {solverData.map((s, i) => (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="grid grid-cols-[1fr,60px,80px,80px] gap-2 px-4 py-3 items-center hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[var(--accent-dim)] flex items-center justify-center text-[10px] font-bold text-[var(--accent)]">
                      {s.name[0]}
                    </span>
                    <span className="text-sm font-medium">{s.name}</span>
                  </div>
                  <span className="text-sm font-mono text-right text-[var(--accent)]">{s.wins}</span>
                  <span className="text-sm font-mono text-right text-[var(--success)]">{s.fillRate.toFixed(1)}%</span>
                  <span className="text-xs font-mono text-right text-[var(--text-secondary)]">
                    {s.avgBid.toFixed(4)} ETH
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Fill distribution */}
        <div>
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <span className="text-sm text-[var(--accent)]">⟐</span>
            Intent Status Distribution
          </h2>
          <div className="card p-5">
            <div className="flex items-center gap-2 h-6">
              {intents.length > 0 ? (
                <>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(filled.length / intents.length) * 100}%` }}
                    className="h-full rounded-[var(--radius-sm)] bg-[var(--success)]"
                    style={{ opacity: 0.8 }}
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(pending.length / intents.length) * 100}%` }}
                    className="h-full rounded-[var(--radius-sm)] bg-[var(--accent)]"
                    style={{ opacity: 0.6 }}
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(expired.length / intents.length) * 100}%` }}
                    className="h-full rounded-[var(--radius-sm)] bg-[var(--error)]"
                    style={{ opacity: 0.5 }}
                  />
                </>
              ) : (
                <div className="h-full w-full rounded-[var(--radius-sm)] bg-[var(--border)]" />
              )}
            </div>
            <div className="flex items-center gap-6 mt-3 text-xs text-[var(--text-secondary)]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[var(--success)]" />
                Filled ({filled.length})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                Pending ({pending.length})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[var(--error)]" />
                Expired ({expired.length})
              </span>
            </div>
          </div>
        </div>

        {/* Empty state */}
        {intents.length === 0 && (
          <div className="card p-8 text-center">
            <p className="text-sm text-[var(--text-muted)] mb-3">No data yet — post your first intent to see analytics</p>
            <a href="/#intent" className="btn-primary px-6 py-2.5 text-xs inline-flex">Post Intent</a>
          </div>
        )}
      </div>
    </div>
  )
}
