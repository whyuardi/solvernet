import IntentForm from '@/components/IntentForm'
import { Gavel, Network, Shield, Globe, Lock, Zap, ArrowRight } from 'lucide-react'
import ClientLanding from './client-landing'
import ClientHero from './client-hero'

const FEATURES = [
  {
    icon: Gavel,
    title: 'Dutch Auction Engine',
    desc: 'Every intent triggers a Dutch auction. Price decays until a solver claims it, ensuring best execution.',
  },
  {
    icon: Network,
    title: 'Solver Marketplace',
    desc: 'Competitive marketplace of specialized solvers bidding in real-time, driving prices down.',
  },
  {
    icon: Shield,
    title: 'ZK-Settled',
    desc: 'Zero-knowledge proofs verify every settlement. Trustless cross-chain execution.',
  },
  {
    icon: Globe,
    title: 'Cross-Chain Native',
    desc: 'Native bridging across 15+ chains. Post on one, settle on another.',
  },
  {
    icon: Lock,
    title: 'MEV Protected',
    desc: 'Dutch auction design neutralizes MEV. No frontrunning, no sandwich attacks.',
  },
  {
    icon: Zap,
    title: 'Gas Abstraction',
    desc: 'Pay fees in any token. Solvers cover gas across chains.',
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
  },
  {
    step: '02',
    title: 'Solvers Compete',
    desc: 'A Dutch auction starts. Solvers bid progressively lower prices until one claims your intent.',
  },
  {
    step: '03',
    title: 'Best Price Settled',
    desc: 'The winning solver executes your intent. You get the best price, verified on-chain.',
  },
]

export default function Home() {
  return (
    <main className="flex-1">
      {/* Noise texture overlay */}
      <div className="noise-overlay" />

      {/* ─── Hero — Left-aligned editorial ─── */}
      <section className="relative min-h-[100dvh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ClientHero />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)] via-[var(--bg-primary)]/80 to-transparent z-[1]" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left — massive type */}
            <div className="lg:col-span-7 pt-20">
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                <span className="tag">Mainnet Beta Live</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-bold leading-[0.95] tracking-[-0.03em] mb-6">
                Intent Settlement
                <br />
                Layer for{' '}
                <span className="text-[var(--accent)]">Cross-Chain</span>
              </h1>

              <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-md leading-relaxed mb-8">
                Post your intent. Solvers compete. You get the best price.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <a href="#intent" className="btn-primary px-6 py-3 text-sm inline-flex items-center gap-2">
                  Launch App
                  <ArrowRight size={14} />
                </a>
                <a href="#how-it-works" className="btn-ghost px-6 py-3 text-sm">
                  How It Works
                </a>
              </div>
            </div>

            {/* Right — 3D visual (hidden on mobile) */}
            <div className="lg:col-span-5 hidden lg:block" />
          </div>
        </div>

        {/* Stats — bottom strip */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <ClientLanding stats={STATS} />
        </div>
      </section>

      {/* ─── Features — Asymmetric Bento Grid ─── */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section header — left-aligned */}
          <div className="mb-14 max-w-2xl">
            <span className="tag block mb-3">Protocol</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.02em] mb-3">
              Built for Intent-Centric Trading
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Every component is designed to give you the best execution across chains.
            </p>
          </div>

          {/* Bento grid — 12-col asymmetric */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
            {/* Dutch Auction — large 8 cols */}
            <div className="lg:col-span-8 card card-accent p-6 sm:p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-[var(--accent-dim)] flex items-center justify-center mb-4">
                  <Gavel size={20} className="text-[var(--accent)]" />
                </div>
                <h3 className="text-xl font-bold mb-2">{FEATURES[0].title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-lg">
                  {FEATURES[0].desc}
                </p>
              </div>
            </div>

            {/* Solver Marketplace — tall 4 cols, 2 rows */}
            <div className="lg:col-span-4 lg:row-span-2 card p-6 flex flex-col">
              <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center mb-3">
                <Network size={16} className="text-[var(--text-secondary)]" />
              </div>
              <h3 className="text-base font-bold mb-1.5">{FEATURES[1].title}</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed flex-1">{FEATURES[1].desc}</p>
            </div>

            {/* ZK-Settled — 4 cols */}
            <div className="lg:col-span-4 card p-5">
              <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center mb-3">
                <Shield size={16} className="text-[var(--text-secondary)]" />
              </div>
              <h3 className="text-sm font-bold mb-1">{FEATURES[2].title}</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{FEATURES[2].desc}</p>
            </div>

            {/* Cross-Chain — 7 cols */}
            <div className="lg:col-span-7 card p-5">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center shrink-0">
                  <Globe size={16} className="text-[var(--text-secondary)]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold mb-1">{FEATURES[3].title}</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{FEATURES[3].desc}</p>
                </div>
              </div>
            </div>

            {/* MEV Protected — 5 cols */}
            <div className="lg:col-span-5 card p-5">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center shrink-0">
                  <Lock size={16} className="text-[var(--text-secondary)]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold mb-1">{FEATURES[4].title}</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{FEATURES[4].desc}</p>
                </div>
              </div>
            </div>

            {/* Gas Abstraction — full width accent */}
            <div className="sm:col-span-2 lg:col-span-12 card card-accent p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--accent)]/[0.03] rounded-full blur-3xl" />
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--accent-dim)] flex items-center justify-center shrink-0">
                  <Zap size={16} className="text-[var(--accent)]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold mb-0.5">{FEATURES[5].title}</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{FEATURES[5].desc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works — Editorial Numbering ─── */}
      <section id="how-it-works" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          {/* Section header — left-aligned */}
          <div className="mb-14 max-w-2xl">
            <span className="tag block mb-3">Mechanism</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.02em] mb-3">
              How It Works
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Three simple steps from intent to settlement.
            </p>
          </div>

          {/* Steps — large numbers, editorial layout */}
          <div className="space-y-0">
            {HOW_IT_WORKS.map((step, i) => (
              <div
                key={step.step}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-8 border-t border-[var(--border)] items-start"
              >
                {/* Step number — huge monospace */}
                <div className={`md:col-span-2 ${i % 2 !== 0 ? 'md:order-last md:text-right' : ''}`}>
                  <span className="text-5xl sm:text-6xl font-bold text-[var(--accent)] opacity-20 font-[var(--font-mono)] leading-none">
                    {step.step}
                  </span>
                </div>

                {/* Title */}
                <div className={`md:col-span-3 ${i % 2 !== 0 ? 'md:order-3' : ''}`}>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                    {step.title}
                  </h3>
                </div>

                {/* Description */}
                <div className={`md:col-span-7 ${i % 2 !== 0 ? 'md:order-2' : ''}`}>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-lg">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Intent Form Section ─── */}
      <section id="intent" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left — heading + info */}
            <div className="lg:col-span-4 lg:sticky lg:top-24">
              <span className="tag block mb-3">Interface</span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.02em] mb-3">
                Create an Intent
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-8">
                Define your cross-chain intent and let solvers compete for it.
              </p>

              {/* Side info */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-1 h-1 rounded-full bg-[var(--accent)] mt-2 shrink-0" />
                  <div>
                    <p className="text-sm font-medium mb-0.5">Zero bridge required</p>
                    <p className="text-xs text-[var(--text-secondary)]">Post intents without pre-funding. Solvers handle bridging.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1 h-1 rounded-full bg-[var(--accent)] mt-2 shrink-0" />
                  <div>
                    <p className="text-sm font-medium mb-0.5">MEV-resistant by design</p>
                    <p className="text-xs text-[var(--text-secondary)]">Dutch auction mechanics eliminate frontrunning.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1 h-1 rounded-full bg-[var(--accent)] mt-2 shrink-0" />
                  <div>
                    <p className="text-sm font-medium mb-0.5">Best execution guaranteed</p>
                    <p className="text-xs text-[var(--text-secondary)]">Competitive solver bids drive optimal pricing.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — form */}
            <div className="lg:col-span-8">
              <IntentForm />
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA — Minimal, editorial ─── */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-4">
            Ready to Settle Across Chains?
          </h2>
          <p className="text-[var(--text-secondary)] max-w-md mx-auto mb-8 leading-relaxed">
            Post your first intent and let solvers compete for your trade.
          </p>
          <a href="#intent" className="btn-primary px-8 py-3.5 text-sm inline-flex items-center gap-2">
            Get Started
            <ArrowRight size={14} />
          </a>
        </div>
      </section>
    </main>
  )
}
