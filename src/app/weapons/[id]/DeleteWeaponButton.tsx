"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteWeaponButton({
  weaponId,
  weaponName,
}: {
  weaponId: number;
  weaponName: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(`Delete ${weaponName}?`);

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/weapons/${weaponId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        alert("Failed to delete weapon");
        return;
      }

      router.push("/");
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-300"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}
