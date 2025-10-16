import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ALLOWED_DISCORD_ID } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import NewWeaponForm from "./NewWeaponForm";

export default async function NewWeaponPage() {
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
            You don&apos;t have permission to add weapons.
          </p>
        </div>
      </div>
    );
  }

  const categories = await prisma.weaponCategory.findMany({
    orderBy: { name: "asc" },
  });

  return <NewWeaponForm categories={categories} />;
}
