import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface WeaponData {
  name: string;
  category: string;
  bulletVelocity: number;
  rpm: number;
  magazine: number;
  reloadSpeed: number;
  damages: Array<{ distance: number; damage: number }>;
}

function parseWeaponsFile(filePath: string): WeaponData[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  const weapons: WeaponData[] = [];
  let currentWeapon: Partial<WeaponData> | null = null;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed.startsWith('###')) {
      if (currentWeapon && currentWeapon.name && currentWeapon.category) {
        weapons.push(currentWeapon as WeaponData);
      }
      currentWeapon = {
        name: trimmed.replace('###', '').trim(),
        damages: []
      };
    } else if (currentWeapon) {
      if (trimmed.startsWith('Category:')) {
        currentWeapon.category = trimmed.replace('Category:', '').trim();
      } else if (trimmed.startsWith('Bullet Velocity:')) {
        currentWeapon.bulletVelocity = parseFloat(trimmed.match(/[\d.]+/)?.[0] || '0');
      } else if (trimmed.startsWith('RPM:')) {
        currentWeapon.rpm = parseInt(trimmed.match(/\d+/)?.[0] || '0');
      } else if (trimmed.startsWith('Magazine Size:')) {
        currentWeapon.magazine = parseInt(trimmed.match(/\d+/)?.[0] || '0');
      } else if (trimmed.startsWith('Reload Speed:')) {
        currentWeapon.reloadSpeed = parseFloat(trimmed.match(/[\d.]+/)?.[0] || '0');
      } else if (trimmed.match(/^\d+-\d+m:|^\d+m\+:/)) {
        const distanceMatch = trimmed.match(/^(\d+)-?(\d+)?m/);
        const damageMatch = trimmed.match(/(\d+)\s+damage/);
        
        if (distanceMatch && damageMatch) {
          const distance = parseInt(distanceMatch[1]);
          const damage = parseInt(damageMatch[1]);
          currentWeapon.damages?.push({ distance, damage });
        }
      }
    }
  }
  
  if (currentWeapon && currentWeapon.name && currentWeapon.category) {
    weapons.push(currentWeapon as WeaponData);
  }
  
  return weapons;
}

async function main() {
  const weaponsFilePath = path.join(__dirname, '..', 'weapons.txt');
  const weaponsData = parseWeaponsFile(weaponsFilePath);
  
  console.log(`Parsed ${weaponsData.length} weapons from weapons.txt`);
  
  for (const weaponData of weaponsData) {
    console.log(`Processing ${weaponData.name}...`);
    
    let category = await prisma.weaponCategory.findUnique({
      where: { name: weaponData.category }
    });
    
    if (!category) {
      category = await prisma.weaponCategory.create({
        data: { name: weaponData.category }
      });
      console.log(`  Created category: ${weaponData.category}`);
    }
    
    const weapon = await prisma.weapon.upsert({
      where: { name: weaponData.name },
      update: {
        categoryId: category.id,
        fireRate: weaponData.rpm,
        magazine: weaponData.magazine,
        reloadTime: weaponData.reloadSpeed,
        bulletVelocity: weaponData.bulletVelocity,
      },
      create: {
        name: weaponData.name,
        categoryId: category.id,
        fireRate: weaponData.rpm,
        magazine: weaponData.magazine,
        reloadTime: weaponData.reloadSpeed,
        bulletVelocity: weaponData.bulletVelocity,
      }
    });
    
    console.log(`  Upserted weapon: ${weapon.name}`);
    
    for (const damageData of weaponData.damages) {
      await prisma.damage.upsert({
        where: {
          weaponId_distance: {
            weaponId: weapon.id,
            distance: damageData.distance
          }
        },
        update: {
          damage: damageData.damage
        },
        create: {
          weaponId: weapon.id,
          distance: damageData.distance,
          damage: damageData.damage
        }
      });
    }
    
    if (weaponData.damages.length > 0) {
      console.log(`  Added ${weaponData.damages.length} damage entries`);
    }
  }
  
  console.log('Import completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
