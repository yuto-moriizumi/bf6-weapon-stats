"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { calculateTTK } from "@/lib/ttk";

type Damage = {
  distance: number;
  damage: number;
};

type Loadout = {
  id: number;
  name: string;
  bulletVelocity: number;
};

type Weapon = {
  id: number;
  name: string;
  fireRate: number;
  magazine: number;
  reloadTime: number;
  damages: Damage[];
  loadouts: Loadout[];
  category: {
    id: number;
    name: string;
  };
};

type Category = {
  id: number;
  name: string;
};

function calculateDPS(weapon: Weapon, distance: number): number {
  if (weapon.damages.length === 0) return 0;

  const sortedDamages = [...weapon.damages].sort(
    (a, b) => a.distance - b.distance,
  );

  let damage = sortedDamages[0].damage;

  for (let i = 0; i < sortedDamages.length; i++) {
    if (sortedDamages[i].distance <= distance) {
      damage = sortedDamages[i].damage;
    } else {
      break;
    }
  }

  return (damage * weapon.fireRate) / 60;
}

function calculateWeaponTTK(
  weapon: Weapon,
  distance: number,
  loadout: Loadout,
): number {
  return calculateTTK(
    weapon.damages,
    distance,
    loadout.bulletVelocity,
    weapon.fireRate,
  );
}

export default function RankingTable({
  weapons,
  categories,
}: {
  weapons: Weapon[];
  categories: Category[];
}) {
  const [distance, setDistance] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<Set<number>>(
    new Set(categories.map((c) => c.id)),
  );
  const maxDistance = 100;

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const rankedWeapons = useMemo(() => {
    const expanded = weapons
      .filter((weapon) => selectedCategories.has(weapon.category.id))
      .flatMap((weapon) =>
        weapon.loadouts.map((loadout) => ({
          ...weapon,
          loadout,
          dps: calculateDPS(weapon, distance),
          ttk: calculateWeaponTTK(weapon, distance, loadout),
        })),
      )
      .sort((a, b) => a.ttk - b.ttk);

    const grouped: Array<{
      id: number;
      name: string;
      category: { id: number; name: string };
      fireRate: number;
      bulletVelocity: number;
      dps: number;
      ttk: number;
      loadoutNames: string[];
    }> = [];

    for (const entry of expanded) {
      const lastGroup = grouped[grouped.length - 1];
      if (
        lastGroup &&
        lastGroup.id === entry.id &&
        lastGroup.bulletVelocity === entry.loadout.bulletVelocity
      ) {
        lastGroup.loadoutNames.push(entry.loadout.name);
      } else {
        grouped.push({
          id: entry.id,
          name: entry.name,
          category: entry.category,
          fireRate: entry.fireRate,
          bulletVelocity: entry.loadout.bulletVelocity,
          dps: entry.dps,
          ttk: entry.ttk,
          loadoutNames: [entry.loadout.name],
        });
      }
    }

    return grouped;
  }, [weapons, distance, selectedCategories]);

  return (
    <div>
      <div className="mb-8 bg-white border rounded-lg p-6">
        <div className="mb-6">
          <span className="text-lg font-semibold text-gray-900 block mb-3">
            Category Filter
          </span>
          <div className="flex flex-wrap gap-4">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.has(category.id)}
                  onChange={() => toggleCategory(category.id)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-900">{category.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t pt-6">
          <label className="block mb-4">
            <span className="text-lg font-semibold text-gray-900">
              Distance: {distance}m
            </span>
          </label>
          <input
            type="range"
            min="0"
            max={maxDistance}
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-gray-900 mt-2">
            <span>0m</span>
            <span>{maxDistance}m</span>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Weapon
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Barrel
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Fire Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Bullet Velocity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                DPS
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                TTK (ms)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rankedWeapons.map((entry, index) => (
              <tr key={`${entry.id}-${index}`} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/weapons/${entry.id}`}
                    className="text-blue-500 hover:text-blue-600 font-medium"
                  >
                    {entry.name}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {entry.loadoutNames.join(", ")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {entry.category.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {entry.fireRate} RPM
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {entry.bulletVelocity} m/s
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {entry.dps.toFixed(1)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {entry.ttk.toFixed(0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
