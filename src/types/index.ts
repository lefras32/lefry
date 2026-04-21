// Types for blockchain data

export interface Block {
  number: number;
  hash: string;
  parentHash: string;
  timestamp: number;
  transactions: string[];
  miner: string;
  gasUsed: string;
  gasLimit: string;
  difficulty: string;
  totalDifficulty: string;
  size: number;
  nonce: string;
  extraData: string;
}

export interface Transaction {
  hash: string;
  blockNumber: number;
  blockHash: string;
  from: string;
  to: string;
  value: string;
  gasPrice: string;
  gas: string;
  nonce: number;
  input: string;
  transactionIndex: number;
  timestamp: number;
  status?: boolean;
}

export interface AddressInfo {
  address: string;
  balance: string;
  transactionCount: number;
}

export interface BlockWithTransactions {
  number: number;
  hash: string;
  parentHash: string;
  timestamp: number;
  transactions: Transaction[];
  miner: string;
  gasUsed: string;
  gasLimit: string;
  difficulty: string;
  totalDifficulty: string;
  size: number;
  nonce: string;
  extraData: string;
}