"use client";

import Link from "next/link";
import { Network } from "lucide-react";

interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

const columns: FooterColumn[] = [
  {
    title: "Protocol",
    links: [
      { label: "Documentation", href: "#" },
      { label: "GitHub", href: "#" },
      { label: "Whitepaper", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "FAQ", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Discord", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "#" },
      { label: "Privacy Policy", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-20">
          {/* Brand */}
          <div className="flex-1 space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 group"
              aria-label="SolverNet Home"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--accent-dim)] border border-[rgba(180,255,57,0.12)]">
                <Network className="h-3.5 w-3.5 text-[var(--accent)]" />
              </div>
              <span className="text-sm font-bold tracking-tight text-[var(--text-primary)]">
                Solv<span className="text-[var(--accent)]">Net</span>
              </span>
            </Link>
            <p className="max-w-sm text-xs leading-relaxed text-[var(--text-secondary)]">
              A decentralized intent-based auction protocol connecting users
              with solvers across every blockchain.
            </p>
          </div>

          {/* Link Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:gap-12">
            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="mb-3 font-[var(--font-mono)] text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--text-muted)]">
                  {column.title}
                </h3>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-xs text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-[var(--border)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[10px] font-[var(--font-mono)] text-[var(--text-muted)] uppercase tracking-wider">
            &copy; {new Date().getFullYear()} SolverNet
          </p>
          <p className="text-[10px] font-[var(--font-mono)] text-[var(--text-muted)] uppercase tracking-wider">
            Intent Settlement Layer
          </p>
        </div>
      </div>
    </footer>
  );
}
