"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "Explore", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Auction", href: "/auction" },
  { label: "Analytics", href: "/analytics" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

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
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Check if already connected
  useEffect(() => {
    const checkWallet = async () => {
      if (typeof window !== "undefined" && (window as any).ethereum) {
        try {
          const accounts = await (window as any).ethereum.request({ method: "eth_accounts" });
          if (accounts?.length > 0) {
            setAccount(accounts[0]);
            fetchBalance(accounts[0]);
          }
        } catch {}
      }
    };
    checkWallet();
  }, []);

  // Listen for account/chain changes
  useEffect(() => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        fetchBalance(accounts[0]);
      } else {
        setAccount(null);
        setBalance(null);
      }
    };

    const handleChainChanged = () => {
      if (account) fetchBalance(account);
    };

    ethereum.on("accountsChanged", handleAccountsChanged);
    ethereum.on("chainChanged", handleChainChanged);

    return () => {
      ethereum.removeListener("accountsChanged", handleAccountsChanged);
      ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [account]);

  const fetchBalance = async (addr: string) => {
    try {
      const ethereum = (window as any).ethereum;
      const wei = await ethereum.request({
        method: "eth_getBalance",
        params: [addr, "latest"],
      });
      const eth = parseInt(wei, 16) / 1e18;
      setBalance(`${eth.toFixed(3)} ETH`);
    } catch {
      setBalance(null);
    }
  };

  const connectWallet = async () => {
    if (!(window as any).ethereum) {
      window.open("https://metamask.io/download/", "_blank");
      return;
    }
    setConnecting(true);
    try {
      const accounts = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts?.length > 0) {
        setAccount(accounts[0]);
        fetchBalance(accounts[0]);
      }
    } catch (err: any) {
      if (err.code !== 4001) console.error(err);
    }
    setConnecting(false);
  };

  const disconnectWallet = () => {
    setAccount(null);
    setBalance(null);
  };

  const shortAddr = account
    ? `${account.slice(0, 4)}...${account.slice(-4)}`
    : "";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
        scrolled ? "bg-[#0C0C0D] border-b border-[var(--border)]" : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label="SolverNet Home"
        >
          <span className="text-sm font-bold tracking-tight text-white">
            Solver<span className="text-[var(--accent)]">Net</span>
          </span>
          <span className="text-[10px] text-[var(--text-muted)] font-[var(--font-mono)] uppercase tracking-widest">
            α
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href || pathname?.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium transition-colors border-b-2",
                  isActive
                    ? "text-[var(--accent)] border-[var(--accent)]"
                    : "text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)] hover:border-[var(--border-hover)]"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {account ? (
            <div className="hidden items-center gap-2 sm:flex">
              {balance && (
                <span className="text-[11px] text-[var(--text-muted)] font-[var(--font-mono)]">
                  {balance}
                </span>
              )}
              <button
                onClick={disconnectWallet}
                className="pill flex items-center gap-1.5 hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                title={account}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
                <span className="font-[var(--font-mono)]">{shortAddr}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              disabled={connecting}
              className="hidden h-7 items-center gap-1.5 rounded-[var(--radius-sm)] bg-[var(--accent)] px-2.5 text-[11px] font-medium text-[#0C0C0D] hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 sm:flex font-[var(--font-mono)] uppercase tracking-wider"
            >
              {connecting ? "..." : "Connect"}
            </button>
          )}

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative z-50 flex h-8 w-8 items-center justify-center text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] md:hidden"
            aria-label={isOpen ? "Close" : "Menu"}
          >
            {isOpen ? (
              <span className="text-lg">✕</span>
            ) : (
              <span className="text-lg">☰</span>
            )}
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
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-40 bg-black/70 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 35 }}
              className="fixed inset-y-0 right-0 z-40 w-56 border-l border-[var(--border)] bg-[#0C0C0D] md:hidden"
            >
              <div className="flex flex-col gap-1 px-5 pt-16">
                {navLinks.map((link) => {
                  const isActive =
                    pathname === link.href ||
                    pathname?.startsWith(link.href + "/");
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "py-2 text-sm font-medium transition-colors border-l-2 px-3",
                        isActive
                          ? "text-[var(--accent)] border-[var(--accent)]"
                          : "text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)]"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}

                <div className="mt-4 border-t border-[var(--border)] pt-4">
                  {account ? (
                    <div className="space-y-2 px-3">
                      <div className="pill text-xs justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] mr-2" />
                        <span className="font-[var(--font-mono)]">{shortAddr}</span>
                      </div>
                      {balance && (
                        <p className="text-[11px] text-[var(--text-muted)] font-[var(--font-mono)] text-center">
                          {balance}
                        </p>
                      )}
                      <button
                        onClick={disconnectWallet}
                        className="w-full py-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors font-[var(--font-mono)]"
                      >
                        Disconnect
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={connectWallet}
                      disabled={connecting}
                      className="w-full py-2 px-3 text-sm font-medium bg-[var(--accent)] text-[#0C0C0D] rounded-[var(--radius-sm)] transition-opacity hover:opacity-90 disabled:opacity-50 font-[var(--font-mono)] uppercase tracking-wider"
                    >
                      {connecting ? "..." : "Connect Wallet"}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
