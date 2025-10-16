import WeaponForm from "@/components/WeaponForm";

export default function EditWeaponForm({ weaponId }: { weaponId: string }) {
  return <WeaponForm mode="edit" weaponId={weaponId} />;
}
