import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getWeapons() {
  const weapons = await prisma.weapon.findMany({
    include: {
      damages: {
        orderBy: {
          distance: "asc",
        },
      },
      category: true,
    },
    orderBy: {
      name: "asc",
    },
  });
  return weapons;
}

export default async function Home() {
  const weapons = await getWeapons();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">BF6 Weapon Stats</h1>
          <div className="flex gap-4">
            <Link
              href="/ranking"
              className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
            >
              View Ranking
            </Link>
            <Link
              href="/weapons/new"
              className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add New Weapon
            </Link>
          </div>
        </div>

        <div className="grid gap-6">
          {weapons.map((weapon) => (
            <Link href={`/weapons/${weapon.id}`} key={weapon.id}>
              <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{weapon.name}</h2>
                    <p className="text-gray-600">{weapon.category.name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Fire Rate</p>
                    <p className="text-lg font-semibold">
                      {weapon.fireRate} RPM
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Magazine</p>
                    <p className="text-lg font-semibold">{weapon.magazine}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Reload Time</p>
                    <p className="text-lg font-semibold">
                      {weapon.reloadTime}s
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Damage by Distance</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Distance (m)</th>
                          {weapon.damages.map((d) => (
                            <th key={d.id} className="text-center p-2">
                              {d.distance}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="text-left p-2 font-medium">Damage</td>
                          {weapon.damages.map((d) => (
                            <td key={d.id} className="text-center p-2">
                              {d.damage}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {weapons.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No weapons found. Add your first weapon to get started.
          </div>
        )}
      </div>
    </div>
  );
}
