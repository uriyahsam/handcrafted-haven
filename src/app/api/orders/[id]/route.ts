import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

// PATCH /api/orders/[id] — seller updates order status
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  try {
    const { status } = await req.json()
    const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Only the seller of this order can update it
    const order = await prisma.order.findUnique({ where: { id } })
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (order.sellerId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        product: { select: { id: true, title: true, images: true } },
        buyer:   { select: { id: true, name: true, email: true } },
      },
    })

    return NextResponse.json({ order: updated })
  } catch (err) {
    console.error('[PATCH /api/orders/[id]]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// GET /api/orders/[id] — get single order (buyer or seller)
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        product: { select: { id: true, title: true, images: true, price: true } },
        buyer:   { select: { id: true, name: true, email: true } },
        seller:  { select: { id: true, name: true } },
      },
    })

    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Only buyer or seller can view
    if (order.buyerId !== session.user.id && order.sellerId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({ order })
  } catch (err) {
    console.error('[GET /api/orders/[id]]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
