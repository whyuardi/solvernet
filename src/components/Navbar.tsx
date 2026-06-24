"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Network, Menu, X, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "Explore", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Auction", href: "/auction" },
];

const linkVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.05 * i, duration: 0.3, ease: "easeOut" as const },
  }),
};

const mobileItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.08 * i, duration: 0.3, ease: "easeOut" as const },
  }),
};

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[var(--bg-primary)]/95 border-b border-[var(--border)]"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label="SolverNet Home"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--accent-dim)] border border-[rgba(180,255,57,0.12)] transition-colors group-hover:border-[rgba(180,255,57,0.3)]">
            <Network className="h-4 w-4 text-[var(--accent)]" />
          </div>
          <span className="text-base font-bold tracking-tight text-white">
            Solv<span className="text-[var(--accent)]">Net</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link, i) => {
            const isActive =
              pathname === link.href || pathname?.startsWith(link.href + "/");
            return (
              <motion.div
                key={link.href}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={linkVariants}
              >
                <Link
                  href={link.href}
                  className={cn(
                    "relative rounded-[var(--radius-sm)] px-3 py-1.5 text-sm font-medium transition-colors duration-200",
                    isActive
                      ? "text-[var(--accent)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  )}
                >
                  {link.label}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button
            disabled
            className="hidden h-8 items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--border)] bg-transparent px-3 text-xs font-medium text-[var(--text-secondary)] cursor-not-allowed opacity-50 sm:flex"
            aria-label="Connect Wallet"
          >
            <Wallet className="h-3.5 w-3.5" />
            <span>Connect Wallet</span>
          </button>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative z-50 flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] md:hidden"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 35 }}
              className="fixed inset-y-0 right-0 z-40 w-64 border-l border-[var(--border)] bg-[var(--bg-primary)] md:hidden"
            >
              <div className="flex flex-col gap-1 px-5 pt-20">
                {navLinks.map((link, i) => {
                  const isActive =
                    pathname === link.href ||
                    pathname?.startsWith(link.href + "/");
                  return (
                    <motion.div
                      key={link.href}
                      custom={i}
                      initial="hidden"
                      animate="visible"
                      variants={mobileItemVariants}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center rounded-[var(--radius-sm)] px-3 py-2.5 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-[var(--accent-dim)] text-[var(--accent)]"
                            : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
                        )}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}

                <motion.div
                  custom={navLinks.length}
                  initial="hidden"
                  animate="visible"
                  variants={mobileItemVariants}
                  className="mt-4 border-t border-[var(--border)] pt-4"
                >
                  <button
                    disabled
                    className="flex w-full items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--border)] bg-transparent px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] cursor-not-allowed opacity-50"
                  >
                    <Wallet className="h-4 w-4" />
                    <span>Connect Wallet</span>
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
