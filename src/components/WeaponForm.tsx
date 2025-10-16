"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface DamageEntry {
  id?: number;
  distance: number;
  damage: number;
}

interface LoadoutEntry {
  id?: number;
  name: string;
  bulletVelocity: number;
}

interface WeaponCategory {
  id: number;
  name: string;
}

interface WeaponFormProps {
  mode: "create" | "edit";
  weaponId?: string;
}

export default function WeaponForm({ mode, weaponId }: WeaponFormProps) {
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
  const [loadouts, setLoadouts] = useState<LoadoutEntry[]>([
    { name: "", bulletVelocity: 0 },
  ]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(mode === "edit");

  useEffect(() => {
    if (mode === "edit" && weaponId) {
      Promise.all([
        fetch("/api/weapons?type=categories").then((res) => res.json()),
        fetch(`/api/weapons/${weaponId}`).then((res) => res.json()),
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
            setLoadouts(
              weaponData.loadouts || [{ name: "", bulletVelocity: 0 }],
            );
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setInitialLoading(false));
    } else {
      fetch("/api/weapons?type=categories")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setCategories(data);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [mode, weaponId]);

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

  const addLoadoutEntry = () => {
    setLoadouts([...loadouts, { name: "", bulletVelocity: 0 }]);
  };

  const removeLoadoutEntry = (index: number) => {
    setLoadouts(loadouts.filter((_, i) => i !== index));
  };

  const updateLoadoutEntry = (
    index: number,
    field: "name" | "bulletVelocity",
    value: string | number,
  ) => {
    const newLoadouts = [...loadouts];
    newLoadouts[index][field] = value as never;
    setLoadouts(newLoadouts);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const selectedCategory = categories.find(
      (c) => c.id === parseInt(categoryId),
    );

    const requestBody = {
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
      loadouts: loadouts.map((l) => ({
        id: l.id,
        name: l.name,
        bulletVelocity: l.bulletVelocity,
      })),
    };

    try {
      const url =
        mode === "create" ? "/api/weapons" : `/api/weapons/${weaponId}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const redirectPath = mode === "create" ? "/" : `/weapons/${weaponId}`;
        router.push(redirectPath);
        router.refresh();
      } else {
        alert(`Failed to ${mode} weapon`);
      }
    } catch (error) {
      console.error(error);
      alert(`Error ${mode === "create" ? "creating" : "updating"} weapon`);
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

  const title = mode === "create" ? "Add New Weapon" : "Edit Weapon";
  const submitButtonText = loading
    ? mode === "create"
      ? "Creating..."
      : "Updating..."
    : mode === "create"
      ? "Create Weapon"
      : "Update Weapon";
  const cancelPath = mode === "create" ? "/" : `/weapons/${weaponId}`;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{title}</h1>

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

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Loadouts</h2>
              <button
                type="button"
                onClick={addLoadoutEntry}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                + Add Loadout
              </button>
            </div>

            {loadouts.map((entry, index) => (
              <div key={index} className="flex gap-4 mb-3">
                <div className="flex-1">
                  <label className="block mb-1 text-sm font-medium">
                    Loadout Name
                  </label>
                  <input
                    type="text"
                    value={entry.name}
                    onChange={(e) =>
                      updateLoadoutEntry(index, "name", e.target.value)
                    }
                    placeholder="Loadout Name"
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-1 text-sm font-medium">
                    Bullet Velocity (m/s)
                  </label>
                  <input
                    type="number"
                    value={entry.bulletVelocity}
                    onChange={(e) =>
                      updateLoadoutEntry(
                        index,
                        "bulletVelocity",
                        parseFloat(e.target.value),
                      )
                    }
                    placeholder="Bullet Velocity"
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
                {loadouts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLoadoutEntry(index)}
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
              {submitButtonText}
            </button>
            <button
              type="button"
              onClick={() => router.push(cancelPath)}
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
