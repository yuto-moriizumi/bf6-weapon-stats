import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (type === 'categories') {
      const categories = await prisma.weaponCategory.findMany({
        orderBy: {
          name: 'asc'
        }
      })
      return NextResponse.json(categories)
    }

    const weapons = await prisma.weapon.findMany({
      include: {
        damages: {
          orderBy: {
            distance: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(weapons)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch weapons' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, categoryId, fireRate, magazine, reloadTime, bulletVelocity, damages } = body

    const weapon = await prisma.weapon.create({
      data: {
        name,
        categoryId,
        fireRate,
        magazine,
        reloadTime,
        bulletVelocity: bulletVelocity || 0,
        damages: {
          create: damages
        }
      },
      include: {
        damages: true
      }
    })

    revalidatePath('/')

    return NextResponse.json(weapon, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create weapon' }, { status: 500 })
  }
}
