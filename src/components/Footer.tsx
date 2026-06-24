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
    <footer className="border-t border-[var(--border)] bg-[var(--bg-primary)]/80">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-20">
          {/* Brand */}
          <div className="flex-1 space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 group"
              aria-label="SolverNet Home"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-dim)] ring-1 ring-[var(--accent)]/20 transition-colors group-hover:bg-[var(--accent)]/20">
                <Network className="h-4 w-4 text-[var(--accent)]" />
              </div>
              <span className="text-base font-semibold tracking-tight text-[var(--text-primary)]">
                Solv<span className="text-[var(--accent)]">Net</span>
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-[var(--text-secondary)]">
              A decentralized intent-based auction protocol connecting users
              with solvers across every blockchain. Trade, bridge, and swap with
              optimal execution.
            </p>
          </div>

          {/* Link Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:gap-12">
            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                  {column.title}
                </h3>
                <ul className="space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
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

        {/* Divider */}
        <div className="mt-10 border-t border-[var(--border)] pt-6">
          <p className="text-center text-xs text-[var(--text-muted)]">
            &copy; {new Date().getFullYear()} SolverNet. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
