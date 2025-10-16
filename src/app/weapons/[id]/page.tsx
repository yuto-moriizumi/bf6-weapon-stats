import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DamageChart from "./DamageChart";
import TTKChart from "./TTKChart";
import Link from "next/link";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const weapons = await prisma.weapon.findMany({
    select: { id: true },
  });

  return weapons.map((weapon) => ({
    id: weapon.id.toString(),
  }));
}

async function getWeapon(id: number) {
  const weapon = await prisma.weapon.findUnique({
    where: { id },
    include: {
      damages: {
        orderBy: {
          distance: "asc",
        },
      },
      loadouts: {
        orderBy: {
          name: "asc",
        },
      },
      category: true,
    },
  });
  return weapon;
}

export default async function WeaponDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const weaponId = parseInt(id);

  if (isNaN(weaponId)) {
    notFound();
  }

  const weapon = await getWeapon(weaponId);

  if (!weapon) {
    notFound();
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-blue-500 hover:text-blue-600">
            ← Back to List
          </Link>
          <Link
            href={`/weapons/${weapon.id}/edit`}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Edit
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-2">{weapon.name}</h1>
        <p className="text-gray-600 mb-8">{weapon.category.name}</p>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="border rounded-lg p-6">
            <p className="text-sm text-gray-500">Fire Rate</p>
            <p className="text-2xl font-semibold">{weapon.fireRate} RPM</p>
          </div>
          <div className="border rounded-lg p-6">
            <p className="text-sm text-gray-500">Magazine</p>
            <p className="text-2xl font-semibold">{weapon.magazine}</p>
          </div>
          <div className="border rounded-lg p-6">
            <p className="text-sm text-gray-500">Reload Time</p>
            <p className="text-2xl font-semibold">{weapon.reloadTime}s</p>
          </div>
        </div>

        <div className="border rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Loadouts</h2>
          <div className="space-y-2">
            {weapon.loadouts.map((loadout) => (
              <div
                key={loadout.id}
                className="flex justify-between items-center p-3 border border-white rounded"
              >
                <span className="font-medium text-white">{loadout.name}</span>
                <span className="text-white">{loadout.bulletVelocity} m/s</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">TTK by Distance</h2>
          <TTKChart
            damages={weapon.damages}
            fireRate={weapon.fireRate}
            loadouts={weapon.loadouts}
          />
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Damage by Distance</h2>
          <DamageChart damages={weapon.damages} />
        </div>
      </div>
    </div>
  );
}
