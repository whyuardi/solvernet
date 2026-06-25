import IntentForm from '@/components/IntentForm'
import ClientLanding from './client-landing'
import ClientHero from './client-hero'

const FEATURES = [
  {
    tag: 'Auction',
    title: 'Dutch Auction Engine',
    desc: 'Every intent triggers a Dutch auction. Price decays until a solver claims it, ensuring best execution.',
  },
  {
    tag: 'Marketplace',
    title: 'Solver Marketplace',
    desc: 'Competitive marketplace of specialized solvers bidding in real-time, driving prices down.',
  },
  {
    tag: 'ZK',
    title: 'ZK-Settled',
    desc: 'Zero-knowledge proofs verify every settlement. Trustless cross-chain execution.',
  },
  {
    tag: 'Chains',
    title: 'Cross-Chain Native',
    desc: 'Native bridging across 15+ chains. Post on one, settle on another.',
  },
  {
    tag: 'MEV',
    title: 'MEV Protected',
    desc: 'Dutch auction design neutralizes MEV. No frontrunning, no sandwich attacks.',
  },
  {
    tag: 'Gas',
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
                  <span className="text-xs">→</span>
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
      </section>

      {/* ─── Stats Strip ─── */}
      <section className="border-y border-[var(--border)] bg-[var(--bg-secondary)]/30">
        <div className="max-w-7xl mx-auto">
          <ClientLanding
            totalValueSettled={STATS.totalValueSettled}
            activeSolvers={STATS.activeSolvers}
            chainsSupported={STATS.chainsSupported}
          />
        </div>
      </section>

      {/* ─── Features — Bento Grid ─── */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 max-w-2xl">
            <span className="tag block mb-3">Features</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.02em] mb-3">
              Built for Execution
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Every component is designed for one thing: getting you the best price on cross-chain swaps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
            {/* Dutch Auction Engine — 8 cols */}
            <div className="lg:col-span-8 card p-6">
              <div className="inline-flex items-center gap-1.5 mb-3 px-2 py-0.5 rounded-full bg-[var(--accent-dim)] text-[var(--accent)] text-[10px] font-medium uppercase tracking-wider">
                {FEATURES[0].tag}
              </div>
              <h3 className="text-xl font-bold mb-2">{FEATURES[0].title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-lg">
                {FEATURES[0].desc}
              </p>
            </div>

            {/* Solver Marketplace — tall 4 cols, 2 rows */}
            <div className="lg:col-span-4 lg:row-span-2 card p-6 flex flex-col">
              <div className="inline-flex items-center gap-1.5 mb-3 px-2 py-0.5 rounded-full bg-[var(--accent-dim)] text-[var(--accent)] text-[10px] font-medium uppercase tracking-wider">
                {FEATURES[1].tag}
              </div>
              <h3 className="text-base font-bold mb-1.5">{FEATURES[1].title}</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed flex-1">{FEATURES[1].desc}</p>
            </div>

            {/* ZK-Settled — 4 cols */}
            <div className="lg:col-span-4 card p-5">
              <div className="inline-flex items-center gap-1.5 mb-2 px-2 py-0.5 rounded-full bg-[var(--accent-dim)] text-[var(--accent)] text-[10px] font-medium uppercase tracking-wider">
                {FEATURES[2].tag}
              </div>
              <h3 className="text-sm font-bold mb-1">{FEATURES[2].title}</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{FEATURES[2].desc}</p>
            </div>

            {/* Cross-Chain — 7 cols */}
            <div className="lg:col-span-7 card p-5">
              <div className="flex items-start gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 mb-2 px-2 py-0.5 rounded-full bg-[var(--accent-dim)] text-[var(--accent)] text-[10px] font-medium uppercase tracking-wider">
                    {FEATURES[3].tag}
                  </div>
                  <h3 className="text-sm font-bold mb-1">{FEATURES[3].title}</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{FEATURES[3].desc}</p>
                </div>
              </div>
            </div>

            {/* MEV Protected — 5 cols */}
            <div className="lg:col-span-5 card p-5">
              <div className="flex items-start gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 mb-2 px-2 py-0.5 rounded-full bg-[var(--accent-dim)] text-[var(--accent)] text-[10px] font-medium uppercase tracking-wider">
                    {FEATURES[4].tag}
                  </div>
                  <h3 className="text-sm font-bold mb-1">{FEATURES[4].title}</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{FEATURES[4].desc}</p>
                </div>
              </div>
            </div>

            {/* Gas Abstraction — full width accent */}
            <div className="sm:col-span-2 lg:col-span-12 card card-accent p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--accent)]/[0.03] rounded-full blur-3xl" />
              <div className="relative z-10 flex items-center gap-4">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--accent-dim)] text-[var(--accent)] text-[10px] font-medium uppercase tracking-wider shrink-0">
                  {FEATURES[5].tag}
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

          {/* Steps — editorial numbering layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="relative">
                <div className="text-[6rem] sm:text-[8rem] font-bold text-[var(--border)] leading-none select-none -mb-8 md:-mb-12">
                  {item.step}
                </div>
                <div className="relative z-10">
                  <h3 className="text-lg sm:text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Intent Form ─── */}
      <section id="intent" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 max-w-2xl">
            <span className="tag block mb-3">Intent</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.02em] mb-3">
              Post an Intent
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Describe your swap. Solvers compete to fill it at the best price.
            </p>
          </div>
          <IntentForm />
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="card-accent p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/[0.05] rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--accent)]/[0.03] rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.02em] mb-4">
                Ready to Get the Best Price?
              </h2>
              <p className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
                Join the solver network. Post your first intent and experience competitive cross-chain execution.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a href="#intent" className="btn-primary px-8 py-3 text-sm inline-flex items-center gap-2">
                  Start Now
                  <span className="text-xs">→</span>
                </a>
                <a href="/dashboard" className="btn-ghost px-8 py-3 text-sm">
                  View Dashboard
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
