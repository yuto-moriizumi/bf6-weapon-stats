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

export default function EditWeaponForm({
  weaponId,
  weapon,
}: {
  weaponId: string;
  weapon: Weapon;
}) {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Weapon</h1>
        <WeaponForm
          mode="edit"
          weaponId={weaponId}
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
