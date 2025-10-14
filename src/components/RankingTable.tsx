"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { calculateTTK } from "@/lib/ttk";

type Damage = {
  distance: number;
  damage: number;
};

type Weapon = {
  id: number;
  name: string;
  fireRate: number;
  magazine: number;
  reloadTime: number;
  bulletVelocity: number;
  damages: Damage[];
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

function calculateWeaponTTK(weapon: Weapon, distance: number): number {
  return calculateTTK(
    weapon.damages,
    distance,
    weapon.bulletVelocity,
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
    return weapons
      .filter((weapon) => selectedCategories.has(weapon.category.id))
      .map((weapon) => ({
        ...weapon,
        dps: calculateDPS(weapon, distance),
        ttk: calculateWeaponTTK(weapon, distance),
      }))
      .sort((a, b) => a.ttk - b.ttk);
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
            {rankedWeapons.map((weapon, index) => (
              <tr key={weapon.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/weapons/${weapon.id}`}
                    className="text-blue-500 hover:text-blue-600 font-medium"
                  >
                    {weapon.name}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {weapon.category.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {weapon.fireRate} RPM
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {weapon.bulletVelocity} m/s
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {weapon.dps.toFixed(1)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {weapon.ttk.toFixed(0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
