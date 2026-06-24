/**
 * Shorten a wallet address to 0x1234...abcd format
 */
export function formatAddress(addr: string): string {
  if (!addr || addr.length < 10) return addr ?? "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

/**
 * Format a numeric string with commas and fixed decimals.
 * e.g. "125000.00" -> "125,000.00"
 */
export function formatAmount(amt: string, decimals: number = 2): string {
  if (!amt) return "0";
  const num = parseFloat(amt);
  if (isNaN(num)) return amt;
  return num.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Convert a timestamp to a relative time string (e.g., "2h ago", "3d ago")
 */
export function timeAgo(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;

  if (diff < 0) return "just now";
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)}mo ago`;
  return `${Math.floor(diff / 31536000)}y ago`;
}

/**
 * Generate a block explorer URL for a transaction hash on a given chain.
 * Accepts chain name or slug.
 */
export function getExplorerUrl(chain: string, tx: string): string {
  const explorers: Record<string, string> = {
    ethereum: "https://etherscan.io",
    arbitrum: "https://arbiscan.io",
    optimism: "https://optimistic.etherscan.io",
    base: "https://basescan.org",
    polygon: "https://polygonscan.com",
    avalanche: "https://snowtrace.io",
    "bnb-chain": "https://bscscan.com",
    "zksync-era": "https://explorer.zksync.io",
    scroll: "https://scrollscan.com",
    linea: "https://lineascan.build",
  };

  const key = chain.toLowerCase();
  const base = explorers[key] ?? explorers.ethereum;
  return `${base}/tx/${tx}`;
}

/**
 * Combine class names, filtering out falsy values.
 */
export function classNames(
  ...classes: (string | false | undefined | null)[]
): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Alias for classNames — Tailwind-style `cn()` utility.
 */
export const cn = classNames;

/**
 * Format a percentage value for display.
 */
export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Format a deadline timestamp into a readable countdown string.
 */
export function formatDeadline(deadline: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = deadline - now;

  if (diff <= 0) return "Expired";

  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h remaining`;
  }

  if (hours > 0) return `${hours}h ${minutes}m remaining`;
  return `${minutes}m remaining`;
}

/**
 * Simple UUID v4 generator for mock IDs.
 */
export function generateId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
