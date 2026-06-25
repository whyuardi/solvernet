'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  getIntents, getActivity, getStats, getSolvers,
  subscribe
} from '@/lib/intent-store'

type Status = 'all' | 'pending' | 'auction' | 'filled' | 'expired'

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-[var(--warning)]/10 text-[var(--warning)]',
    auction: 'bg-[var(--accent)]/10 text-[var(--accent)]',
    filled: 'bg-[var(--success)]/10 text-[var(--success)]',
    expired: 'bg-[var(--error)]/10 text-[var(--error)]',
  }
  return (
    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-[var(--radius-full)] ${colors[status] || ''}`}>
      {status}
    </span>
  )
}

export default function DashboardPage() {
  const [statusFilter, setStatusFilter] = useState<Status>('all')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    return subscribe(() => setRefreshKey((k) => k + 1))
  }, [])

  const intents = useMemo(() => getIntents(), [refreshKey])
  const activity = useMemo(() => getActivity(15), [refreshKey])
  const stats = useMemo(() => getStats(), [refreshKey])
  const solvers = useMemo(() => getSolvers(), [refreshKey])

  const filteredIntents = useMemo(() => {
    if (statusFilter === 'all') return intents.slice(0, 8)
    return intents.filter((i) => i.status === statusFilter).slice(0, 8)
  }, [intents, statusFilter])

  const formatIntentTime = (ts: number) => {
    const diff = Date.now() - ts
    if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    return `${Math.floor(diff / 3600000)}h ago`
  }

  return (
    <div className="flex-1">
      {/* Header */}
      <header className="border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold">Dashboard</h1>
            <span className="text-[10px] text-[var(--text-muted)] bg-[var(--bg-secondary)] px-2 py-0.5 rounded-[var(--radius-full)]">
              Live
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] shrink-0">
            <span className="text-xs text-[var(--success)]">⟐</span>
            <span className="hidden sm:inline">All systems operational</span>
            <span className="sm:hidden">OK</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Active Intents</span>
              <span className="text-sm text-[var(--accent)]">⟐</span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold font-mono">{stats.activeIntents}</span>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Avg Fill Time</span>
              <span className="text-sm text-[var(--success)]">⏱</span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold font-mono">
                {stats.avgFillTime > 0 ? `${(stats.avgFillTime / 1000).toFixed(0)}s` : '—'}
              </span>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Total Volume</span>
              <span className="text-sm text-[var(--success)]">⟡</span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold font-mono">
                {stats.totalVolume > 0 ? `$${(stats.totalVolume / 1000000).toFixed(1)}M` : '—'}
              </span>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Solvers</span>
              <span className="text-sm text-[var(--accent)]">✦</span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold font-mono">{stats.solverCount}</span>
            </div>
          </motion.div>
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto">
          <span className="text-sm text-[var(--text-muted)]">⟐</span>
          {(['all', 'pending', 'auction', 'filled', 'expired'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1.5 text-xs rounded-[var(--radius-sm)] border transition-all cursor-pointer font-[var(--font-mono)] uppercase ${
                statusFilter === s
                  ? 'border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)]'
                  : 'border-[var(--border)] bg-transparent text-[var(--text-secondary)] hover:border-[var(--border-hover)]'
              }`}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>

        {/* ── Intents Feed & Solver Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Recent Intents */}
          <div className="lg:col-span-2">
            <h2 className="text-sm sm:text-base font-semibold mb-3 flex items-center gap-2">
              <span className="text-sm text-[var(--accent)]">⟐</span>
              Recent Intents
              <span className="text-[10px] font-normal text-[var(--text-muted)]">({intents.length} total)</span>
            </h2>
            <div className="space-y-1.5">
              {filteredIntents.length === 0 ? (
                <div className="card p-6 text-center text-sm text-[var(--text-muted)]">
                  No intents yet — post one from the Explore page
                </div>
              ) : (
                filteredIntents.map((intent, i) => (
                  <motion.div
                    key={intent.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="card px-4 py-3 flex items-center justify-between gap-3 hover:border-[var(--border-hover)] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-[10px] font-bold text-[var(--text-secondary)] shrink-0">
                        {(intent.fromChain as string)[0]?.toUpperCase() || '?'}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">
                          {intent.amount} {intent.inputToken} → {intent.outputToken}
                        </div>
                        <div className="text-[10px] text-[var(--text-muted)]">
                          {intent.fromChain} → {intent.toChain}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <StatusBadge status={intent.status} />
                      {intent.fillPrice && (
                        <span className="text-[10px] font-mono text-[var(--text-secondary)] hidden sm:inline">
                          {intent.fillPrice.toFixed(4)} ETH
                        </span>
                      )}
                      <span className="text-[10px] text-[var(--text-muted)]">{formatIntentTime(intent.createdAt)}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Right: Solver Leaderboard */}
          <div>
            <h2 className="text-sm sm:text-base font-semibold mb-3 flex items-center gap-2">
              <span className="text-sm text-[var(--accent)]">✦</span>
              Top Solvers
            </h2>
            <div className="card overflow-hidden">
              <div className="grid grid-cols-[24px,1fr,60px] gap-2 px-4 py-2 text-[9px] uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border)]">
                <span>#</span>
                <span>Solver</span>
                <span className="text-right">Rate</span>
              </div>
              <div className="divide-y divide-[var(--border)]">
                {solvers.slice(0, 5).map((s) => (
                  <div
                    key={s.name}
                    className="grid grid-cols-[24px,1fr,60px] gap-2 px-4 py-2.5 items-center hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                  >
                    <span className={`text-xs font-bold ${solvers.indexOf(s) < 3 ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}>
                      {solvers.indexOf(s) + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{s.name}</div>
                      <div className="text-[10px] text-[var(--text-muted)]">${(s.volume / 1000000).toFixed(1)}M vol</div>
                    </div>
                    <span className="text-xs font-mono text-right text-[var(--success)]">
                      {s.winRate.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Live Activity ── */}
        <div>
          <h2 className="text-sm sm:text-base font-semibold mb-3 flex items-center gap-2">
            <span className="text-sm text-[var(--success)]">✓</span>
            Live Activity
            <span className="text-[10px] font-normal text-[var(--text-muted)]">({activity.length} events)</span>
          </h2>
          <div className="card overflow-hidden">
            <div className="divide-y divide-[var(--border)]">
              {activity.length === 0 ? (
                <div className="p-6 text-center text-sm text-[var(--text-muted)]">
                  No activity yet
                </div>
              ) : (
                activity.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center gap-3 px-4 py-2.5 text-xs hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                  >
                    <span className={`text-xs ${
                      entry.type === 'auction_won' ? 'text-[var(--success)]' :
                      entry.type === 'bid_placed' ? 'text-[var(--accent)]' :
                      'text-[var(--text-muted)]'
                    }`}>
                      {entry.type === 'intent_posted' ? '✦' :
                       entry.type === 'bid_placed' ? '↓' :
                       entry.type === 'auction_won' ? '✓' : '⟐'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium">{entry.solver || 'System'}</span>
                      <span className="text-[var(--text-muted)]">
                        {' '}{entry.type === 'intent_posted' ? 'posted intent' :
                         entry.type === 'bid_placed' ? 'placed bid' :
                         entry.type === 'auction_won' ? 'won auction' : 'updated'}
                        {entry.price ? ` at ${entry.price.toFixed(4)} ETH` : ''}
                        {entry.amount ? ` — ${entry.amount} ${entry.token || ''}` : ''}
                      </span>
                    </div>
                    <span className="text-[10px] text-[var(--text-muted)] shrink-0">
                      {formatIntentTime(entry.timestamp)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
