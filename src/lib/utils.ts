// Utility functions for formatting

// Convert Wei to ETH
export function weiToEth(wei: string): string {
  try {
    const eth = BigInt(wei) / BigInt(1e18);
    const remainder = BigInt(wei) % BigInt(1e18);
    const decimals = remainder.toString().padStart(18, "0").slice(0, 4);
    return `${eth}.${decimals}`;
  } catch {
    return "0";
  }
}

// Format address (shorten)
export function formatAddress(address: string, chars: number = 6): string {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

// Format hash (shorten)
export function formatHash(hash: string, chars: number = 10): string {
  if (!hash) return "";
  return `${hash.slice(0, chars)}...`;
}

// Format timestamp to readable date
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
}

// Format relative time (e.g., "2 minutes ago")
export function formatRelativeTime(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;
  
  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

// Format gas price (Wei to Gwei)
export function weiToGwei(wei: string): string {
  try {
    const gwei = Number(wei) / 1e9;
    return gwei.toFixed(2);
  } catch {
    return "0";
  }
}

// Format number with commas
export function formatNumber(num: number | string): string {
  const n = typeof num === "string" ? parseInt(num, 10) : num;
  if (isNaN(n)) return "0";
  return n.toLocaleString();
}

// Check if string is a valid Ethereum address
export function isValidAddress(address: string): boolean {
  try {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  } catch {
    return false;
  }
}

// Check if string is a valid transaction or block hash
export function isValidHash(hash: string): boolean {
  try {
    return /^0x[a-fA-F0-9]{64}$/.test(hash);
  } catch {
    return false;
  }
}