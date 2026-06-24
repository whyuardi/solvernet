# SolverNet ⚡

**Decentralized Intent Settlement & Cross-Chain Execution Layer**

Post your cross-chain intent. Solvers compete via Dutch auction. You get the best execution — verified on-chain.

> **Live Demo:** [https://solvernet.vercel.app](https://solvernet.vercel.app)

---

## Overview

SolverNet is a full-stack intent-centric settlement protocol that reimagines cross-chain trading. Instead of manually hunting for the best route across bridges and DEXs, users post a single **intent** — "swap 125k USDC on Ethereum for USDC on Arbitrum" — and a competitive marketplace of **solvers** bids for the right to execute it via a **Dutch auction**.

### Key Concepts

| Concept | Description |
|---------|-------------|
| **Intent** | A user-defined cross-chain operation (swap, bridge, or trade) with parameters like input/output tokens, amount, slippage, and deadline |
| **Solver** | Specialized execution agents that compete to fulfill intents. They bond capital, bid on gas efficiency, and get slashed for failure |
| **Dutch Auction** | Price starts high and decays over time. Solvers bid progressively lower until one claims the intent — ensuring users get the best price |
| **ZK-Settlement** | Zero-knowledge proofs verify every settlement, enabling trustless cross-chain execution without intermediaries |

---

## Features

### 🏠 Landing Page
- **3D Network Visualization** — Interactive Three.js particle network with Fibonacci-sphere distribution, dynamic edges, and node glow
- **Feature Bento Grid** — Dutch Auction Engine, Solver Marketplace, ZK-Settled, Cross-Chain Native, MEV Protection, Gas Abstraction — each in asymmetric glass cards
- **Intent Form** — Full cross-chain intent builder with token selectors, amount input, slippage slider, deadline presets
- **Live Stats** — Animated counters for Total Value Settled, Active Solvers, Supported Chains

### 📊 Dashboard
- **Solver Leaderboard** — Ranked by reputation, bonded capital, success rate, execution time
- **Live Activity Feed** — Real-time transaction log with solver, chain, value, status
- **Auction Monitor** — Dutch auction price decay chart with bid history per intent
- **Cross-Chain Route Map** — 3D Three.js globe with wireframe Earth, arcs between chains, animated particles

### 🔨 Auction Page
- **Dutch Auction Visualizer** — SVG price decay curve with starting/reserve price, current bid overlay, block countdown
- **Bid Table** — All bids with solver, price, timestamp, signature
- **Intent Details** — Full intent breakdown with status timeline, chain path, solver assignments

### 🛠 Technical
- **Next.js 16** — App Router, Turbopack, React Server Components
- **Three.js / @react-three/fiber** — 3D visualizations (Hero network, Route Map globe)
- **Framer Motion** — Scroll-triggered animations, layout transitions,AnimatedCounter
- **Geist Font** — Vercel's premium typeface
- **Dark Theme** — CSS custom properties, glassmorphism cards, glow accents, noise texture

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript (strict) |
| **Styling** | Tailwind CSS v4 + CSS custom properties |
| **3D** | Three.js, @react-three/fiber, @react-three/drei |
| **Animation** | Framer Motion |
| **Icons** | Lucide React |
| **Font** | Geist (via next/font) |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with Navbar + Footer
│   ├── page.tsx            # Landing page — Hero, Features, How It Works, Intent Form
│   ├── globals.css         # Design tokens, glassmorphism, utilities
│   ├── client-hero.tsx     # Dynamic import wrapper for Hero3D
│   ├── client-landing.tsx  # Animated stats counters
│   ├── dashboard/
│   │   └── page.tsx        # Dashboard — leaderboard, activity, route map
│   └── auction/
│       └── page.tsx        # Auction visualizer — Dutch auction chart, bids
├── components/
│   ├── Navbar.tsx          # Sticky nav (Explore, Dashboard, Auction, Wallet)
│   ├── Footer.tsx          # Footer with brand + links columns
│   ├── Hero3D.tsx          # Three.js 3D particle network
│   ├── RouteMap3D.tsx      # Three.js globe with cross-chain arcs
│   ├── IntentForm.tsx      # Cross-chain intent builder form
│   ├── AuctionVisualizer.tsx # Dutch auction price decay chart
│   └── SolverGrid.tsx      # Solver cards with bids
├── data/
│   └── mock.ts             # Mock data — intents, solvers, bids, transactions
└── lib/
    ├── utils.ts            # Utilities — formatAddress, timeAgo, formatAmount, cn()
    └── chains.ts           # Chain definitions (10 chains with RPCs, explorers)
```

---

## Getting Started

```bash
# Clone
git clone https://github.com/whyuardi/solvernet.git
cd solvernet

# Install
npm install

# Dev
npm run dev

# Build
npm run build

# Start production
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Architecture

### Intent Flow

```
User posts intent ──▶ Intent Pool ──▶ Dutch Auction starts
                                        │
                              Solvers bid decreasing prices
                                        │
                              Winning solver selected
                                        │
                              Solver executes cross-chain
                                        │
                              ZK proof verified on-chain
                                        │
                              User receives best price
```

### Smart Contract Architecture (WIP)

| Contract | Purpose |
|----------|---------|
| **IntentRouter** | Entry point for posting intents, routes to auction |
| **DutchAuction** | Implements Dutch auction logic — price decay, bid collection, settlement |
| **SolverRegistry** | On-chain registry for solver identities, bonded capital, reputation |
| **SettlementVerifier** | ZK proof verification for cross-chain execution |

> Smart contracts are currently in design/planning phase. The frontend demonstrates the full interface with mock data.

---

## License

MIT

---

## Author

**Ardhiansyah Wahyu Setyadi** — [@whyuardi](https://github.com/whyuardi)
