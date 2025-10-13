import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const damageData = [
  {
    name: 'NVO-228E',
    damages: [
      { distance: 0, damage: 33 },
      { distance: 10, damage: 27 },
      { distance: 35, damage: 21 },
      { distance: 50, damage: 20 }
    ]
  },
  {
    name: 'B36A4',
    damages: [
      { distance: 0, damage: 25 },
      { distance: 35, damage: 20 }
    ]
  },
  {
    name: 'M433',
    damages: [
      { distance: 0, damage: 25 },
      { distance: 20, damage: 20 }
    ]
  },
  {
    name: 'KORD 6P67',
    damages: [
      { distance: 0, damage: 20 }
    ]
  },
  {
    name: 'SOR-556 MK2',
    damages: [
      { distance: 0, damage: 25 }
    ]
  },
  {
    name: 'L85A3',
    damages: [
      { distance: 0, damage: 25 }
    ]
  },
  {
    name: 'TR-7',
    damages: [
      { distance: 0, damage: 33 }
    ]
  },
  {
    name: 'AK4D',
    damages: [
      { distance: 0, damage: 33 }
    ]
  }
];

async function main() {
  console.log('Starting damage data update for Assault Rifles...');

  for (const weaponData of damageData) {
    const weapon = await prisma.weapon.findUnique({
      where: { name: weaponData.name }
    });

    if (!weapon) {
      console.log(`Weapon ${weaponData.name} not found, skipping...`);
      continue;
    }

    console.log(`Updating damages for ${weaponData.name}...`);

    for (const dmg of weaponData.damages) {
      await prisma.damage.upsert({
        where: {
          weaponId_distance: {
            weaponId: weapon.id,
            distance: dmg.distance
          }
        },
        update: {
          damage: dmg.damage
        },
        create: {
          weaponId: weapon.id,
          distance: dmg.distance,
          damage: dmg.damage
        }
      });
    }

    console.log(`✓ Updated ${weaponData.damages.length} damage entries for ${weaponData.name}`);
  }

  console.log('\nDamage data update completed!');
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
