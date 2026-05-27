import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const sellers = await prisma.sellerProfile.findMany({
    include: {
      user: { select: { id: true, name: true } },
      products: {
        where: { status: 'ACTIVE' },
        select: { id: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(sellers)
}
