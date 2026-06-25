/* ─── Dutch Auction Engine ───
 * Runs in the browser — simulates price decay + auto-bidding solvers
 * ────────────────────────────────────────────────────── */

import { AuctionState, placeBid, settleAuction, getAuction } from './intent-store'

const SOLVER_NAMES = ['Cypher Capital', 'Albedo Labs', 'Delta Prime', 'Nexus Trade', 'Vertex Relay']

/* ─── Solver Behaviour ────────────────────────────────
 * Each solver has a "strategy" determining when they bid
 * real/aggressive/opportunistic/conservative */

interface SolverProfile {
  name: string
  aggression: number // 0-1, higher = bids sooner
  maxBidPct: number // % of starting price they'll accept
  bidFrequency: number // avg seconds between bids
  jitter: number // randomness in bid timing
}

const PROFILES: SolverProfile[] = [
  { name: 'Cypher Capital', aggression: 0.85, maxBidPct: 0.35, bidFrequency: 35, jitter: 15 },
  { name: 'Albedo Labs', aggression: 0.65, maxBidPct: 0.45, bidFrequency: 45, jitter: 20 },
  { name: 'Delta Prime', aggression: 0.55, maxBidPct: 0.55, bidFrequency: 50, jitter: 25 },
  { name: 'Nexus Trade', aggression: 0.40, maxBidPct: 0.60, bidFrequency: 60, jitter: 30 },
  { name: 'Vertex Relay', aggression: 0.25, maxBidPct: 0.70, bidFrequency: 70, jitter: 35 },
]

interface EngineInstance {
  intentId: string
  timerId: ReturnType<typeof setInterval> | null
  bidTimers: ReturnType<typeof setTimeout>[]
  startedAt: number
  decayRate: number // price drop per second
}

const engines: Record<string, EngineInstance> = {}

/* ─── Start auction engine for an intent ────────────── */

export function startAuctionEngine(intentId: string, auction: AuctionState) {
  if (engines[intentId]) return // already running

  const decayRate =
    (auction.startingPrice - auction.reservePrice) / auction.duration

  const engine: EngineInstance = {
    intentId,
    timerId: null,
    bidTimers: [],
    startedAt: Date.now(),
    decayRate,
  }

  // Price decay tick — runs every second
  engine.timerId = setInterval(() => {
    const current = getAuction(intentId)
    if (!current || current.settled || current.timeRemaining <= 0) {
      stopAuctionEngine(intentId)
      return
    }

    const elapsed = (Date.now() - engine.startedAt) / 1000
    const remaining = Math.max(0, auction.duration - elapsed)
    const price = Math.max(
      auction.reservePrice,
      auction.startingPrice - decayRate * elapsed,
    )

    // If price hit reserve and no winner → settle with highest bidder
    if (price <= auction.reservePrice && remaining > 0) {
      const bestBid = current.bids.reduce(
        (best, b) => (b.amount < best.amount ? b : best),
        current.bids[0],
      )
      if (bestBid) {
        settleAuction(intentId, bestBid.solver, bestBid.amount)
      }
      stopAuctionEngine(intentId)
      return
    }

    // If time expired → settle with best bid or expired
    if (remaining <= 0) {
      if (current.bids.length > 0) {
        const best = current.bids.reduce((a, b) => (a.amount < b.amount ? a : b))
        settleAuction(intentId, best.solver, best.amount)
      }
      stopAuctionEngine(intentId)
      return
    }
  }, 1000)

  // Schedule solver bots
  PROFILES.forEach((profile) => {
    scheduleBid(engine, auction, profile)
  })

  engines[intentId] = engine
}

function scheduleBid(
  engine: EngineInstance,
  auction: AuctionState,
  profile: SolverProfile,
) {
  const delay =
    (profile.bidFrequency + Math.random() * profile.jitter) * 1000

  const timer = setTimeout(() => {
    // Check if still running
    const current = getAuction(engine.intentId)
    if (!current || current.settled || current.timeRemaining <= 0) return

    // Check if already has a better bid
    const myBids = current.bids.filter((b) => b.solver === profile.name)
    const myBest = myBids.reduce((best, b) => (b.amount < best.amount ? b : best), {
      amount: Infinity,
    } as any)

    const elapsed = (Date.now() - engine.startedAt) / 1000
    const remaining = Math.max(0, auction.duration - elapsed)
    const currentMarketPrice = Math.max(
      auction.reservePrice,
      auction.startingPrice - engine.decayRate * elapsed,
    )

    // Determine bid price — slightly below market + profile aggression
    const discount = 0.85 + Math.random() * 0.1 * (1 - profile.aggression)
    const bidPrice = currentMarketPrice * discount

    // Only bid if price is within solver's max acceptable range
    const maxAcceptable = auction.startingPrice * profile.maxBidPct
    if (bidPrice > maxAcceptable) {
      // Too expensive — try again later
      scheduleBid(engine, auction, profile)
      return
    }

    // Don't bid if we already have a better bid
    if (myBest.amount <= bidPrice) {
      scheduleBid(engine, auction, profile)
      return
    }

    // Place the bid
    placeBid(engine.intentId, profile.name, bidPrice, remaining)

    // Schedule next bid
    scheduleBid(engine, auction, profile)
  }, delay)

  engine.bidTimers.push(timer)
}

export function stopAuctionEngine(intentId: string) {
  const engine = engines[intentId]
  if (!engine) return

  if (engine.timerId) clearInterval(engine.timerId)
  engine.bidTimers.forEach(clearTimeout)
  delete engines[intentId]
}
