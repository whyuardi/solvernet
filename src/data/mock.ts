export interface Intent {
  id: string;
  fromChain: string;
  toChain: string;
  inputToken: string;
  outputToken: string;
  inputAmount: string;
  minOutputAmount: string;
  deadline: number;
  status: "open" | "bidding" | "executing" | "settled" | "failed";
  createdAt: number;
}

export interface Solver {
  id: string;
  name: string;
  avatar: string;
  bondedCapital: string;
  reputation: number;
  currentBid: string;
  gasEstimate: string;
  executionTime: string;
  successRate: number;
}

export interface Bid {
  solverId: string;
  price: string;
  timestamp: number;
  signature: string;
}

export interface AuctionState {
  intentId: string;
  currentPrice: string;
  startingPrice: string;
  reservePrice: string;
  decayRate: number;
  blockRemaining: number;
  bids: Bid[];
}

export interface Transaction {
  hash: string;
  intentId: string;
  solverId: string;
  type: "submitted" | "confirmed" | "settled" | "failed";
  chain: string;
  timestamp: number;
  gasUsed: string;
}

// ─── Sample Intents ───
const now = Math.floor(Date.now() / 1000);
const HOUR = 3600;
const DAY = 86400;

export const sampleIntents: Intent[] = [
  {
    id: "intent-001",
    fromChain: "Ethereum",
    toChain: "Arbitrum",
    inputToken: "USDC",
    outputToken: "USDC",
    inputAmount: "125000.00",
    minOutputAmount: "124750.00",
    deadline: now + HOUR * 4,
    status: "bidding",
    createdAt: now - HOUR * 2,
  },
  {
    id: "intent-002",
    fromChain: "Optimism",
    toChain: "Base",
    inputToken: "ETH",
    outputToken: "ETH",
    inputAmount: "42.50",
    minOutputAmount: "42.42",
    deadline: now + HOUR * 8,
    status: "open",
    createdAt: now - HOUR * 1,
  },
  {
    id: "intent-003",
    fromChain: "Polygon",
    toChain: "Ethereum",
    inputToken: "MATIC",
    outputToken: "ETH",
    inputAmount: "500000.00",
    minOutputAmount: "187.35",
    deadline: now + HOUR * 2,
    status: "bidding",
    createdAt: now - HOUR * 6,
  },
  {
    id: "intent-004",
    fromChain: "Arbitrum",
    toChain: "Optimism",
    inputToken: "ARB",
    outputToken: "OP",
    inputAmount: "85000.00",
    minOutputAmount: "82345.00",
    deadline: now + HOUR * 12,
    status: "open",
    createdAt: now - HOUR * 3,
  },
  {
    id: "intent-005",
    fromChain: "Base",
    toChain: "Ethereum",
    inputToken: "USDC",
    outputToken: "DAI",
    inputAmount: "250000.00",
    minOutputAmount: "249250.00",
    deadline: now + HOUR * 1,
    status: "executing",
    createdAt: now - HOUR * 5,
  },
  {
    id: "intent-006",
    fromChain: "BNB Chain",
    toChain: "Avalanche",
    inputToken: "BNB",
    outputToken: "AVAX",
    inputAmount: "1200.00",
    minOutputAmount: "18720.00",
    deadline: now - HOUR * 3,
    status: "settled",
    createdAt: now - DAY * 1,
  },
  {
    id: "intent-007",
    fromChain: "zkSync Era",
    toChain: "Scroll",
    inputToken: "ETH",
    outputToken: "ETH",
    inputAmount: "8.75",
    minOutputAmount: "8.72",
    deadline: now + HOUR * 6,
    status: "failed",
    createdAt: now - HOUR * 10,
  },
  {
    id: "intent-008",
    fromChain: "Linea",
    toChain: "Ethereum",
    inputToken: "USDC",
    outputToken: "ETH",
    inputAmount: "75000.00",
    minOutputAmount: "28.15",
    deadline: now + HOUR * 24,
    status: "open",
    createdAt: now - HOUR * 12,
  },
];

// ─── Sample Solvers ───
export const sampleSolvers: Solver[] = [
  {
    id: "solver-algo",
    name: "AlgoSolver",
    avatar: "AS",
    bondedCapital: "2500000",
    reputation: 98,
    currentBid: "0.00025",
    gasEstimate: "0.00018",
    executionTime: "45s",
    successRate: 99.2,
  },
  {
    id: "solver-prime",
    name: "Prime Relay",
    avatar: "PR",
    bondedCapital: "1800000",
    reputation: 96,
    currentBid: "0.00028",
    gasEstimate: "0.00020",
    executionTime: "52s",
    successRate: 98.7,
  },
  {
    id: "solver-quick",
    name: "QuickRoute",
    avatar: "QR",
    bondedCapital: "1200000",
    reputation: 92,
    currentBid: "0.00032",
    gasEstimate: "0.00022",
    executionTime: "38s",
    successRate: 97.5,
  },
  {
    id: "solver-stark",
    name: "StarkFlow",
    avatar: "SF",
    bondedCapital: "3100000",
    reputation: 99,
    currentBid: "0.00022",
    gasEstimate: "0.00015",
    executionTime: "41s",
    successRate: 99.8,
  },
  {
    id: "solver-nexus",
    name: "NexusBridge",
    avatar: "NB",
    bondedCapital: "950000",
    reputation: 88,
    currentBid: "0.00035",
    gasEstimate: "0.00025",
    executionTime: "58s",
    successRate: 95.1,
  },
  {
    id: "solver-apex",
    name: "ApexSolver",
    avatar: "AX",
    bondedCapital: "4200000",
    reputation: 97,
    currentBid: "0.00024",
    gasEstimate: "0.00017",
    executionTime: "43s",
    successRate: 98.9,
  },
  {
    id: "solver-orbital",
    name: "OrbitalX",
    avatar: "OX",
    bondedCapital: "1650000",
    reputation: 91,
    currentBid: "0.00030",
    gasEstimate: "0.00021",
    executionTime: "49s",
    successRate: 96.8,
  },
  {
    id: "solver-chainlink",
    name: "ChainPulse",
    avatar: "CP",
    bondedCapital: "780000",
    reputation: 85,
    currentBid: "0.00038",
    gasEstimate: "0.00028",
    executionTime: "62s",
    successRate: 93.4,
  },
  {
    id: "solver-echo",
    name: "EchoLayer",
    avatar: "EL",
    bondedCapital: "2000000",
    reputation: 94,
    currentBid: "0.00027",
    gasEstimate: "0.00019",
    executionTime: "47s",
    successRate: 97.9,
  },
  {
    id: "solver-zenith",
    name: "ZenithRoute",
    avatar: "ZR",
    bondedCapital: "3500000",
    reputation: 95,
    currentBid: "0.00026",
    gasEstimate: "0.00018",
    executionTime: "44s",
    successRate: 98.2,
  },
  {
    id: "solver-flux",
    name: "FluxCapital",
    avatar: "FC",
    bondedCapital: "1400000",
    reputation: 90,
    currentBid: "0.00033",
    gasEstimate: "0.00023",
    executionTime: "55s",
    successRate: 96.2,
  },
  {
    id: "solver-delta",
    name: "DeltaPrime",
    avatar: "DP",
    bondedCapital: "2800000",
    reputation: 93,
    currentBid: "0.00029",
    gasEstimate: "0.00020",
    executionTime: "50s",
    successRate: 97.1,
  },
];

// ─── Auction State (for intent-001) ───
export const sampleAuctionState: AuctionState = {
  intentId: "intent-001",
  currentPrice: "0.00025",
  startingPrice: "0.00050",
  reservePrice: "0.00020",
  decayRate: 0.5,
  blockRemaining: 187,
  bids: [
    {
      solverId: "solver-stark",
      price: "0.00022",
      timestamp: now - 300,
      signature: "0x7a8b...c3d4",
    },
    {
      solverId: "solver-algo",
      price: "0.00025",
      timestamp: now - 600,
      signature: "0x1e2f...9a0b",
    },
    {
      solverId: "solver-apex",
      price: "0.00024",
      timestamp: now - 900,
      signature: "0x5c6d...8e9f",
    },
    {
      solverId: "solver-zenith",
      price: "0.00026",
      timestamp: now - 1200,
      signature: "0x3a4b...7c8d",
    },
    {
      solverId: "solver-prime",
      price: "0.00028",
      timestamp: now - 1800,
      signature: "0x9e0f...1a2b",
    },
  ],
};

// ─── Recent Transactions ───
export const sampleTransactions: Transaction[] = [
  {
    hash: "0xabc123...def456",
    intentId: "intent-006",
    solverId: "solver-stark",
    type: "settled",
    chain: "Avalanche",
    timestamp: now - HOUR * 4,
    gasUsed: "0.00085",
  },
  {
    hash: "0xdef789...abc012",
    intentId: "intent-005",
    solverId: "solver-algo",
    type: "confirmed",
    chain: "Base",
    timestamp: now - HOUR * 2,
    gasUsed: "0.00062",
  },
  {
    hash: "0x345678...901234",
    intentId: "intent-003",
    solverId: "solver-apex",
    type: "submitted",
    chain: "Polygon",
    timestamp: now - HOUR * 1,
    gasUsed: "0.00071",
  },
  {
    hash: "0x901234...567890",
    intentId: "intent-007",
    solverId: "solver-nexus",
    type: "failed",
    chain: "Scroll",
    timestamp: now - HOUR * 5,
    gasUsed: "0.00054",
  },
  {
    hash: "0x567890...123456",
    intentId: "intent-001",
    solverId: "solver-prime",
    type: "submitted",
    chain: "Arbitrum",
    timestamp: now - 1800,
    gasUsed: "0.00048",
  },
];

// ─── Helper to get solver by ID ───
export function getSolverById(id: string): Solver | undefined {
  return sampleSolvers.find((s) => s.id === id);
}

// ─── Helper to get intent by ID ───
export function getIntentById(id: string): Intent | undefined {
  return sampleIntents.find((i) => i.id === id);
}

// ─── Filter helpers ───
export function getIntentsByStatus(status: Intent["status"]): Intent[] {
  return sampleIntents.filter((i) => i.status === status);
}

export function getActiveBids(intentId: string): Bid[] {
  if (sampleAuctionState.intentId === intentId) {
    return sampleAuctionState.bids.sort((a, b) => a.price.localeCompare(b.price));
  }
  return [];
}
