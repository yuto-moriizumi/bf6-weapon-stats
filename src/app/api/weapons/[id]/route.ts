import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const weapon = await prisma.weapon.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        damages: {
          orderBy: {
            distance: "asc",
          },
        },
        loadouts: {
          orderBy: {
            name: "asc",
          },
        },
      },
    });

    if (!weapon) {
      return NextResponse.json({ error: "Weapon not found" }, { status: 404 });
    }

    return NextResponse.json(weapon);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch weapon" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      categoryId,
      fireRate,
      magazine,
      reloadTime,
      damages,
      loadouts,
    } = body;

    await prisma.damage.deleteMany({
      where: {
        weaponId: parseInt(id),
      },
    });

    await prisma.loadout.deleteMany({
      where: {
        weaponId: parseInt(id),
      },
    });

    const weapon = await prisma.weapon.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
        categoryId,
        fireRate,
        magazine,
        reloadTime,
        damages: {
          create: damages.map((d: { distance: number; damage: number }) => ({
            distance: d.distance,
            damage: d.damage,
          })),
        },
        loadouts: {
          create: loadouts.map(
            (l: { name: string; bulletVelocity: number }) => ({
              name: l.name,
              bulletVelocity: l.bulletVelocity,
            }),
          ),
        },
      },
      include: {
        damages: true,
        loadouts: true,
      },
    });

    revalidatePath("/");
    revalidatePath(`/weapons/${id}`);

    return NextResponse.json(weapon);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update weapon" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await prisma.weapon.delete({
      where: {
        id: parseInt(id),
      },
    });

    revalidatePath("/");
    revalidatePath(`/weapons/${id}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete weapon" },
      { status: 500 },
    );
  }
}
