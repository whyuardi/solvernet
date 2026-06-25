'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import AuctionVisualizer from '@/components/AuctionVisualizer'
import { getIntent, getAuction, getSolvers, subscribe } from '@/lib/intent-store'
import { stopAuctionEngine } from '@/lib/auction-engine'

/* ─── Types ─────────────────────────────────────────── */

interface AuctionBid {
  solver: string
  amount: number
  time: string
  isWinning: boolean
}

/* ─── Mock Data ─────────────────────────────────────── */

const BID_LOG: { solver: string; action: string; price: string; time: string }[] = [
  { solver: 'Cypher Capital', action: 'Bid placed', price: '0.0021 ETH', time: '0:15 ago' },
  { solver: 'Albedo Labs', action: 'Bid updated', price: '0.0025 ETH', time: '0:42 ago' },
  { solver: 'Delta Prime', action: 'Bid placed', price: '0.0028 ETH', time: '1:20 ago' },
  { solver: 'Nexus Trade', action: 'Bid placed', price: '0.0031 ETH', time: '2:05 ago' },
  { solver: 'Cypher Capital', action: 'Bid updated', price: '0.0035 ETH', time: '2:45 ago' },
  { solver: 'Albedo Labs', action: 'Bid placed', price: '0.0038 ETH', time: '3:10 ago' },
]

/* ─── Auction Page ──────────────────────────────────── */

export default function AuctionPage() {
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(292)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    setSearchParams(new URLSearchParams(window.location.search))
  }, [])

  // Subscribe to store changes
  useEffect(() => {
    return subscribe(() => setRefreshKey((k) => k + 1))
  }, [])

  // Load intent from store
  const intentData = useMemo(() => {
    if (!searchParams) return null
    const id = searchParams.get('id')
    if (!id) return null
    return getIntent(id)
  }, [searchParams, refreshKey])

  const auctionState = useMemo(() => {
    if (!intentData) return null
    return getAuction(intentData.id)
  }, [intentData, refreshKey])

  const solvers = useMemo(() => getSolvers(), [refreshKey])

  // Timer for auction
  useEffect(() => {
    if (!auctionState || auctionState.settled) return
    const elapsed = Math.floor((Date.now() - auctionState.startTime) / 1000)
    const remaining = Math.max(0, auctionState.duration - elapsed)
    setTimeRemaining(remaining)

    const interval = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [auctionState])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intentData) stopAuctionEngine(intentData.id)
    }
  }, [intentData])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const intent = intentData || {
    id: 'sn-0x1a2b3c4d',
    fromChain: 'Ethereum',
    toChain: 'Arbitrum',
    inputToken: 'ETH',
    outputToken: 'USDC',
    amount: 12.5,
    slippage: 0.5,
    deadline: 30,
    status: 'auction' as const,
    createdAt: Date.now(),
  }

  const fromChain = typeof intent.fromChain === 'string' ? intent.fromChain : 'Ethereum'
  const toChain = typeof intent.toChain === 'string' ? intent.toChain : 'Arbitrum'

  const BIDS: AuctionBid[] = useMemo(() => {
    if (auctionState) {
      if (auctionState.bids.length === 0) {
        return [{ solver: '—', amount: 0, time: '—', isWinning: false }]
      }
      const bestPrice = Math.min(...auctionState.bids.map((b) => b.amount))
      return auctionState.bids
        .sort((a, b) => a.amount - b.amount)
        .slice(0, 5)
        .map((b) => ({
          solver: b.solver,
          amount: b.amount,
          time: formatTime(b.time),
          isWinning: b.amount === bestPrice,
        }))
    }
    return [
      { solver: 'Cypher Capital', amount: 0.0021, time: '0:15 ago', isWinning: true },
      { solver: 'Albedo Labs', amount: 0.0025, time: '0:42 ago', isWinning: false },
      { solver: 'Delta Prime', amount: 0.0028, time: '1:20 ago', isWinning: false },
      { solver: 'Nexus Trade', amount: 0.0031, time: '2:05 ago', isWinning: false },
    ]
  }, [auctionState])

  const bestBid = useMemo(
    () => BIDS.reduce((best, b) => (b.amount < best.amount ? b : best), BIDS[0]),
    [BIDS],
  )

  return (
    <div className="flex-1">
      {/* Header */}
      <header className="border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <a
              href="/dashboard"
              className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors shrink-0"
            >
              &larr; Dashboard
            </a>
            <span className="text-[var(--text-muted)] hidden sm:inline">/</span>
            <h1 className="text-sm font-semibold font-mono text-[var(--accent)] truncate hidden sm:block">
              {intent.id}
            </h1>
          </div>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-[var(--radius-full)] bg-[var(--accent)]/10 text-[var(--accent)] shrink-0">
            {auctionState?.settled ? 'Settled' : auctionState ? 'Live Auction' : 'Auction Details'}
          </span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left Column: Intent Details + Chart ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Intent Details Panel */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4 gap-2">
                <h2 className="text-sm font-semibold shrink-0">Intent Details</h2>
                <span className="text-[10px] text-[var(--text-muted)] font-mono truncate hidden sm:block">
                  {intent.id}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[var(--bg-secondary)] rounded-[var(--radius-sm)] p-3">
                  <div className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] mb-1">From</div>
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <span className="text-xs text-[var(--accent)]">⟐</span>
                    {fromChain.charAt(0).toUpperCase() + fromChain.slice(1)}
                  </div>
                </div>
                <div className="bg-[var(--bg-secondary)] rounded-[var(--radius-sm)] p-3">
                  <div className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] mb-1">To</div>
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <span className="text-xs text-[var(--accent)]">→</span>
                    {toChain.charAt(0).toUpperCase() + toChain.slice(1)}
                  </div>
                </div>
                <div className="bg-[var(--bg-secondary)] rounded-[var(--radius-sm)] p-3">
                  <div className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] mb-1">Amount</div>
                  <div className="text-sm font-medium font-mono">
                    {intent.amount} {intent.inputToken}
                  </div>
                </div>
                <div className="bg-[var(--bg-secondary)] rounded-[var(--radius-sm)] p-3">
                  <div className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] mb-1">Status</div>
                  <div className="text-sm font-medium font-mono text-[var(--accent)]">
                    {intent.status}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between mt-4 pt-4 border-t border-[var(--border)] gap-3">
                {auctionState && !auctionState.settled && (
                  <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] shrink-0">
                    <span className="text-xs">⏱</span>
                    <span>Deadline: </span>
                    <span className={`font-mono ${timeRemaining < 60 ? 'text-[var(--error)]' : 'text-[var(--text-primary)]'}`}>
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                )}
                {auctionState?.settled && (
                  <div className="flex items-center gap-2 text-xs text-[var(--success)]">
                    <span>✓</span>
                    <span>Settled at </span>
                    <span className="font-mono">{auctionState.winningPrice?.toFixed(4)} ETH</span>
                    <span>by {auctionState.winningSolver}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] shrink-0">
                  <span className="text-xs">⟡</span>
                  <span>Output: </span>
                  <span className="font-mono text-[var(--text-primary)]">{intent.outputToken}</span>
                </div>
              </div>
            </div>

            {/* Price Chart */}
            <AuctionVisualizer intentId={intent.id} />
          </div>

          {/* ── Right Column: Solver Bidding ── */}
          <div className="space-y-6">
            {/* Active Bidding */}
            <div className="card p-5">
              <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <span className="text-sm text-[var(--accent)]">↓</span>
                {auctionState?.settled ? 'Winning Bid' : 'Active Bids'}
                <span className="text-[10px] font-normal text-[var(--text-muted)]">
                  ({BIDS.filter((b) => b.amount > 0).length} solvers)
                </span>
              </h2>

              <div className="space-y-2">
                {BIDS.map((bid, i) => (
                  <motion.div
                    key={`${bid.solver}-${i}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className={`relative flex items-center justify-between px-3 py-2.5 rounded-[var(--radius-sm)] text-sm ${
                      bid.isWinning
                        ? 'bg-[var(--accent-dim)] border border-[var(--accent)]/30'
                        : 'bg-[var(--bg-secondary)] border border-transparent'
                    }`}
                  >
                    {bid.isWinning && (
                      <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-[var(--accent)]" />
                    )}
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[var(--bg-primary)] flex items-center justify-center text-[10px] font-bold text-[var(--text-secondary)]">
                        {bid.solver[0]}
                      </span>
                      <div>
                        <span className="font-medium">{bid.solver}</span>
                        {bid.isWinning && (
                          <span className="ml-1.5 text-[9px] uppercase tracking-widest text-[var(--accent)]">Best</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-mono font-medium ${bid.isWinning ? 'text-[var(--accent)]' : ''}`}>
                        {bid.amount > 0 ? `${bid.amount.toFixed(4)} ETH` : '—'}
                      </div>
                      <div className="text-[9px] text-[var(--text-muted)]">{bid.time}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Best bid highlight */}
              {bestBid && bestBid.amount > 0 && (
                <div className="mt-4 pt-4 border-t border-[var(--border)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Best Bid</span>
                    <span className="text-sm font-bold font-mono text-[var(--accent)]">
                      {bestBid.amount.toFixed(4)} ETH
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-[var(--text-muted)]">by {bestBid.solver}</span>
                    <span className="text-[10px] text-[var(--text-secondary)]">
                      ${(bestBid.amount * 3500).toFixed(2)} USD
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Solver Leaderboard */}
            <div className="card p-5">
              <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <span className="text-sm text-[var(--accent)]">✦</span>
                Solver Rankings
              </h2>
              <div className="space-y-1.5 max-h-[260px] overflow-y-auto">
                {solvers.slice(0, 5).map((s, i) => (
                  <div
                    key={s.name}
                    className="flex items-center justify-between px-3 py-2 rounded-[var(--radius-sm)] text-xs hover:bg-[var(--bg-secondary)] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold w-4 ${i < 3 ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}>
                        {i + 1}
                      </span>
                      <span className="font-medium">{s.name}</span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-[var(--accent)]">{s.wins} wins</span>
                      <span className="text-[var(--text-muted)] ml-2">{s.winRate.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Auction Info */}
            <div className="card p-4">
              <div className="flex items-start gap-3">
                <span className="text-sm text-[var(--accent)] shrink-0 mt-0.5">!</span>
                <div>
                  <h3 className="text-xs font-semibold mb-1">
                    {auctionState?.settled ? 'Auction Settled' : 'Dutch Auction Active'}
                  </h3>
                  <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                    {auctionState?.settled
                      ? `Winning solver: ${auctionState.winningSolver} at ${auctionState.winningPrice?.toFixed(4)} ETH`
                      : 'Price decays linearly. First solver to bid at or below the current price can win the intent.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
