import { getLatestBlocks } from "@/lib/ethers";
import BlockCard from "@/components/BlockCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const blocks = await getLatestBlocks(15);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Latest Blocks</h1>
      <div className="grid gap-4">
        {blocks.map((block) => (
          <BlockCard key={block.hash} block={block} />
        ))}
      </div>
    </div>
  );
}