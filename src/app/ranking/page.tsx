import { prisma } from '@/lib/prisma'
import RankingTable from './RankingTable'
import Link from 'next/link'

async function getWeaponsWithDamages() {
  const weapons = await prisma.weapon.findMany({
    include: {
      damages: {
        orderBy: {
          distance: 'asc'
        }
      },
      category: true
    }
  })
  return weapons
}

export default async function RankingPage() {
  const weapons = await getWeaponsWithDamages()

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <Link 
          href="/"
          className="text-blue-500 hover:text-blue-600 mb-4 inline-block"
        >
          ← Back to List
        </Link>

        <h1 className="text-4xl font-bold mb-8">Weapon Rankings by DPS</h1>
        
        <RankingTable weapons={weapons} />
      </div>
    </div>
  )
}
