"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface DamageEntry {
  id?: number;
  distance: number;
  damage: number;
}

interface WeaponCategory {
  id: number;
  name: string;
}

export default function EditWeaponPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return null;
  const { id } = use(params);
  const router = useRouter();
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<WeaponCategory[]>([]);
  const [fireRate, setFireRate] = useState("");
  const [magazine, setMagazine] = useState("");
  const [reloadTime, setReloadTime] = useState("");
  const [damages, setDamages] = useState<DamageEntry[]>([
    { distance: 0, damage: 0 },
  ]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/weapons?type=categories").then((res) => res.json()),
      fetch(`/api/weapons/${id}`).then((res) => res.json()),
    ])
      .then(([categoriesData, weaponData]) => {
        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        }
        if (weaponData) {
          setName(weaponData.name);
          setCategoryId(weaponData.categoryId.toString());
          setFireRate(weaponData.fireRate.toString());
          setMagazine(weaponData.magazine.toString());
          setReloadTime(weaponData.reloadTime.toString());
          setDamages(weaponData.damages || [{ distance: 0, damage: 0 }]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setInitialLoading(false));
  }, [id]);

  const addDamageEntry = () => {
    setDamages([...damages, { distance: 0, damage: 0 }]);
  };

  const removeDamageEntry = (index: number) => {
    setDamages(damages.filter((_, i) => i !== index));
  };

  const updateDamageEntry = (
    index: number,
    field: "distance" | "damage",
    value: number,
  ) => {
    const newDamages = [...damages];
    newDamages[index][field] = value;
    setDamages(newDamages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const selectedCategory = categories.find(
      (c) => c.id === parseInt(categoryId),
    );

    try {
      const response = await fetch(`/api/weapons/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          type: selectedCategory?.name || "",
          categoryId: parseInt(categoryId),
          fireRate: parseInt(fireRate),
          magazine: parseInt(magazine),
          reloadTime: parseFloat(reloadTime),
          damages: damages.map((d) => ({
            id: d.id,
            distance: d.distance,
            damage: d.damage,
          })),
        }),
      });

      if (response.ok) {
        router.push(`/weapons/${id}`);
        router.refresh();
      } else {
        alert("Failed to update weapon");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating weapon");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Weapon</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-medium">Weapon Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block mb-2 font-medium">Fire Rate (RPM)</label>
              <input
                type="number"
                value={fireRate}
                onChange={(e) => setFireRate(e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Magazine</label>
              <input
                type="number"
                value={magazine}
                onChange={(e) => setMagazine(e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Reload Time (s)</label>
              <input
                type="number"
                step="0.1"
                value={reloadTime}
                onChange={(e) => setReloadTime(e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Damage by Distance</h2>
              <button
                type="button"
                onClick={addDamageEntry}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                + Add Distance
              </button>
            </div>

            {damages.map((entry, index) => (
              <div key={index} className="flex gap-4 mb-3">
                <div className="flex-1">
                  <label className="block mb-1 text-sm font-medium">
                    Distance (m)
                  </label>
                  <input
                    type="number"
                    value={entry.distance}
                    onChange={(e) =>
                      updateDamageEntry(
                        index,
                        "distance",
                        parseInt(e.target.value),
                      )
                    }
                    placeholder="Distance (m)"
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-1 text-sm font-medium">
                    Damage
                  </label>
                  <input
                    type="number"
                    value={entry.damage}
                    onChange={(e) =>
                      updateDamageEntry(
                        index,
                        "damage",
                        parseInt(e.target.value),
                      )
                    }
                    placeholder="Damage"
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
                {damages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDamageEntry(index)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Weapon"}
            </button>
            <button
              type="button"
              onClick={() => router.push(`/weapons/${id}`)}
              className="px-6 py-3 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
