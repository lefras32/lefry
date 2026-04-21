import { notFound } from "next/navigation";
import Link from "next/link";
import { getTransaction, getBlock } from "@/lib/ethers";
import { formatAddress, formatTimestamp, weiToEth, weiToGwei, formatNumber } from "@/lib/utils";

interface TxPageProps {
  params: Promise<{ hash: string }>;
}

export default async function TxPage({ params }: TxPageProps) {
  const { hash } = await params;
  const tx = await getTransaction(hash);

  if (!tx) {
    notFound();
  }

  // Get block info for timestamp
  let blockTimestamp = 0;
  try {
    const block = await getBlock(tx.blockNumber);
    if (block) blockTimestamp = block.timestamp;
  } catch {
    // Ignore errors
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Latest Blocks
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Transaction</h1>
      
      <div className="bg-white border rounded-lg p-6 mb-6">
        <div className="mb-4">
          <p className="text-sm text-gray-500">Transaction Hash</p>
          <p className="font-mono text-sm break-all">{tx.hash}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className={tx.status === undefined ? "text-gray-400" : tx.status ? "text-green-600" : "text-red-600"}>
              {tx.status === undefined ? "Pending" : tx.status ? "Success" : "Failed"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Block Number</p>
            <Link href={`/block/${tx.blockHash}`} className="text-blue-600 hover:underline">
              {tx.blockNumber}
            </Link>
          </div>
          <div>
            <p className="text-sm text-gray-500">Timestamp</p>
            <p>{blockTimestamp > 0 ? formatTimestamp(blockTimestamp) : "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">From</p>
            <Link href={`/address/${tx.from}`} className="text-blue-600 hover:underline font-mono">
              {formatAddress(tx.from)}
            </Link>
          </div>
          <div>
            <p className="text-sm text-gray-500">To</p>
            {tx.to ? (
              <Link href={`/address/${tx.to}`} className="text-blue-600 hover:underline font-mono">
                {formatAddress(tx.to)}
              </Link>
            ) : (
              <span className="text-gray-400">Contract Creation</span>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500">Value</p>
            <p className="font-semibold">{weiToEth(tx.value)} ETH</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Gas Price</p>
            <p>{weiToGwei(tx.gasPrice)} Gwei</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Gas Limit</p>
            <p>{formatNumber(tx.gas)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Nonce</p>
            <p>{tx.nonce}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Transaction Index</p>
            <p>{tx.transactionIndex}</p>
          </div>
        </div>
        
        {tx.input && tx.input !== "0x" && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-1">Input Data</p>
            <pre className="bg-gray-100 p-3 rounded text-xs font-mono overflow-x-auto">
              {tx.input}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}