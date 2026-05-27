import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category:      true,
        seller:        { select: { id: true, name: true, email: true } },
        sellerProfile: true,
        reviews: {
          include: { user: { select: { id: true, name: true, image: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const avgRating =
      product.reviews.length > 0
        ? product.reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / product.reviews.length
        : null

    return NextResponse.json({ ...product, avgRating, reviewCount: product.reviews.length })
  } catch (err) {
    console.error('[GET /api/products/[id]]', err)
    return NextResponse.json({ error: 'Failed to load product. Please try again.' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (product.sellerId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const data = await req.json()
    const updated = await prisma.product.update({ where: { id }, data })
    return NextResponse.json(updated)
  } catch (err) {
    console.error('[PUT /api/products/[id]]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (product.sellerId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/products/[id]]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
