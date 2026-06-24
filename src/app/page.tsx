import IntentForm from '@/components/IntentForm'
import { ArrowDown, Gavel, Network, Shield, Globe, Lock, Zap } from 'lucide-react'
import ClientLanding from './client-landing'
import ClientHero from './client-hero'

const FEATURES = [
  {
    icon: Gavel,
    title: 'Dutch Auction Engine',
    desc: 'Every intent triggers a Dutch auction. Price decays until a solver claims it, ensuring you always get the best execution.',
    accent: true,
  },
  {
    icon: Network,
    title: 'Solver Marketplace',
    desc: 'A competitive marketplace of specialized solvers bid for your intents in real-time, driving prices down.',
    accent: false,
  },
  {
    icon: Shield,
    title: 'ZK-Settled',
    desc: 'Zero-knowledge proofs verify every settlement. Trustless cross-chain execution with verifiable correctness.',
    accent: false,
  },
  {
    icon: Globe,
    title: 'Cross-Chain Native',
    desc: 'Native bridging across 15+ chains. Post on one chain, settle on another — unified liquidity.',
    accent: false,
  },
  {
    icon: Lock,
    title: 'MEV Protected',
    desc: 'Dutch auction design neutralizes MEV. No frontrunning, no sandwich attacks, no toxic flow.',
    accent: false,
  },
  {
    icon: Zap,
    title: 'Gas Abstraction',
    desc: 'Pay fees in any token. Solvers cover gas costs across chains. No need to hold native gas tokens.',
    accent: false,
  },
]

const STATS = {
  totalValueSettled: 142_000_000,
  activeSolvers: 47,
  chainsSupported: 15,
}

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Post Your Intent',
    desc: 'Specify what you want to trade, where, and your parameters. No need to bridge funds upfront.',
    accent: true,
  },
  {
    step: '02',
    title: 'Solvers Compete',
    desc: 'A Dutch auction starts. Solvers bid progressively lower prices until one claims your intent.',
    accent: false,
  },
  {
    step: '03',
    title: 'Best Price Settled',
    desc: 'The winning solver executes your intent. You get the best price, verified on-chain.',
    accent: false,
  },
]

export default function Home() {
  return (
    <main className="flex-1">
      {/* ─── Hero ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ClientHero />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg-primary)]/60 to-[var(--bg-primary)] z-[1]" />

        {/* Centered content */}
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto pt-20 pb-48 sm:pb-44">
          <div className="mb-4 inline-flex items-center gap-1.5 glass-card px-3 py-1.5 text-xs text-[var(--accent)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
            Mainnet Beta Live
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight mb-4">
            Intent Settlement
            <br />
            Layer for{' '}
            <span className="text-[var(--accent)]">Cross-Chain</span>
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-xl mx-auto mb-8 leading-relaxed">
            Post your intent. Solvers compete. You get the best price.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a href="#intent" className="btn-primary px-6 py-3 text-sm">
              Launch App
            </a>
            <a
              href="#how-it-works"
              className="px-6 py-3 text-sm font-medium border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-colors"
            >
              How It Works
            </a>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-36 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[var(--text-muted)]">
            <span className="text-[10px] uppercase tracking-widest">Scroll</span>
            <ArrowDown size={14} className="animate-bounce" />
          </div>
        </div>

        {/* Stats — pinned at bottom, never overlaps heading */}
        <div className="absolute bottom-0 left-0 right-0 z-10 pb-8 sm:pb-10">
          <ClientLanding stats={STATS} />
        </div>
      </section>

      {/* ─── Stats Counters (mobile fallback, animated in client-landing) ─── */}

      {/* ─── Features Grid ─── */}
      <section className="py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Built for Intent-Centric Trading
            </h2>
            <p className="text-[var(--text-secondary)] max-w-lg mx-auto">
              Every component is designed to give you the best execution across chains.
            </p>
          </div>

          {/* Asymmetric bento grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto">
            {/* Feature 1 — tall + wide */}
            <div className="sm:col-span-2 sm:row-span-2 glass-card p-6 sm:p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--accent)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-[var(--accent-dim)] flex items-center justify-center mb-4">
                  <Gavel size={20} className="text-[var(--accent)]" />
                </div>
                <h3 className="text-xl font-bold mb-2">{FEATURES[0].title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-md">
                  {FEATURES[0].desc}
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="glass-card p-5 group">
              <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] flex items-center justify-center mb-3">
                <Network size={16} className="text-[var(--text-secondary)]" />
              </div>
              <h3 className="text-sm font-semibold mb-1.5">{FEATURES[1].title}</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{FEATURES[1].desc}</p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card p-5 group">
              <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] flex items-center justify-center mb-3">
                <Shield size={16} className="text-[var(--text-secondary)]" />
              </div>
              <h3 className="text-sm font-semibold mb-1.5">{FEATURES[2].title}</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{FEATURES[2].desc}</p>
            </div>

            {/* Feature 4 */}
            <div className="glass-card p-5 group">
              <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] flex items-center justify-center mb-3">
                <Globe size={16} className="text-[var(--text-secondary)]" />
              </div>
              <h3 className="text-sm font-semibold mb-1.5">{FEATURES[3].title}</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{FEATURES[3].desc}</p>
            </div>

            {/* Feature 5 */}
            <div className="glass-card p-5 group">
              <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] flex items-center justify-center mb-3">
                <Lock size={16} className="text-[var(--text-secondary)]" />
              </div>
              <h3 className="text-sm font-semibold mb-1.5">{FEATURES[4].title}</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{FEATURES[4].desc}</p>
            </div>

            {/* Feature 6 — wide */}
            <div className="sm:col-span-2 glass-card p-5 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/3 rounded-full blur-3xl" />
              <div className="relative z-10 flex items-start gap-4">
                <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--accent-dim)] flex items-center justify-center shrink-0">
                  <Zap size={16} className="text-[var(--accent)]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-1">{FEATURES[5].title}</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{FEATURES[5].desc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="py-20 sm:py-28 px-4 sm:px-6 bg-[var(--bg-secondary)]/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">How It Works</h2>
            <p className="text-[var(--text-secondary)] max-w-lg mx-auto">
              Three simple steps from intent to settlement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            {/* Step 1 — large */}
            <div className="md:col-span-2 glass-card p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--accent)]/5 rounded-full blur-3xl" />
              <div className="relative z-10">
                <span className="text-3xl font-bold text-[var(--accent)] opacity-30">{HOW_IT_WORKS[0].step}</span>
                <h3 className="text-xl font-bold mt-2 mb-2">{HOW_IT_WORKS[0].title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-md">
                  {HOW_IT_WORKS[0].desc}
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="glass-card p-5">
              <span className="text-2xl font-bold text-[var(--accent)] opacity-30">{HOW_IT_WORKS[1].step}</span>
              <h3 className="text-base font-bold mt-2 mb-1.5">{HOW_IT_WORKS[1].title}</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {HOW_IT_WORKS[1].desc}
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-card p-5">
              <span className="text-2xl font-bold text-[var(--accent)] opacity-30">{HOW_IT_WORKS[2].step}</span>
              <h3 className="text-base font-bold mt-2 mb-1.5">{HOW_IT_WORKS[2].title}</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {HOW_IT_WORKS[2].desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Intent Form Section ─── */}
      <section id="intent" className="py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Create an Intent</h2>
            <p className="text-[var(--text-secondary)] max-w-md mx-auto">
              Define your cross-chain intent and let solvers compete for it
            </p>
          </div>
          <IntentForm />
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-transparent" />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                Ready to Settle Across Chains?
              </h2>
              <p className="text-[var(--text-secondary)] max-w-md mx-auto mb-6">
                Join the intent-centric future. Post your first intent and let solvers
                compete for your trade.
              </p>
              <a href="#intent" className="btn-primary px-8 py-3 text-sm inline-block">
                Get Started
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
