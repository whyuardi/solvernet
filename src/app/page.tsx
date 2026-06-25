import IntentForm from '@/components/IntentForm'
import ClientHero from './client-hero'

export default function Home() {
  return (
    <>

      {/* ─── Hero ─── */}
      <section className="relative min-h-[90dvh] flex items-center overflow-hidden border-b border-[var(--border)]">
        <div className="absolute inset-0 z-0">
          <ClientHero />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C0C0D] via-[#0C0C0D]/70 to-transparent z-[1]" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl pt-16">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
              <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.1em] text-[var(--accent)]">
                Mainnet Beta
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-[-0.04em] mb-6">
              Intent Settlement
              <br />
              <span className="text-[var(--accent)]">Layer</span>
            </h1>

            <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-lg leading-relaxed mb-8">
              Post your intent. Solvers compete. You get the best price across chains.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a href="#intent" className="btn-primary px-6 py-3 text-xs">
                Launch App
              </a>
              <a href="#how-it-works" className="btn-ghost px-6 py-3 text-xs">
                How It Works
              </a>
            </div>

            {/* Stats inline */}
            <div className="flex gap-4 sm:gap-8 mt-12 pt-8 border-t border-[var(--border)]">
              <div>
                <div className="text-2xl font-bold font-[var(--font-mono)] text-[var(--accent)]">$142M+</div>
                <div className="text-[10px] uppercase tracking-[0.1em] text-[var(--text-muted)] mt-1 font-[var(--font-mono)]">TVS</div>
              </div>
              <div className="w-px bg-[var(--border)]" />
              <div>
                <div className="text-2xl font-bold font-[var(--font-mono)]">47</div>
                <div className="text-[10px] uppercase tracking-[0.1em] text-[var(--text-muted)] mt-1 font-[var(--font-mono)]">Solvers</div>
              </div>
              <div className="w-px bg-[var(--border)]" />
              <div>
                <div className="text-2xl font-bold font-[var(--font-mono)]">15</div>
                <div className="text-[10px] uppercase tracking-[0.1em] text-[var(--text-muted)] mt-1 font-[var(--font-mono)]">Chains</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works — editorial step numbering ─── */}
      <section id="how-it-works" className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: label + title */}
            <div className="lg:col-span-4">
              <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.1em] text-[var(--accent)]">
                Mechanism
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] mt-3 mb-4">
                How It Works
              </h2>
              <div className="divider-accent mb-4" />
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Three simple steps from intent to settlement.
              </p>
            </div>

            {/* Right: steps */}
            <div className="lg:col-span-7 lg:col-start-6 space-y-12">
              {[
                { num: '01', title: 'Post Your Intent', desc: 'Specify what you want to trade, where, and your parameters. No need to bridge funds upfront.' },
                { num: '02', title: 'Solvers Compete', desc: 'A Dutch auction starts. Solvers bid progressively lower prices until one claims your intent.' },
                { num: '03', title: 'Best Price Settled', desc: 'The winning solver executes your intent. You get the best price, verified on-chain.' },
              ].map((step) => (
                <div key={step.num} className="grid grid-cols-[3rem_1fr] gap-4">
                  <span className="text-2xl font-bold text-[var(--accent)] font-[var(--font-mono)]">
                    {step.num}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold mb-1.5">{step.title}</h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features — editorial grid ─── */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.1em] text-[var(--accent)]">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] mt-3">
              Built for Execution
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--border)]">
            {[
              { label: 'Auction', title: 'Dutch Auction Engine', desc: 'Every intent triggers a Dutch auction. Price decays until a solver claims it, ensuring best execution.' },
              { label: 'Market', title: 'Solver Marketplace', desc: 'Competitive marketplace of specialized solvers bidding in real-time, driving prices down.' },
              { label: 'ZK', title: 'ZK-Settled', desc: 'Zero-knowledge proofs verify every settlement. Trustless cross-chain execution.' },
              { label: 'Chains', title: 'Cross-Chain Native', desc: 'Native bridging across 15+ chains. Post on one, settle on another.' },
              { label: 'MEV', title: 'MEV Protected', desc: 'Dutch auction design neutralizes MEV. No frontrunning, no sandwich attacks.' },
              { label: 'Gas', title: 'Gas Abstraction', desc: 'Pay fees in any token. Solvers cover gas across chains.' },
            ].map((f, i) => (
              <div key={i} className="bg-[var(--bg-primary)] p-6 sm:p-8">
                <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.1em] text-[var(--accent)]">
                  {f.label}
                </span>
                <h3 className="text-base font-bold mt-2 mb-2">{f.title}</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Intent Form ─── */}
      <section id="intent" className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
              <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.1em] text-[var(--accent)]">
                Interface
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] mt-3 mb-4">
                Post an Intent
              </h2>
              <div className="divider-accent mb-4" />
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Describe your swap. Solvers compete to fill it at the best price.
              </p>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <IntentForm />
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] mb-4">
            Ready to Get the Best Price?
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
            Join the solver network. Post your first intent and experience competitive cross-chain execution.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a href="#intent" className="btn-primary px-8 py-3 text-xs">
              Start Now
            </a>
            <a href="/dashboard" className="btn-ghost px-8 py-3 text-xs">
              Dashboard
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
