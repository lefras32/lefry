import Link from "next/link";
import type { Transaction } from "@/types";
import { formatAddress, weiToEth, formatTimestamp } from "@/lib/utils";

interface TxTableProps {
  transactions: Transaction[];
  showBlockNumber?: boolean;
}

export default function TxTable({ transactions, showBlockNumber = true }: TxTableProps) {
  if (transactions.length === 0) {
    return <p className="text-gray-500 text-center py-8">No transactions found</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {showBlockNumber && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Block
              </th>
            )}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Hash
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              From
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              To
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Value (ETH)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((tx) => (
            <tr key={tx.hash} className="hover:bg-gray-50">
              {showBlockNumber && (
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Link
                    href={`/block/${tx.blockHash}`}
                    className="text-blue-600 hover:underline"
                  >
                    {tx.blockNumber}
                  </Link>
                </td>
              )}
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
                  href={`/address/${tx.from}`}
                  className="text-blue-600 hover:underline font-mono"
                >
                  {formatAddress(tx.from)}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {tx.to ? (
                  <Link
                    href={`/address/${tx.to}`}
                    className="text-blue-600 hover:underline font-mono"
                  >
                    {formatAddress(tx.to)}
                  </Link>
                ) : (
                  <span className="text-gray-400">Contract Creation</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {weiToEth(tx.value)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {tx.status === undefined ? (
                  <span className="text-gray-400">Pending</span>
                ) : tx.status ? (
                  <span className="text-green-600">Success</span>
                ) : (
                  <span className="text-red-600">Failed</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}