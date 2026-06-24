export interface Chain {
  id: number;
  name: string;
  slug: string;
  icon: string;
  color: string;
  rpcUrl: string;
  explorer: string;
}

export const chains: Chain[] = [
  {
    id: 1,
    name: "Ethereum",
    slug: "ethereum",
    icon: "⟠",
    color: "#627EEA",
    rpcUrl: "https://eth.llamarpc.com",
    explorer: "https://etherscan.io",
  },
  {
    id: 42161,
    name: "Arbitrum",
    slug: "arbitrum",
    icon: "🔷",
    color: "#2D374B",
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    explorer: "https://arbiscan.io",
  },
  {
    id: 10,
    name: "Optimism",
    slug: "optimism",
    icon: "🔴",
    color: "#FF0420",
    rpcUrl: "https://mainnet.optimism.io",
    explorer: "https://optimistic.etherscan.io",
  },
  {
    id: 8453,
    name: "Base",
    slug: "base",
    icon: "🔵",
    color: "#0052FF",
    rpcUrl: "https://mainnet.base.org",
    explorer: "https://basescan.org",
  },
  {
    id: 137,
    name: "Polygon",
    slug: "polygon",
    icon: "🟣",
    color: "#8247E5",
    rpcUrl: "https://polygon-rpc.com",
    explorer: "https://polygonscan.com",
  },
  {
    id: 43114,
    name: "Avalanche",
    slug: "avalanche",
    icon: "❄️",
    color: "#E84142",
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    explorer: "https://snowtrace.io",
  },
  {
    id: 56,
    name: "BNB Chain",
    slug: "bnb-chain",
    icon: "💰",
    color: "#F0B90B",
    rpcUrl: "https://bsc-dataseed1.binance.org",
    explorer: "https://bscscan.com",
  },
  {
    id: 324,
    name: "zkSync Era",
    slug: "zksync-era",
    icon: "⚡",
    color: "#8B5CF6",
    rpcUrl: "https://mainnet.era.zksync.io",
    explorer: "https://explorer.zksync.io",
  },
  {
    id: 534352,
    name: "Scroll",
    slug: "scroll",
    icon: "📜",
    color: "#EBC17A",
    rpcUrl: "https://rpc.scroll.io",
    explorer: "https://scrollscan.com",
  },
  {
    id: 59144,
    name: "Linea",
    slug: "linea",
    icon: "🔗",
    color: "#121212",
    rpcUrl: "https://rpc.linea.build",
    explorer: "https://lineascan.build",
  },
];

export const chainMap = new Map<number, Chain>();
for (const chain of chains) {
  chainMap.set(chain.id, chain);
}

export const chainSlugMap = new Map<string, Chain>();
for (const chain of chains) {
  chainSlugMap.set(chain.slug, chain);
}

export function getChainById(id: number): Chain | undefined {
  return chainMap.get(id);
}

export function getChainBySlug(slug: string): Chain | undefined {
  return chainSlugMap.get(slug);
}

export function getChainByName(name: string): Chain | undefined {
  return chains.find(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  );
}

export function getExplorerUrl(chainSlug: string, txHash: string): string {
  const chain = chainSlugMap.get(chainSlug);
  if (!chain) return "#";
  return `${chain.explorer}/tx/${txHash}`;
}
