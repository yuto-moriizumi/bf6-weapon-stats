import { prisma } from "@/lib/prisma";
import RankingTable from "@/components/RankingTable";
import Link from "next/link";

export const dynamic = 'force-static';

async function getWeaponsWithDamages() {
  const weapons = await prisma.weapon.findMany({
    include: {
      damages: {
        orderBy: {
          distance: "asc",
        },
      },
      category: true,
    },
  });
  return weapons;
}

export default async function Home() {
  const weapons = await getWeaponsWithDamages();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Weapon Rankings by TTK</h1>
          <Link
            href="/weapons/new"
            className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add New Weapon
          </Link>
        </div>

        <RankingTable weapons={weapons} />
      </div>
    </div>
  );
}
