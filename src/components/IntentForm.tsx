'use client'

import { useState, useCallback, FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createIntent, startAuction, getIntents } from '@/lib/intent-store'
import { startAuctionEngine } from '@/lib/auction-engine'


/* ─── Types ─────────────────────────────────────────────── */

type ChainId = 'ethereum' | 'arbitrum' | 'optimism' | 'base' | 'polygon'

interface Chain {
  id: ChainId
  name: string
  icon: string
  color: string
}

type TokenSymbol = 'ETH' | 'USDC' | 'WBTC' | 'ARB' | 'OP'

interface Token {
  symbol: TokenSymbol
  name: string
  icon: string
  decimals: number
}

type Slippage = number // 0.1 – 5
type Deadline = 5 | 15 | 30 | 60

interface IntentFormData {
  fromChain: ChainId
  toChain: ChainId
  inputToken: TokenSymbol
  outputToken: TokenSymbol
  amount: string
  slippage: Slippage
  deadline: Deadline
}

/* ─── Data ──────────────────────────────────────────────── */

const CHAINS: Chain[] = [
  { id: 'ethereum', name: 'Ethereum', icon: '⟠', color: '#627EEA' },
  { id: 'arbitrum', name: 'Arbitrum', icon: '⛓', color: '#2D374B' },
  { id: 'optimism', name: 'Optimism', icon: '⨀', color: '#FF0420' },
  { id: 'base', name: 'Base', icon: '⬡', color: '#0052FF' },
  { id: 'polygon', name: 'Polygon', icon: '⬣', color: '#8247E5' },
]

const TOKENS: Token[] = [
  { symbol: 'ETH', name: 'Ether', icon: '⟠', decimals: 18 },
  { symbol: 'USDC', name: 'USD Coin', icon: '💲', decimals: 6 },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', icon: '₿', decimals: 8 },
  { symbol: 'ARB', name: 'Arbitrum', icon: '⛓', decimals: 18 },
  { symbol: 'OP', name: 'Optimism', icon: '⨀', decimals: 18 },
]

const DEADLINE_OPTIONS: { value: Deadline; label: string }[] = [
  { value: 5, label: '5 min' },
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 60, label: '1 hr' },
]

/* ─── Dropdown Component ────────────────────────────────── */

function Selector<T extends string>({
  label,
  options,
  value,
  onChange,
  renderOption,
}: {
  label: string
  options: { value: T; label: string; disabled?: boolean }[]
  value: T
  onChange: (v: T) => void
  renderOption?: (v: T) => React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  const selected = options.find((o) => o.value === value)

  return (
    <div className="relative">
      <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="input-base w-full flex items-center justify-between gap-2 px-3 py-2.5 text-sm cursor-pointer"
      >
        <span className="flex items-center gap-2">
          {renderOption ? renderOption(value) : value}
        </span>
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none text-xs">▾</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 mt-1 w-full bg-[#1A1A26] border border-[var(--border)] rounded-[var(--radius-sm)] overflow-hidden shadow-xl"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                disabled={opt.disabled}
                onMouseDown={() => {
                  onChange(opt.value)
                  setOpen(false)
                }}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 text-sm text-left transition-colors ${
                  opt.value === value
                    ? 'bg-[var(--accent-dim)] text-[var(--accent)]'
                    : 'text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.03)]'
                } ${opt.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span className="flex items-center gap-2">
                  {renderOption ? renderOption(opt.value) : opt.label}
                </span>
                {opt.value === value && <span className="text-xs">✓</span>}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Token Badge ───────────────────────────────────────── */

function TokenBadge({ symbol }: { symbol: TokenSymbol }) {
  const t = TOKENS.find((tk) => tk.symbol === symbol)
  if (!t) return <span>{symbol}</span>
  return (
    <span className="flex items-center gap-1.5">
      <span className="w-5 h-5 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-xs">
        {t.icon}
      </span>
      <span className="font-medium">{t.symbol}</span>
    </span>
  )
}

/* ─── Chain Badge ───────────────────────────────────────── */

function ChainBadge({ chainId }: { chainId: ChainId }) {
  const c = CHAINS.find((ch) => ch.id === chainId)
  if (!c) return <span>{chainId}</span>
  return (
    <span className="flex items-center gap-1.5">
      <span
        className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
        style={{ backgroundColor: `${c.color}20`, color: c.color }}
      >
        {c.icon}
      </span>
      <span className="font-medium">{c.name}</span>
    </span>
  )
}

/* ─── Main Component ────────────────────────────────────── */

export default function IntentForm() {
  const [form, setForm] = useState<IntentFormData>({
    fromChain: 'ethereum',
    toChain: 'arbitrum',
    inputToken: 'ETH',
    outputToken: 'USDC',
    amount: '',
    slippage: 0.5,
    deadline: 30,
  })

  const [errors, setErrors] = useState<Partial<Record<keyof IntentFormData, string>>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [createdIntentId, setCreatedIntentId] = useState<string | null>(null)

  const update = useCallback(<K extends keyof IntentFormData>(key: K, value: IntentFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }, [])

  const swapChains = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      fromChain: prev.toChain,
      toChain: prev.fromChain,
    }))
  }, [])

  const validate = useCallback((): boolean => {
    const e: Partial<Record<keyof IntentFormData, string>> = {}
    if (!form.amount || parseFloat(form.amount) <= 0) e.amount = 'Enter an amount greater than 0'
    if (form.fromChain === form.toChain) e.toChain = 'Destination must differ from source'
    setErrors(e)
    return Object.keys(e).length === 0
  }, [form])

  const handleSubmit = useCallback(
    async (ev: FormEvent) => {
      ev.preventDefault()
      if (!validate()) return
      setStatus('submitting')
      // Create real intent
      await new Promise((r) => setTimeout(r, 1500))
      const intent = createIntent({
        fromChain: form.fromChain,
        toChain: form.toChain,
        inputToken: form.inputToken,
        outputToken: form.outputToken,
        amount: parseFloat(form.amount),
        slippage: form.slippage,
        deadline: form.deadline,
      })
      // Start auction
      const auction = startAuction(intent)
      startAuctionEngine(intent.id, auction)
      setCreatedIntentId(intent.id)
      setStatus('success')
    },
    [validate, form],
  )

  const reset = useCallback(() => {
    setStatus('idle')
    setForm({
      fromChain: 'ethereum',
      toChain: 'arbitrum',
      inputToken: 'ETH',
      outputToken: 'USDC',
      amount: '',
      slippage: 0.5,
      deadline: 30,
    })
    setErrors({})
  }, [])

  /* ─── Render ───────────────────────────────────────────── */

  return (
    <div className="w-full">
      <div className="card p-5 sm:p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">New Intent</h2>
          <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] bg-[var(--accent-dim)] px-2 py-0.5 rounded-[var(--radius-full)]">
            v0.1
          </span>
        </div>

        <AnimatePresence mode="wait">
          {/* ── Success State ── */}
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="py-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[var(--success)] text-lg font-bold">✓</span>
                <h3 className="text-lg font-semibold text-[var(--success)]">Intent Posted Successfully</h3>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-6">
                Solvers are now competing to fill your {form.amount} {form.inputToken} → {form.outputToken} order across {CHAINS.find((c) => c.id === form.fromChain)?.name} → {CHAINS.find((c) => c.id === form.toChain)?.name}
              </p>
              <div className="bg-[var(--bg-secondary)] rounded-[var(--radius-sm)] p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[var(--text-muted)] text-xs block mb-1">Route</span>
                    <span className="font-medium">{CHAINS.find((c) => c.id === form.fromChain)?.name} → {CHAINS.find((c) => c.id === form.toChain)?.name}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] text-xs block mb-1">Amount</span>
                    <span className="font-medium font-mono">{form.amount} {form.inputToken}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] text-xs block mb-1">Slippage</span>
                    <span className="font-medium font-mono">{form.slippage}%</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] text-xs block mb-1">Deadline</span>
                    <span className="font-medium">{form.deadline} minutes</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={reset} className="btn-primary px-6 py-2.5 text-sm flex-1">
                  Post Another Intent
                </button>
                {createdIntentId && (
                  <a href={`/auction?id=${createdIntentId}`} className="btn-ghost px-6 py-2.5 text-sm flex-1 text-center">
                    View Auction
                  </a>
                )}
                <a href="/dashboard" className="btn-ghost px-6 py-2.5 text-sm flex-1 text-center">
                  Dashboard
                </a>
              </div>
            </motion.div>
          ) : (
            /* ── Form ── */
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
            >
              {/* From / To Chains */}
              <div className="relative mb-5">
                <div className="grid grid-cols-[1fr,auto,1fr] gap-1.5 sm:gap-2 items-end">
                  <Selector<ChainId>
                    label="From Chain"
                    options={CHAINS.map((c) => ({ value: c.id, label: c.name }))}
                    value={form.fromChain}
                    onChange={(v) => update('fromChain', v)}
                    renderOption={(v) => <ChainBadge chainId={v} />}
                  />
                  <button
                    type="button"
                    onClick={swapChains}
                    className="mb-0.5 p-1.5 sm:p-2 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent)] transition-colors cursor-pointer"
                    title="Swap chains"
                  >
                    <span className="text-sm">⇄</span>
                  </button>
                  <Selector<ChainId>
                    label="To Chain"
                    options={CHAINS.map((c) => ({
                      value: c.id,
                      label: c.name,
                      disabled: c.id === form.fromChain,
                    }))}
                    value={form.toChain}
                    onChange={(v) => update('toChain', v)}
                    renderOption={(v) => <ChainBadge chainId={v} />}
                  />
                </div>
                {errors.toChain && (
                  <p className="text-xs text-[var(--error)] mt-1.5 flex items-center gap-1">
                    <span className="text-xs">!</span>
                    {errors.toChain}
                  </p>
                )}
              </div>

              {/* Input / Output Tokens */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <Selector<TokenSymbol>
                  label="Input Token"
                  options={TOKENS.map((t) => ({ value: t.symbol, label: t.name }))}
                  value={form.inputToken}
                  onChange={(v) => update('inputToken', v)}
                  renderOption={(v) => <TokenBadge symbol={v} />}
                />
                <Selector<TokenSymbol>
                  label="Output Token"
                  options={TOKENS.map((t) => ({ value: t.symbol, label: t.name }))}
                  value={form.outputToken}
                  onChange={(v) => update('outputToken', v)}
                  renderOption={(v) => <TokenBadge symbol={v} />}
                />
              </div>

              {/* Amount */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                    Amount
                  </label>
                  <button
                    type="button"
                    onClick={() => update('amount', '100')}
                    className="text-[10px] font-medium text-[var(--accent)] hover:underline cursor-pointer"
                  >
                    MAX
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={(e) => update('amount', e.target.value)}
                    className="input-base w-full px-3 py-2.5 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)] font-mono">
                    {form.inputToken}
                  </span>
                </div>
                {errors.amount && (
                  <p className="text-xs text-[var(--error)] mt-1.5 flex items-center gap-1">
                    <span className="text-xs">!</span>
                    {errors.amount}
                  </p>
                )}
              </div>

              {/* Slippage */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="text-xs">⟡</span>
                    Slippage Tolerance
                  </label>
                  <span className="text-sm font-mono text-[var(--accent)]">{form.slippage.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="5"
                  step="0.1"
                  value={form.slippage}
                  onChange={(e) => update('slippage', parseFloat(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${((form.slippage - 0.1) / 4.9) * 100}%, rgba(255,255,255,0.08) ${((form.slippage - 0.1) / 4.9) * 100}%, rgba(255,255,255,0.08) 100%)`,
                    accentColor: 'var(--accent)',
                  }}
                />
                <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-1">
                  <span>0.1%</span>
                  <span>2.5%</span>
                  <span>5%</span>
                </div>
              </div>

              {/* Deadline */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="text-xs">⏱</span>
                    Deadline
                  </label>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {DEADLINE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => update('deadline', opt.value)}
                      className={`px-2 py-2 text-xs font-medium rounded-[var(--radius-sm)] border transition-all cursor-pointer ${
                        form.deadline === opt.value
                          ? 'border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)]'
                          : 'border-[var(--border)] bg-transparent text-[var(--text-secondary)] hover:border-[var(--border-hover)]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2"
              >
                {status === 'submitting' ? (
                  <>
                    <span className="text-sm animate-spin inline-block">⟳</span>
                    Simulating Auction...
                  </>
                ) : (
                  <>
                    <span className="text-sm">✦</span>
                    Post Intent
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
