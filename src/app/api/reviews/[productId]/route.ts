import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { productId } = await params
  const { rating, comment } = await req.json()

  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Rating must be 1-5' }, { status: 400 })
  }

  try {
    const review = await prisma.review.upsert({
      where: { userId_productId: { userId: session.user.id, productId } },
      update: { rating, comment },
      create: { rating, comment, userId: session.user.id, productId },
      include: { user: { select: { id: true, name: true, image: true } } },
    })
    return NextResponse.json(review, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params
  const reviews = await prisma.review.findMany({
    where: { productId },
    include: { user: { select: { id: true, name: true, image: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(reviews)
}
