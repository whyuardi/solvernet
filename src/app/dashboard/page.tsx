'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  Clock,
  DollarSign,
  Users,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Timer,
  Gauge,
  Layers,
} from 'lucide-react'
import SolverGrid from '@/components/SolverGrid'

/* ─── Types ─────────────────────────────────────────────── */

type ChainId = 'all' | 'ethereum' | 'arbitrum' | 'optimism' | 'base' | 'polygon'
type TokenId = 'all' | 'ETH' | 'USDC' | 'WBTC' | 'ARB' | 'OP'
type Status = 'all' | 'pending' | 'active' | 'filled' | 'expired'

interface Intent {
  id: string
  fromChain: string
  toChain: string
  inputToken: string
  outputToken: string
  amount: number
  status: 'pending' | 'active' | 'filled' | 'expired'
  time: string
  fillPrice?: number
  solver?: string
}

interface Transaction {
  id: string
  intentId: string
  solver: string
  inputToken: string
  outputToken: string
  amount: number
  fillPrice: number
  timestamp: string
  chain: string
}

/* ─── Mock Data ─────────────────────────────────────────── */

const STATS_CARDS = [
  {
    label: 'Active Intents',
    value: '24',
    change: '+12%',
    up: true,
    icon: Layers,
    color: 'var(--accent)',
  },
  {
    label: 'Avg Fill Time',
    value: '12s',
    change: '-18%',
    up: true,
    icon: Timer,
    color: 'var(--success)',
  },
  {
    label: 'Best Spread',
    value: '0.08%',
    change: '-3bps',
    up: true,
    icon: Gauge,
    color: 'var(--success)',
  },
  {
    label: 'Solver Count',
    value: '47',
    change: '+5',
    up: true,
    icon: Users,
    color: 'var(--accent)',
  },
]

const RECENT_INTENTS: Intent[] = [
  { id: 'sn-0x1a2b', fromChain: 'Ethereum', toChain: 'Arbitrum', inputToken: 'ETH', outputToken: 'USDC', amount: 12.5, status: 'active', time: '2m ago', fillPrice: 0.0021, solver: 'Cypher Capital' },
  { id: 'sn-0x3c4d', fromChain: 'Arbitrum', toChain: 'Base', inputToken: 'USDC', outputToken: 'ETH', amount: 50000, status: 'filled', time: '5m ago', fillPrice: 0.0018, solver: 'Albedo Labs' },
  { id: 'sn-0x5e6f', fromChain: 'Optimism', toChain: 'Ethereum', inputToken: 'OP', outputToken: 'ETH', amount: 2500, status: 'pending', time: '8m ago' },
  { id: 'sn-0x7g8h', fromChain: 'Base', toChain: 'Arbitrum', inputToken: 'ETH', outputToken: 'ARB', amount: 5.0, status: 'active', time: '12m ago', fillPrice: 0.0035, solver: 'Delta Prime' },
  { id: 'sn-0x9i0j', fromChain: 'Ethereum', toChain: 'Polygon', inputToken: 'WBTC', outputToken: 'USDC', amount: 0.25, status: 'filled', time: '15m ago', fillPrice: 0.0042, solver: 'Cypher Capital' },
  { id: 'sn-0xk1l2', fromChain: 'Polygon', toChain: 'Optimism', inputToken: 'USDC', outputToken: 'OP', amount: 10000, status: 'expired', time: '30m ago' },
  { id: 'sn-0xm3n4', fromChain: 'Arbitrum', toChain: 'Ethereum', inputToken: 'ARB', outputToken: 'ETH', amount: 800, status: 'filled', time: '1h ago', fillPrice: 0.0029, solver: 'Vertex Relay' },
]

const RECENT_TXS: Transaction[] = [
  { id: 'tx-001', intentId: 'sn-0x1a2b', solver: 'Cypher Capital', inputToken: 'ETH', outputToken: 'USDC', amount: 12.5, fillPrice: 0.0021, timestamp: '2m ago', chain: 'Ethereum → Arbitrum' },
  { id: 'tx-002', intentId: 'sn-0x3c4d', solver: 'Albedo Labs', inputToken: 'USDC', outputToken: 'ETH', amount: 50000, fillPrice: 0.0018, timestamp: '5m ago', chain: 'Arbitrum → Base' },
  { id: 'tx-003', intentId: 'sn-0x7g8h', solver: 'Delta Prime', inputToken: 'ETH', outputToken: 'ARB', amount: 5.0, fillPrice: 0.0035, timestamp: '12m ago', chain: 'Base → Arbitrum' },
  { id: 'tx-004', intentId: 'sn-0x9i0j', solver: 'Cypher Capital', inputToken: 'WBTC', outputToken: 'USDC', amount: 0.25, fillPrice: 0.0042, timestamp: '15m ago', chain: 'Ethereum → Polygon' },
  { id: 'tx-005', intentId: 'sn-0xm3n4', solver: 'Vertex Relay', inputToken: 'ARB', outputToken: 'ETH', amount: 800, fillPrice: 0.0029, timestamp: '1h ago', chain: 'Arbitrum → Ethereum' },
]

const TOP_SOLVERS = [
  { rank: 1, name: 'Cypher Capital', fills: 1247, avgBid: '0.0019 ETH', successRate: 99.9, volume: '$28.4M' },
  { rank: 2, name: 'Albedo Labs', fills: 982, avgBid: '0.0025 ETH', successRate: 99.2, volume: '$19.7M' },
  { rank: 3, name: 'Delta Prime', fills: 756, avgBid: '0.0028 ETH', successRate: 98.6, volume: '$15.2M' },
  { rank: 4, name: 'Nexus Trade', fills: 523, avgBid: '0.0031 ETH', successRate: 97.8, volume: '$11.8M' },
  { rank: 5, name: 'Vertex Relay', fills: 312, avgBid: '0.0042 ETH', successRate: 94.5, volume: '$7.3M' },
]

/* ─── Status Badge ──────────────────────────────────────── */

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-[var(--warning)]/10 text-[var(--warning)]',
    active: 'bg-[var(--accent)]/10 text-[var(--accent)]',
    filled: 'bg-[var(--success)]/10 text-[var(--success)]',
    expired: 'bg-[var(--error)]/10 text-[var(--error)]',
  }
  return (
    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-[var(--radius-full)] ${colors[status] || ''}`}>
      {status}
    </span>
  )
}

/* ─── Dashboard Page ────────────────────────────────────── */

export default function DashboardPage() {
  const [chainFilter, setChainFilter] = useState<ChainId>('all')
  const [tokenFilter, setTokenFilter] = useState<TokenId>('all')
  const [statusFilter, setStatusFilter] = useState<Status>('all')

  const filteredIntents = useMemo(() => {
    return RECENT_INTENTS.filter((intent) => {
      if (statusFilter !== 'all' && intent.status !== statusFilter) return false
      return true
    })
  }, [statusFilter])

  return (
    <div className="flex-1">
      {/* Header */}
      <header className="border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold">Dashboard</h1>
            <span className="text-[10px] text-[var(--text-muted)] bg-[var(--bg-secondary)] px-2 py-0.5 rounded-[var(--radius-full)]">
              Live
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            <Activity size={12} className="text-[var(--success)]" />
            All systems operational
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {STATS_CARDS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                  {stat.label}
                </span>
                <stat.icon size={14} style={{ color: stat.color }} />
              </div>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold font-mono">{stat.value}</span>
                <span
                  className={`text-[11px] font-medium flex items-center gap-0.5 ${
                    stat.up ? 'text-[var(--success)]' : 'text-[var(--error)]'
                  }`}
                >
                  {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {stat.change}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-wrap items-center gap-2">
          <Filter size={14} className="text-[var(--text-muted)]" />
          <select
            value={chainFilter}
            onChange={(e) => setChainFilter(e.target.value as ChainId)}
            className="input-base px-2.5 py-1.5 text-xs cursor-pointer"
          >
            <option value="all">All Chains</option>
            <option value="ethereum">Ethereum</option>
            <option value="arbitrum">Arbitrum</option>
            <option value="optimism">Optimism</option>
            <option value="base">Base</option>
            <option value="polygon">Polygon</option>
          </select>
          <select
            value={tokenFilter}
            onChange={(e) => setTokenFilter(e.target.value as TokenId)}
            className="input-base px-2.5 py-1.5 text-xs cursor-pointer"
          >
            <option value="all">All Tokens</option>
            <option value="ETH">ETH</option>
            <option value="USDC">USDC</option>
            <option value="WBTC">WBTC</option>
            <option value="ARB">ARB</option>
            <option value="OP">OP</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Status)}
            className="input-base px-2.5 py-1.5 text-xs cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="filled">Filled</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        {/* ── Activity Feed & Solver Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Live Activity Feed */}
          <div className="lg:col-span-2">
            <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
              <Activity size={14} className="text-[var(--accent)]" />
              Live Activity
            </h2>
            <div className="space-y-1.5">
              {filteredIntents.length === 0 ? (
                <div className="glass-card p-6 text-center text-sm text-[var(--text-muted)]">
                  No intents match your filters
                </div>
              ) : (
                filteredIntents.map((intent, i) => (
                  <motion.div
                    key={intent.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="glass-card px-4 py-3 flex items-center justify-between gap-3 hover:border-[var(--border-hover)] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-[10px] font-bold text-[var(--text-secondary)] shrink-0">
                        {intent.fromChain[0]}
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
                        <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                          {intent.fillPrice} ETH
                        </span>
                      )}
                      <span className="text-[10px] text-[var(--text-muted)]">{intent.time}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Right: Top Solvers Leaderboard */}
          <div>
            <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
              <Users size={14} className="text-[var(--accent)]" />
              Top Solvers
            </h2>
            <div className="glass-card overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[24px,1fr,60px] gap-2 px-4 py-2 text-[9px] uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border)]">
                <span>#</span>
                <span>Solver</span>
                <span className="text-right">Rate</span>
              </div>
              <div className="divide-y divide-[var(--border)]">
                {TOP_SOLVERS.map((s) => (
                  <div
                    key={s.rank}
                    className="grid grid-cols-[24px,1fr,60px] gap-2 px-4 py-2.5 items-center hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                  >
                    <span
                      className={`text-xs font-bold ${
                        s.rank <= 3 ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'
                      }`}
                    >
                      {s.rank}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{s.name}</div>
                      <div className="text-[10px] text-[var(--text-muted)]">{s.volume}</div>
                    </div>
                    <span className="text-xs font-mono text-right text-[var(--success)]">
                      {s.successRate}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Recent Transactions ── */}
        <div>
          <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
            <CheckCircle2 size={14} className="text-[var(--success)]" />
            Recent Transactions
          </h2>
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                    <th className="text-left px-4 py-2.5 font-medium">Intent</th>
                    <th className="text-left px-4 py-2.5 font-medium">Solver</th>
                    <th className="text-left px-4 py-2.5 font-medium">Route</th>
                    <th className="text-right px-4 py-2.5 font-medium">Amount</th>
                    <th className="text-right px-4 py-2.5 font-medium">Fill Price</th>
                    <th className="text-right px-4 py-2.5 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {RECENT_TXS.map((tx, i) => (
                    <motion.tr
                      key={tx.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-[var(--accent)]">{tx.intentId}</td>
                      <td className="px-4 py-3">{tx.solver}</td>
                      <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{tx.chain}</td>
                      <td className="px-4 py-3 text-right font-mono">
                        {tx.amount} {tx.inputToken}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-[var(--accent)]">
                        {tx.fillPrice} ETH
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-[var(--text-muted)]">
                        {tx.timestamp}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
