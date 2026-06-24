'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { TrendingDown, Clock, DollarSign, Users } from 'lucide-react'

/* ─── Types ─────────────────────────────────────────────── */

interface BidEntry {
  solver: string
  amount: number // bid price in ETH
  time: number // seconds remaining at bid time
  timestamp: number
}

interface AuctionState {
  startingPrice: number
  reservePrice: number
  currentPrice: number
  startTime: number
  duration: number // total seconds
  timeRemaining: number // seconds
  bids: BidEntry[]
}

/* ─── Mock Data ─────────────────────────────────────────── */

function generateMockAuction(): AuctionState {
  const now = Date.now()
  const duration = 300 // 5 minutes
  return {
    startingPrice: 0.01,
    reservePrice: 0.0005,
    currentPrice: 0.01,
    startTime: now,
    duration,
    timeRemaining: duration,
    bids: [
      {
        solver: 'Cypher Capital',
        amount: 0.0082,
        time: 240,
        timestamp: now - 60000,
      },
      {
        solver: 'Albedo Labs',
        amount: 0.0065,
        time: 180,
        timestamp: now - 120000,
      },
      {
        solver: 'Delta Prime',
        amount: 0.0041,
        time: 120,
        timestamp: now - 180000,
      },
    ],
  }
}

/* ─── Format helpers ────────────────────────────────────── */

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function formatBidPrice(eth: number): string {
  return `${eth.toFixed(4)} ETH`
}

/* ─── Main Component ────────────────────────────────────── */

export default function AuctionVisualizer({
  initialAuction,
}: {
  initialAuction?: AuctionState
}) {
  const [auction, setAuction] = useState<AuctionState>(
    initialAuction ?? generateMockAuction(),
  )
  const svgRef = useRef<SVGSVGElement>(null)
  const [dimensions, setDimensions] = useState({ w: 700, h: 280 })

  // Countdown and price decay
  useEffect(() => {
    if (auction.timeRemaining <= 0) return

    const interval = setInterval(() => {
      setAuction((prev) => {
        const remaining = Math.max(0, prev.timeRemaining - 1)
        const elapsed = prev.duration - remaining
        const progress = elapsed / prev.duration

        // Linear decay from startingPrice to reservePrice
        const price = Math.max(
          prev.reservePrice,
          prev.startingPrice - (prev.startingPrice - prev.reservePrice) * progress,
        )

        return {
          ...prev,
          timeRemaining: remaining,
          currentPrice: price,
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Responsive dimensions
  useEffect(() => {
    function updateSize() {
      if (svgRef.current?.parentElement) {
        const rect = svgRef.current.parentElement.getBoundingClientRect()
        setDimensions({ w: rect.width, h: Math.min(280, rect.width * 0.4) })
      }
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  /* ─── SVG Curve Calculation ─────────────────────────────── */

  const { pathD, currentX, currentY, startX, startY, reserveX, reserveY, bidPoints } =
    useMemo(() => {
      const { w, h } = dimensions
      const pad = { top: 20, bottom: 30, left: 40, right: 20 }
      const chartW = w - pad.left - pad.right
      const chartH = h - pad.top - pad.bottom

      const { startingPrice, reservePrice, currentPrice, duration, timeRemaining, bids } =
        auction

      const priceRange = startingPrice - reservePrice || 1
      const priceToY = (p: number) =>
        pad.top + chartH * (1 - (p - reservePrice) / priceRange)
      const timeToX = (t: number) => pad.left + chartW * (1 - t / duration)

      const steps = 100
      let path = ''
      for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * duration
        const progress = t / duration
        const price = startingPrice - (startingPrice - reservePrice) * progress
        const x = timeToX(t)
        const y = priceToY(price)
        path += i === 0 ? `M ${x},${y} ` : `L ${x},${y} `
      }

      // Current price marker
      const elapsed = duration - timeRemaining
      const currentXPos = timeToX(elapsed)
      const currentYPos = priceToY(currentPrice)

      // Starting price
      const startXPos = timeToX(0)
      const startYPos = priceToY(startingPrice)

      // Reserve price
      const reserveXPos = timeToX(duration)
      const reserveYPos = priceToY(reservePrice)

      // Bid points
      const bidPts = bids.map((b) => ({
        ...b,
        x: timeToX(duration - b.time),
        y: priceToY(b.amount),
      }))

      return {
        pathD: path,
        currentX: currentXPos,
        currentY: currentYPos,
        startX: startXPos,
        startY: startYPos,
        reserveX: reserveXPos,
        reserveY: reserveYPos,
        bidPoints: bidPts,
      }
    }, [auction, dimensions])

  /* ─── Bid History ───────────────────────────────────────── */

  const bidHistory = useMemo(() => {
    return [...auction.bids].sort((a, b) => b.timestamp - a.timestamp)
  }, [auction.bids])

  return (
    <div className="glass-card p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-semibold flex items-center gap-2">
            <TrendingDown size={16} className="text-[var(--accent)]" />
            Dutch Auction
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Price decays until reserve or solver bids
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
              Current Price
            </div>
            <div className="text-lg font-semibold font-mono text-[var(--accent)]">
              {formatBidPrice(auction.currentPrice)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1">
              <Clock size={10} />
              Remaining
            </div>
            <div className="text-lg font-semibold font-mono">
              {formatTime(auction.timeRemaining)}
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative mb-4">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${dimensions.w} ${dimensions.h}`}
          className="w-full"
          style={{ height: dimensions.h }}
        >
          {/* Grid lines */}
          <defs>
            <linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.12" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Horizontal grid */}
          {[0, 0.25, 0.5, 0.75, 1].map((f) => {
            const y =
              20 +
              (dimensions.h - 50) * (1 - f)
            return (
              <line
                key={f}
                x1={40}
                y1={y}
                x2={dimensions.w - 20}
                y2={y}
                stroke="rgba(255,255,255,0.04)"
                strokeWidth={1}
              />
            )
          })}

          {/* Area fill */}
          <path d={`${pathD} L ${dimensions.w - 20},${dimensions.h - 30} L 40,${dimensions.h - 30} Z`} fill="url(#curveFill)" />

          {/* Decay curve */}
          <path
            d={pathD}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Starting price marker */}
          <line
            x1={startX}
            y1={startY - 8}
            x2={startX}
            y2={startY + 8}
            stroke="var(--text-muted)"
            strokeWidth={1.5}
          />
          <text x={startX} y={startY - 12} textAnchor="middle" fill="var(--text-muted)" fontSize={9}>
            Start
          </text>
          <text x={startX} y={startY + 22} textAnchor="middle" fill="var(--text-muted)" fontSize={8} fontFamily="monospace">
            {formatBidPrice(auction.startingPrice)}
          </text>

          {/* Reserve price marker */}
          <line
            x1={reserveX}
            y1={reserveY - 8}
            x2={reserveX}
            y2={reserveY + 8}
            stroke="var(--warning)"
            strokeWidth={1.5}
            strokeDasharray="3,2"
          />
          <text x={reserveX} y={reserveY - 12} textAnchor="end" fill="var(--warning)" fontSize={9}>
            Reserve
          </text>
          <text x={reserveX} y={reserveY + 22} textAnchor="end" fill="var(--warning)" fontSize={8} fontFamily="monospace">
            {formatBidPrice(auction.reservePrice)}
          </text>

          {/* Bid points */}
          {bidPoints.map((bid, i) => (
            <g key={i}>
              <circle cx={bid.x} cy={bid.y} r={4} fill="var(--accent)" stroke="#0A0A0F" strokeWidth={2} />
              <text
                x={bid.x}
                y={bid.y - 10}
                textAnchor="middle"
                fill="var(--text-secondary)"
                fontSize={8}
              >
                {bid.solver.split(' ')[0]}
              </text>
            </g>
          ))}

          {/* Current price animated dot */}
          <motion.circle
            cx={currentX}
            cy={currentY}
            r={6}
            fill="var(--accent)"
            stroke="#0A0A0F"
            strokeWidth={2.5}
            initial={false}
            animate={{ cx: currentX, cy: currentY }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
          <motion.circle
            cx={currentX}
            cy={currentY}
            r={14}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={1}
            opacity={0.3}
            initial={false}
            animate={{ cx: currentX, cy: currentY }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </svg>
      </div>

      {/* Bid History List */}
      <div>
        <h4 className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Users size={12} />
          Bid History ({bidHistory.length})
        </h4>
        {bidHistory.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">No bids yet</p>
        ) : (
          <div className="space-y-1.5 max-h-[180px] overflow-y-auto">
            {bidHistory.map((bid, i) => (
              <motion.div
                key={`${bid.solver}-${bid.timestamp}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between px-3 py-2 bg-[var(--bg-secondary)] rounded-[var(--radius-sm)] text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[var(--accent-dim)] flex items-center justify-center text-[10px] font-bold text-[var(--accent)]">
                    {bid.solver[0]}
                  </span>
                  <span className="font-medium">{bid.solver}</span>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[var(--accent)]">
                    {formatBidPrice(bid.amount)}
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)]">
                    {formatTime(bid.time)} remaining
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
