import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = [
    "Assault Rifle",
    "SMG",
    "Carbine",
    "DMR",
    "Sniper Rifle",
    "LMG",
    "Pistol",
    "Shotgun",
  ];

  for (const categoryName of categories) {
    await prisma.weaponCategory.upsert({
      where: { name: categoryName },
      update: {},
      create: { name: categoryName },
    });
  }

  const assaultRifle = await prisma.weaponCategory.findUnique({
    where: { name: "Assault Rifle" },
  });
  const sniperRifle = await prisma.weaponCategory.findUnique({
    where: { name: "Sniper Rifle" },
  });

  const akm = await prisma.weapon.create({
    data: {
      name: "AKM",
      categoryId: assaultRifle!.id,
      fireRate: 600,
      magazine: 30,
      reloadTime: 2.5,
      damages: {
        create: [
          { distance: 0, damage: 28 },
          { distance: 20, damage: 28 },
          { distance: 40, damage: 22 },
          { distance: 60, damage: 18 },
          { distance: 80, damage: 15 },
        ],
      },
      loadouts: {
        create: {
          name: "Default",
          bulletVelocity: 715,
        },
      },
    },
  });

  const m4a1 = await prisma.weapon.create({
    data: {
      name: "M4A1",
      categoryId: assaultRifle!.id,
      fireRate: 800,
      magazine: 30,
      reloadTime: 2.3,
      damages: {
        create: [
          { distance: 0, damage: 24 },
          { distance: 20, damage: 24 },
          { distance: 40, damage: 20 },
          { distance: 60, damage: 16 },
          { distance: 80, damage: 13 },
        ],
      },
      loadouts: {
        create: {
          name: "Default",
          bulletVelocity: 900,
        },
      },
    },
  });

  const awm = await prisma.weapon.create({
    data: {
      name: "AWM",
      categoryId: sniperRifle!.id,
      fireRate: 50,
      magazine: 5,
      reloadTime: 3.8,
      damages: {
        create: [
          { distance: 0, damage: 120 },
          { distance: 50, damage: 120 },
          { distance: 100, damage: 100 },
          { distance: 150, damage: 85 },
          { distance: 200, damage: 70 },
        ],
      },
      loadouts: {
        create: {
          name: "Default",
          bulletVelocity: 900,
        },
      },
    },
  });

  console.log({ akm, m4a1, awm });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
