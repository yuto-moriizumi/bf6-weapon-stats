"use client";

import { useRouter } from "next/navigation";
import WeaponForm from "@/components/WeaponForm";

interface WeaponFormData {
  name: string;
  categoryId: number;
  fireRate: number;
  magazine: number;
  reloadTime: number;
  damages: { id?: number; distance: number; damage: number }[];
  loadouts: { id?: number; name: string; bulletVelocity: number }[];
}

export default function NewWeaponForm() {
  const router = useRouter();

  const handleSubmit = async (data: WeaponFormData) => {
    const response = await fetch("/api/weapons", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      router.push("/");
      router.refresh();
    } else {
      alert("Failed to create weapon");
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Add New Weapon</h1>
        <WeaponForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
