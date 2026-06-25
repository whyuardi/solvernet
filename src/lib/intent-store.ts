/* ─── SolverNet Intent & Auction Store ───
 * localStorage-backed state management
 * Every write triggers a custom event so components stay in sync
 * ──────────────────────────────────────────────────────── */

export const STORE_EVENT = 'sn-store-update'

/* ─── Types ─────────────────────────────────────────── */

export type ChainId = 'ethereum' | 'arbitrum' | 'optimism' | 'base' | 'polygon'
export type TokenSymbol = 'ETH' | 'USDC' | 'WBTC' | 'ARB' | 'OP'
export type IntentStatus = 'pending' | 'auction' | 'filled' | 'expired'

export interface Intent {
  id: string
  fromChain: ChainId
  toChain: ChainId
  inputToken: TokenSymbol
  outputToken: TokenSymbol
  amount: number
  slippage: number
  deadline: number // minutes
  status: IntentStatus
  createdAt: number // timestamp
  fillPrice?: number
  solver?: string
  fillTime?: number // ms
}

export interface AuctionBid {
  solver: string
  amount: number // ETH
  time: number // seconds remaining when bid
  timestamp: number
}

export interface AuctionState {
  intentId: string
  startingPrice: number
  reservePrice: number
  currentPrice: number
  duration: number // seconds
  timeRemaining: number
  startTime: number
  bids: AuctionBid[]
  settled: boolean
  winningSolver?: string
  winningPrice?: number
}

export interface SolverStats {
  name: string
  wins: number
  totalBids: number
  avgBidPrice: number
  volume: number // total USD volume
  winRate: number // 0-100
}

export interface ActivityEntry {
  id: string
  type: 'intent_posted' | 'bid_placed' | 'auction_won' | 'intent_filled' | 'intent_expired'
  intentId: string
  solver?: string
  amount?: number
  token?: string
  price?: number
  timestamp: number
  chain?: string
}

/* ─── Store shape ───────────────────────────────────── */

interface Store {
  intents: Intent[]
  auctions: Record<string, AuctionState>
  solvers: Record<string, SolverStats>
  activity: ActivityEntry[]
  nextIntentNum: number
}

const DEFAULT_SOLVERS: Record<string, SolverStats> = {
  'Cypher Capital': { name: 'Cypher Capital', wins: 1247, totalBids: 2480, avgBidPrice: 0.0019, volume: 28400000, winRate: 50.3 },
  'Albedo Labs': { name: 'Albedo Labs', wins: 982, totalBids: 2100, avgBidPrice: 0.0025, volume: 19700000, winRate: 46.8 },
  'Delta Prime': { name: 'Delta Prime', wins: 756, totalBids: 1680, avgBidPrice: 0.0028, volume: 15200000, winRate: 45.0 },
  'Nexus Trade': { name: 'Nexus Trade', wins: 523, totalBids: 1240, avgBidPrice: 0.0031, volume: 11800000, winRate: 42.2 },
  'Vertex Relay': { name: 'Vertex Relay', wins: 312, totalBids: 890, avgBidPrice: 0.0042, volume: 7300000, winRate: 35.1 },
}

function defaultStore(): Store {
  return {
    intents: [],
    auctions: {},
    solvers: { ...DEFAULT_SOLVERS },
    activity: [],
    nextIntentNum: 1,
  }
}

/* ─── Helpers ───────────────────────────────────────── */

function uid(): string {
  return `sn-0x${Math.random().toString(16).slice(2, 10)}`
}

function notify() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(STORE_EVENT))
  }
}

/* ─── CRUD ──────────────────────────────────────────── */

function load(): Store {
  if (typeof window === 'undefined') return defaultStore()
  try {
    const raw = localStorage.getItem('sn-store')
    if (!raw) return defaultStore()
    return JSON.parse(raw) as Store
  } catch {
    return defaultStore()
  }
}

function save(store: Store) {
  localStorage.setItem('sn-store', JSON.stringify(store))
}

/* ─── Public API ────────────────────────────────────── */

export function getIntents(): Intent[] {
  return load().intents.sort((a, b) => b.createdAt - a.createdAt)
}

export function getIntent(id: string): Intent | undefined {
  return load().intents.find((i) => i.id === id)
}

export function createIntent(data: Omit<Intent, 'id' | 'status' | 'createdAt'>): Intent {
  const store = load()
  const intent: Intent = {
    ...data,
    id: uid(),
    status: 'pending',
    createdAt: Date.now(),
  }
  store.intents.unshift(intent)
  store.activity.unshift({
    id: uid(),
    type: 'intent_posted',
    intentId: intent.id,
    amount: intent.amount,
    token: intent.inputToken,
    timestamp: Date.now(),
    chain: `${intent.fromChain} → ${intent.toChain}`,
  })
  save(store)
  notify()
  return intent
}

export function updateIntentStatus(
  id: string,
  status: IntentStatus,
  fillData?: { fillPrice: number; solver: string; fillTime: number },
) {
  const store = load()
  const idx = store.intents.findIndex((i) => i.id === id)
  if (idx === -1) return
  store.intents[idx] = { ...store.intents[idx], status, ...fillData }
  save(store)
  notify()
}

/* ─── Auction ───────────────────────────────────────── */

export function getAuction(intentId: string): AuctionState | undefined {
  return load().auctions[intentId]
}

export function startAuction(intent: Intent): AuctionState {
  const store = load()
  const auction: AuctionState = {
    intentId: intent.id,
    startingPrice: 0.01,
    reservePrice: 0.0005,
    currentPrice: 0.01,
    duration: 300, // 5 min
    timeRemaining: 300,
    startTime: Date.now(),
    bids: [],
    settled: false,
  }
  store.auctions[intent.id] = auction
  save(store)
  notify()
  return auction
}

export function placeBid(intentId: string, solver: string, amount: number, timeRemaining: number) {
  const store = load()
  const auction = store.auctions[intentId]
  if (!auction || auction.settled) return

  const bid: AuctionBid = {
    solver,
    amount,
    time: timeRemaining,
    timestamp: Date.now(),
  }
  auction.bids.push(bid)
  auction.currentPrice = amount

  // Update solver stats
  if (!store.solvers[solver]) {
    store.solvers[solver] = {
      name: solver,
      wins: 0,
      totalBids: 0,
      avgBidPrice: 0,
      volume: 0,
      winRate: 0,
    }
  }
  const s = store.solvers[solver]
  s.totalBids++
  s.avgBidPrice = (s.avgBidPrice * (s.totalBids - 1) + amount) / s.totalBids

  store.activity.unshift({
    id: uid(),
    type: 'bid_placed',
    intentId,
    solver,
    price: amount,
    timestamp: Date.now(),
  })

  save(store)
  notify()
}

export function settleAuction(intentId: string, winner: string, price: number) {
  const store = load()
  const auction = store.auctions[intentId]
  if (!auction || auction.settled) return

  auction.settled = true
  auction.winningSolver = winner
  auction.winningPrice = price

  // Update intent
  const intent = store.intents.find((i) => i.id === intentId)
  if (intent) {
    intent.status = 'filled'
    intent.fillPrice = price
    intent.solver = winner
    intent.fillTime = Date.now() - intent.createdAt
  }

  // Update solver stats
  const s = store.solvers[winner]
  if (s) {
    s.wins++
    s.winRate = (s.wins / s.totalBids) * 100
    if (intent) s.volume += intent.amount * 3500 // rough USD estimate
  }

  store.activity.unshift({
    id: uid(),
    type: 'auction_won',
    intentId,
    solver: winner,
    price,
    timestamp: Date.now(),
    amount: intent?.amount,
    token: intent?.inputToken,
  })

  save(store)
  notify()
}

export function getActivity(limit = 20): ActivityEntry[] {
  return load().activity.slice(0, limit)
}

export function getSolvers(): SolverStats[] {
  return Object.values(load().solvers).sort((a, b) => b.wins - a.wins)
}

export function getStats() {
  const store = load()
  const activeIntents = store.intents.filter((i) => i.status === 'auction' || i.status === 'pending').length
  const totalVolume = store.intents
    .filter((i) => i.status === 'filled')
    .reduce((sum, i) => sum + i.amount * 3500, 0)
  const avgFillTime = store.intents
    .filter((i) => i.fillTime)
    .reduce((sum, i) => sum + (i.fillTime || 0), 0) / Math.max(1, store.intents.filter((i) => i.fillTime).length)
  return {
    activeIntents,
    totalIntents: store.intents.length,
    totalVolume,
    avgFillTime,
    solverCount: Object.keys(store.solvers).length,
  }
}

/* ─── Hook helper ───────────────────────────────────── */

export function subscribe(cb: () => void): () => void {
  window.addEventListener(STORE_EVENT, cb)
  return () => window.removeEventListener(STORE_EVENT, cb)
}
