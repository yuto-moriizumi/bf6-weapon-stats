import { auth } from "@/auth";
import { redirect } from "next/navigation";
import EditWeaponForm from "./EditWeaponForm";
import { ALLOWED_DISCORD_ID } from "@/lib/constants";

export default async function EditWeaponPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  if (session.user?.discordId !== ALLOWED_DISCORD_ID) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600">
            You don&apos;t have permission to edit weapons.
          </p>
        </div>
      </div>
    );
  }

  const { id } = await params;

  return <EditWeaponForm weaponId={id} />;
}
