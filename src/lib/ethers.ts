import { ethers, type TransactionResponse } from "ethers";
import type { Block, Transaction, AddressInfo, BlockWithTransactions } from "@/types";

// Get RPC URL from environment
const RPC_URL = process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL;

// Create provider instance
export const getProvider = () => {
  if (!RPC_URL || RPC_URL.includes("YOUR_API_KEY")) {
    throw new Error("Please set NEXT_PUBLIC_ETHEREUM_RPC_URL in .env.local with a valid API key");
  }
  return new ethers.JsonRpcProvider(RPC_URL);
};

// Get latest block number
export async function getLatestBlockNumber(): Promise<number> {
  const provider = getProvider();
  return await provider.getBlockNumber();
}

// Get block by number or hash
export async function getBlock(blockIdentifier: number | string): Promise<Block | null> {
  const provider = getProvider();
  const block = await provider.getBlock(blockIdentifier, false);
  if (!block) return null;
  
  return {
    number: Number(block.number),
    hash: block.hash || "",
    parentHash: block.parentHash || "",
    timestamp: Number(block.timestamp),
    transactions: [...(block.transactions || [])],
    miner: block.miner || "",
    gasUsed: block.gasUsed?.toString() || "0",
    gasLimit: block.gasLimit?.toString() || "0",
    difficulty: block.difficulty?.toString() || "0",
    totalDifficulty: "0",
    size: 0,
    nonce: block.nonce || "",
    extraData: block.extraData || "",
  };
}

// Get block with full transaction objects
export async function getBlockWithTransactions(blockIdentifier: number | string): Promise<BlockWithTransactions | null> {
  const provider = getProvider();
  const block = await provider.getBlock(blockIdentifier, true);
  if (!block) return null;
  
  const txs = [...block.transactions] as unknown as TransactionResponse[];
  
  return {
    number: Number(block.number),
    hash: block.hash || "",
    parentHash: block.parentHash || "",
    timestamp: Number(block.timestamp),
    transactions: txs.map((tx) => ({
      hash: tx.hash || "",
      blockNumber: Number(tx.blockNumber || 0),
      blockHash: tx.blockHash || "",
      from: tx.from || "",
      to: tx.to || "",
      value: tx.value?.toString() || "0",
      gasPrice: tx.gasPrice?.toString() || "0",
      gas: tx.gasLimit?.toString() || "0",
      nonce: Number(tx.nonce || 0),
      input: tx.data || "",
      transactionIndex: Number(tx.index || 0),
      timestamp: Number(block.timestamp),
    })),
    miner: block.miner || "",
    gasUsed: block.gasUsed?.toString() || "0",
    gasLimit: block.gasLimit?.toString() || "0",
    difficulty: block.difficulty?.toString() || "0",
    totalDifficulty: "0",
    size: 0,
    nonce: block.nonce || "",
    extraData: block.extraData || "",
  };
}

// Get transaction by hash
export async function getTransaction(txHash: string): Promise<Transaction | null> {
  const provider = getProvider();
  const tx = await provider.getTransaction(txHash);
  if (!tx) return null;
  
  const receipt = await provider.getTransactionReceipt(txHash);
  
  return {
    hash: tx.hash || "",
    blockNumber: Number(tx.blockNumber || 0),
    blockHash: tx.blockHash || "",
    from: tx.from || "",
    to: tx.to || "",
    value: tx.value?.toString() || "0",
    gasPrice: tx.gasPrice?.toString() || "0",
    gas: tx.gasLimit?.toString() || "0",
    nonce: Number(tx.nonce || 0),
    input: tx.data || "",
    transactionIndex: Number(tx.index || 0),
    timestamp: 0, // Will be filled from block
    status: receipt?.status === 1,
  };
}

// Get address info (balance and transaction count)
export async function getAddressInfo(address: string): Promise<AddressInfo | null> {
  const provider = getProvider();
  
  try {
    const balance = await provider.getBalance(address);
    const txCount = await provider.getTransactionCount(address);
    
    return {
      address,
      balance: balance.toString(),
      transactionCount: txCount,
    };
  } catch {
    return null;
  }
}

// Get multiple blocks (for home page)
export async function getLatestBlocks(count: number = 10): Promise<Block[]> {
  const provider = getProvider();
  const latestBlock = await provider.getBlockNumber();
  
  const blocks: Block[] = [];
  for (let i = 0; i < count; i++) {
    const blockNum = latestBlock - i;
    const block = await getBlock(blockNum);
    if (block) blocks.push(block);
  }
  
  return blocks;
}