import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

// GET /api/orders — returns orders for the current user (buyer or seller)
export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const role = searchParams.get('role') // 'buyer' | 'seller'

  try {
    const where =
      role === 'seller'
        ? { sellerId: session.user.id }
        : { buyerId: session.user.id }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        product: { select: { id: true, title: true, images: true } },
        buyer:   { select: { id: true, name: true, email: true } },
        seller:  { select: { id: true, name: true } },
      },
    })
    return NextResponse.json({ orders })
  } catch (err) {
    console.error('[GET /api/orders]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// POST /api/orders — place a new order
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { productId, quantity, paymentName, paymentEmail, paymentAddress, paymentCity, paymentCardLast } = body

    if (!productId || !paymentName || !paymentEmail || !paymentAddress || !paymentCity || !paymentCardLast) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

    const qty = quantity || 1
    const totalPrice = Number(product.price) * qty

    const order = await prisma.order.create({
      data: {
        buyerId: session.user.id,
        sellerId: product.sellerId,
        productId,
        quantity: qty,
        totalPrice,
        status: 'PENDING',
        paymentName,
        paymentEmail,
        paymentAddress,
        paymentCity,
        paymentCardLast,
      },
      include: {
        product: { select: { id: true, title: true, images: true } },
      },
    })

    return NextResponse.json({ order }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/orders]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
