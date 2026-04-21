import Link from "next/link";
import type { Block } from "@/types";
import { formatTimestamp, formatAddress, formatNumber } from "@/lib/utils";

interface BlockCardProps {
  block: Block;
}

export default function BlockCard({ block }: BlockCardProps) {
  return (
    <Link
      href={`/block/${block.hash}`}
      className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-lg">Block #{formatNumber(block.number)}</p>
          <p className="text-sm text-gray-500 font-mono mt-1">
            {block.hash.slice(0, 20)}...
          </p>
        </div>
        <div className="text-right text-sm text-gray-600">
          <p>{formatTimestamp(block.timestamp)}</p>
          <p className="mt-1">{block.transactions.length} txns</p>
        </div>
      </div>
      <div className="mt-3 flex gap-4 text-sm text-gray-500">
        <span>Miner: {formatAddress(block.miner, 4)}</span>
        <span>Gas: {formatNumber(block.gasUsed)}</span>
      </div>
    </Link>
  );
}