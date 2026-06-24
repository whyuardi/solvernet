'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeftRight,
  Clock,
  DollarSign,
  Users,
  TrendingDown,
  ArrowUpRight,
  Globe,
  Zap,
  AlertCircle,
} from 'lucide-react'
import AuctionVisualizer from '@/components/AuctionVisualizer'

/* ─── Types ─────────────────────────────────────────────── */

interface AuctionBid {
  solver: string
  amount: number
  time: string
  isWinning: boolean
}

/* ─── Mock Data ─────────────────────────────────────────── */

const INTENT_DETAILS = {
  id: 'sn-0x1a2b3c4d',
  fromChain: 'Ethereum',
  toChain: 'Arbitrum',
  inputToken: 'ETH',
  outputToken: 'USDC',
  amount: 12.5,
  minReceive: '18,750 USDC',
  deadline: '4:32 remaining',
  created: '2 minutes ago',
  status: 'active' as const,
}

const BIDS: AuctionBid[] = [
  { solver: 'Cypher Capital', amount: 0.0021, time: '0:15 ago', isWinning: true },
  { solver: 'Albedo Labs', amount: 0.0025, time: '0:42 ago', isWinning: false },
  { solver: 'Delta Prime', amount: 0.0028, time: '1:20 ago', isWinning: false },
  { solver: 'Nexus Trade', amount: 0.0031, time: '2:05 ago', isWinning: false },
]

const BID_LOG: { solver: string; action: string; price: string; time: string }[] = [
  { solver: 'Cypher Capital', action: 'Bid placed', price: '0.0021 ETH', time: '0:15 ago' },
  { solver: 'Albedo Labs', action: 'Bid updated', price: '0.0025 ETH', time: '0:42 ago' },
  { solver: 'Delta Prime', action: 'Bid placed', price: '0.0028 ETH', time: '1:20 ago' },
  { solver: 'Nexus Trade', action: 'Bid placed', price: '0.0031 ETH', time: '2:05 ago' },
  { solver: 'Cypher Capital', action: 'Bid updated', price: '0.0035 ETH', time: '2:45 ago' },
  { solver: 'Albedo Labs', action: 'Bid placed', price: '0.0038 ETH', time: '3:10 ago' },
]

/* ─── Auction Page ──────────────────────────────────────── */

export default function AuctionPage() {
  const [timeRemaining, setTimeRemaining] = useState(292) // 4:52

  useEffect(() => {
    if (timeRemaining <= 0) return
    const interval = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [timeRemaining])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const bestBid = useMemo(
    () => BIDS.reduce((best, b) => (b.amount < best.amount ? b : best), BIDS[0]),
    [],
  )

  return (
    <div className="flex-1">
      {/* Header */}
      <header className="border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="/dashboard"
              className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              &larr; Dashboard
            </a>
            <span className="text-[var(--text-muted)]">/</span>
            <h1 className="text-sm font-semibold font-mono text-[var(--accent)]">
              {INTENT_DETAILS.id}
            </h1>
          </div>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-[var(--radius-full)] bg-[var(--accent)]/10 text-[var(--accent)]">
            Active Auction
          </span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left Column: Intent Details + Chart ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Intent Details Panel */}
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold">Intent Details</h2>
                <span className="text-[10px] text-[var(--text-muted)] font-mono">
                  {INTENT_DETAILS.id}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[var(--bg-secondary)] rounded-[var(--radius-sm)] p-3">
                  <div className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] mb-1">
                    From
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <Globe size={12} className="text-[var(--accent)]" />
                    {INTENT_DETAILS.fromChain}
                  </div>
                </div>
                <div className="bg-[var(--bg-secondary)] rounded-[var(--radius-sm)] p-3">
                  <div className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] mb-1">
                    To
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <ArrowUpRight size={12} className="text-[var(--accent)]" />
                    {INTENT_DETAILS.toChain}
                  </div>
                </div>
                <div className="bg-[var(--bg-secondary)] rounded-[var(--radius-sm)] p-3">
                  <div className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] mb-1">
                    Amount
                  </div>
                  <div className="text-sm font-medium font-mono">
                    {INTENT_DETAILS.amount} {INTENT_DETAILS.inputToken}
                  </div>
                </div>
                <div className="bg-[var(--bg-secondary)] rounded-[var(--radius-sm)] p-3">
                  <div className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] mb-1">
                    Min Receive
                  </div>
                  <div className="text-sm font-medium font-mono text-[var(--accent)]">
                    {INTENT_DETAILS.minReceive}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border)]">
                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                  <Clock size={12} />
                  <span>Deadline: </span>
                  <span className="font-mono text-[var(--text-primary)]">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                  <Zap size={12} />
                  <span>Output: </span>
                  <span className="font-mono text-[var(--text-primary)]">
                    {INTENT_DETAILS.outputToken}
                  </span>
                </div>
              </div>
            </div>

            {/* Price Chart */}
            <AuctionVisualizer />
          </div>

          {/* ── Right Column: Solver Bidding + History ── */}
          <div className="space-y-6">
            {/* Active Bidding */}
            <div className="glass-card p-5">
              <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <TrendingDown size={14} className="text-[var(--accent)]" />
                Active Bids
                <span className="text-[10px] font-normal text-[var(--text-muted)]">
                  ({BIDS.length} solvers)
                </span>
              </h2>

              <div className="space-y-2">
                {BIDS.map((bid, i) => (
                  <motion.div
                    key={`${bid.solver}-${bid.amount}`}
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
                          <span className="ml-1.5 text-[9px] uppercase tracking-widest text-[var(--accent)]">
                            Best
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-mono font-medium ${bid.isWinning ? 'text-[var(--accent)]' : ''}`}>
                        {bid.amount.toFixed(4)} ETH
                      </div>
                      <div className="text-[9px] text-[var(--text-muted)]">{bid.time}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Best bid highlight */}
              {bestBid && (
                <div className="mt-4 pt-4 border-t border-[var(--border)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                      Best Bid
                    </span>
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

            {/* Bid History Log */}
            <div className="glass-card p-5">
              <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Clock size={14} className="text-[var(--text-muted)]" />
                Bid History
              </h2>

              <div className="space-y-1 max-h-[320px] overflow-y-auto">
                {BID_LOG.map((entry, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-3 py-2 rounded-[var(--radius-sm)] text-xs hover:bg-[var(--bg-secondary)] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[var(--bg-primary)] flex items-center justify-center text-[8px] font-bold text-[var(--text-secondary)]">
                        {entry.solver[0]}
                      </span>
                      <div>
                        <span className="font-medium text-[var(--text-primary)]">{entry.solver}</span>
                        <span className="text-[var(--text-muted)]"> {entry.action}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-[var(--accent)]">{entry.price}</div>
                      <div className="text-[9px] text-[var(--text-muted)]">{entry.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Auction Info */}
            <div className="glass-card p-4">
              <div className="flex items-start gap-3">
                <AlertCircle size={14} className="text-[var(--accent)] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-semibold mb-1">Dutch Auction Active</h3>
                  <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                    Price started at 0.0100 ETH and decays linearly. First solver to bid at or
                    below the current price wins the intent.
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
