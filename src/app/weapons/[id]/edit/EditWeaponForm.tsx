"use client";

import { useRouter } from "next/navigation";
import WeaponForm from "@/components/WeaponForm";

interface Weapon {
  id: number;
  name: string;
  categoryId: number;
  fireRate: number;
  magazine: number;
  reloadTime: number;
  damages: Array<{
    id: number;
    distance: number;
    damage: number;
  }>;
  loadouts: Array<{
    id: number;
    name: string;
    bulletVelocity: number;
  }>;
}

interface WeaponFormData {
  name: string;
  categoryId: number;
  fireRate: number;
  magazine: number;
  reloadTime: number;
  damages: { id?: number; distance: number; damage: number }[];
  loadouts: { id?: number; name: string; bulletVelocity: number }[];
}

export default function EditWeaponForm({
  weaponId,
  weapon,
}: {
  weaponId: string;
  weapon: Weapon;
}) {
  const router = useRouter();

  const handleSubmit = async (data: WeaponFormData) => {
    const response = await fetch(`/api/weapons/${weaponId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      router.push(`/weapons/${weaponId}`);
      router.refresh();
    } else {
      alert("Failed to update weapon");
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Weapon</h1>
        <WeaponForm
          onSubmit={handleSubmit}
          initialData={{
            name: weapon.name,
            categoryId: weapon.categoryId,
            fireRate: weapon.fireRate,
            magazine: weapon.magazine,
            reloadTime: weapon.reloadTime,
            damages: weapon.damages,
            loadouts: weapon.loadouts,
          }}
        />
      </div>
    </div>
  );
}
