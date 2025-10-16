import WeaponForm from "@/components/WeaponForm";

export default function NewWeaponForm() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Add New Weapon</h1>
        <WeaponForm mode="create" />
      </div>
    </div>
  );
}
