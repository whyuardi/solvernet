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

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
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
          ? "glass-strong shadow-[0_1px_0_rgba(255,255,255,0.05)]"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          aria-label="SolverNet Home"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 ring-1 ring-accent/20 transition-all duration-300 group-hover:bg-accent/20 group-hover:ring-accent/40">
            <Network className="h-5 w-5 text-accent" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">
            Solv<span className="text-accent">Net</span>
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
                    "relative rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200",
                    isActive
                      ? "text-white"
                      : "text-zinc-400 hover:text-zinc-200"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-lg bg-white/10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Right: Wallet Button + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            disabled
            className="hidden h-9 items-center gap-2 rounded-lg border border-zinc-700/50 bg-zinc-800/40 px-4 text-sm font-medium text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-300 sm:flex cursor-not-allowed opacity-60"
            aria-label="Connect Wallet"
          >
            <Wallet className="h-4 w-4" />
            <span>Connect Wallet</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative z-50 flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-800/60 hover:text-white md:hidden"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 35 }}
              className="fixed inset-y-0 right-0 z-40 w-72 border-l border-zinc-800/60 bg-zinc-900/95 backdrop-blur-2xl md:hidden"
            >
              <div className="flex flex-col gap-1 px-6 pt-24">
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
                          "flex items-center rounded-lg px-4 py-3 text-base font-medium transition-colors",
                          isActive
                            ? "bg-white/10 text-white"
                            : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                        )}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Mobile Wallet Button */}
                <motion.div
                  custom={navLinks.length}
                  initial="hidden"
                  animate="visible"
                  variants={mobileItemVariants}
                  className="mt-4 border-t border-zinc-800/60 pt-4"
                >
                  <button
                    disabled
                    className="flex w-full items-center gap-3 rounded-lg border border-zinc-700/50 bg-zinc-800/40 px-4 py-3 text-base font-medium text-zinc-400 cursor-not-allowed opacity-60"
                  >
                    <Wallet className="h-5 w-5" />
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
