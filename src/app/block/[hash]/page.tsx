import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlockWithTransactions } from "@/lib/ethers";
import { formatTimestamp, formatAddress, formatNumber, weiToEth } from "@/lib/utils";
import TxTable from "@/components/TxTable";

interface BlockPageProps {
  params: Promise<{ hash: string }>;
}

export const dynamic = "force-dynamic";

export default async function BlockPage({ params }: BlockPageProps) {
  const { hash } = await params;
  
  // Try to parse as number first (block number), then as hash
  let block = null;
  const blockNum = parseInt(hash, 10);
  
  if (!isNaN(blockNum)) {
    block = await getBlockWithTransactions(blockNum);
  } else {
    block = await getBlockWithTransactions(hash);
  }

  if (!block) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Latest Blocks
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Block #{formatNumber(block.number)}</h1>
      
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Block Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Block Hash</p>
            <p className="font-mono text-sm break-all">{block.hash}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Parent Hash</p>
            <Link href={`/block/${block.parentHash}`} className="font-mono text-sm text-blue-600 hover:underline break-all">
              {block.parentHash}
            </Link>
          </div>
          <div>
            <p className="text-sm text-gray-500">Timestamp</p>
            <p>{formatTimestamp(block.timestamp)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Miner</p>
            <Link href={`/address/${block.miner}`} className="text-blue-600 hover:underline">
              {formatAddress(block.miner)}
            </Link>
          </div>
          <div>
            <p className="text-sm text-gray-500">Transactions</p>
            <p>{block.transactions.length} transactions</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Gas Used</p>
            <p>{formatNumber(block.gasUsed)} / {formatNumber(block.gasLimit)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Difficulty</p>
            <p>{formatNumber(block.difficulty)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Size</p>
            <p>{formatNumber(block.size)} bytes</p>
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Transactions</h2>
      <div className="bg-white border rounded-lg overflow-hidden">
        <TxTable transactions={block.transactions} showBlockNumber={false} />
      </div>
    </div>
  );
}