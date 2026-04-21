import { notFound } from "next/navigation";
import Link from "next/link";
import { getAddressInfo, getProvider } from "@/lib/ethers";
import { formatAddress, weiToEth, formatNumber } from "@/lib/utils";
import type { Transaction } from "@/types";
import type { TransactionResponse } from "ethers";

interface AddressPageProps {
  params: Promise<{ id: string }>;
}

async function getAddressTransactions(address: string): Promise<Transaction[]> {
  const provider = getProvider();
  
  // Get current block number
  const latestBlock = await provider.getBlockNumber();
  
  // For simplicity, we'll get recent blocks and filter transactions from this address
  // In production, you'd use an indexer API like Etherscan
  const transactions: Transaction[] = [];
  const blocksToCheck = 20;
  
  for (let i = 0; i < blocksToCheck; i++) {
    const blockNum = latestBlock - i;
    try {
      const block = await provider.getBlock(blockNum, true);
      if (block && block.transactions) {
        const txs = [...block.transactions] as unknown as TransactionResponse[];
        for (const tx of txs) {
          if (tx.from?.toLowerCase() === address.toLowerCase() || 
              tx.to?.toLowerCase() === address.toLowerCase()) {
            transactions.push({
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
            });
          }
        }
      }
    } catch {
      // Skip blocks that fail
    }
  }
  
  return transactions.slice(0, 50); // Limit to 50 transactions
}

export default async function AddressPage({ params }: AddressPageProps) {
  const { id } = await params;
  const addressInfo = await getAddressInfo(id);

  if (!addressInfo) {
    notFound();
  }

  const transactions = await getAddressTransactions(id);

  return (
    <div>
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Latest Blocks
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Address</h1>
      
      <div className="bg-white border rounded-lg p-6 mb-6">
        <div className="mb-4">
          <p className="text-sm text-gray-500">Address</p>
          <p className="font-mono text-sm break-all">{addressInfo.address}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Balance</p>
            <p className="text-2xl font-semibold">{weiToEth(addressInfo.balance)} ETH</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Transactions</p>
            <p className="text-2xl font-semibold">{formatNumber(addressInfo.transactionCount)}</p>
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
      <div className="bg-white border rounded-lg overflow-hidden">
        {transactions.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Hash
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Block
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  From/To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Value (ETH)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((tx) => (
                <tr key={tx.hash} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link
                      href={`/tx/${tx.hash}`}
                      className="text-blue-600 hover:underline font-mono"
                    >
                      {tx.hash.slice(0, 10)}...
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link
                      href={`/block/${tx.blockHash}`}
                      className="text-blue-600 hover:underline"
                    >
                      {tx.blockNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {tx.from.toLowerCase() === id.toLowerCase() ? (
                      <span className="text-red-600">Out → {formatAddress(tx.to || "", 4)}</span>
                    ) : (
                      <span className="text-green-600">In ← {formatAddress(tx.from, 4)}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {weiToEth(tx.value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-center py-8">No transactions found</p>
        )}
      </div>
    </div>
  );
}