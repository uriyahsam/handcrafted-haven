import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const seller = await prisma.sellerProfile.findUnique({
    where: { userId: id },
    include: {
      user: { select: { id: true, name: true, email: true, createdAt: true } },
      products: {
        where: { status: 'ACTIVE' },
        include: {
          category: true,
          reviews: { select: { rating: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!seller) return NextResponse.json({ error: 'Seller not found' }, { status: 404 })
  return NextResponse.json(seller)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  if (session.user.id !== id && session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { shopName, bio, location, website, avatar, banner } = await req.json()

  const profile = await prisma.sellerProfile.upsert({
    where: { userId: id },
    update: { shopName, bio, location, website, avatar, banner },
    create: { userId: id, shopName, bio, location, website, avatar, banner },
  })

  return NextResponse.json(profile)
}
