"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isValidAddress, isValidHash } from "@/lib/utils";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    
    if (!trimmed) return;
    
    // Check if it's a valid address
    if (isValidAddress(trimmed)) {
      router.push(`/address/${trimmed}`);
      return;
    }
    
    // Check if it's a valid hash (64 chars)
    if (isValidHash(trimmed)) {
      // Determine if it's a block hash or tx hash
      // For simplicity, try tx first, then block
      router.push(`/tx/${trimmed}`);
      return;
    }
    
    // Try as block number
    const blockNum = parseInt(trimmed, 10);
    if (!isNaN(blockNum)) {
      // Get block hash and navigate
      router.push(`/block/${blockNum}`);
      return;
    }
    
    alert("Invalid search query. Please enter a valid address, transaction hash, or block number.");
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-xl">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by address, tx hash, or block number..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
}