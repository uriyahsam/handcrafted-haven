import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const search   = searchParams.get('search')
    const sort     = searchParams.get('sort') || 'newest'
    const page     = parseInt(searchParams.get('page')  || '1')
    const limit    = parseInt(searchParams.get('limit') || '12')

    const where: Record<string, unknown> = { status: 'ACTIVE' }

    if (category) where.category = { slug: category }
    if (search)   where.title    = { contains: search, mode: 'insensitive' }
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) (where.price as Record<string, unknown>).gte = parseFloat(minPrice)
      if (maxPrice) (where.price as Record<string, unknown>).lte = parseFloat(maxPrice)
    }

    const orderBy: Record<string, string> =
      sort === 'price_asc'  ? { price: 'asc'  } :
      sort === 'price_desc' ? { price: 'desc' } :
      { createdAt: 'desc' }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category:      true,
          seller:        { select: { id: true, name: true } },
          sellerProfile: { select: { shopName: true, avatar: true } },
          reviews:       { select: { rating: true } },
        },
      }),
      prisma.product.count({ where }),
    ])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const enriched = (products as any[]).map((p: any) => ({
      ...p,
      avgRating:
        p.reviews.length > 0
          ? p.reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / p.reviews.length
          : null,
      reviewCount: p.reviews.length,
    }))

    return NextResponse.json({ products: enriched, total, pages: Math.ceil(total / limit) })
  } catch (err) {
    console.error('[GET /api/products]', err)
    return NextResponse.json(
      { error: 'Failed to load products. Please try again.', products: [], total: 0, pages: 1 },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.user.role !== 'SELLER' && session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Only sellers can create listings' }, { status: 403 })
  }

  try {
    const { title, description, price, images, categoryId, tags } = await req.json()

    if (!title || !description || !price || !categoryId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id },
    })

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price,
        images: images || [],
        categoryId,
        sellerId: session.user.id,
        sellerProfileId: sellerProfile?.id,
        tags: tags || [],
      },
      include: { category: true },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
