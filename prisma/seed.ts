// Load .env.local before anything else
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { loadEnvConfig } = require('@next/env')
loadEnvConfig(process.cwd())

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaPg } = require('@prisma/adapter-pg')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Pool } = require('pg')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const bcrypt = require('bcryptjs')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000,
  ssl: { rejectUnauthorized: false },
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')

  const categoryData = [
    { name: 'Jewelry',  slug: 'jewelry'  },
    { name: 'Ceramics', slug: 'ceramics' },
    { name: 'Textiles', slug: 'textiles' },
    { name: 'Woodwork', slug: 'woodwork' },
    { name: 'Candles',  slug: 'candles'  },
    { name: 'Paintings',slug: 'paintings'},
  ]

  const categories: Record<string, string> = {}
  for (const cat of categoryData) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug }, update: {}, create: cat,
    })
    categories[cat.slug] = c.id
  }
  console.log('✅ Categories seeded')

  const sellerPwd = await bcrypt.hash('password123', 12)
  const seller = await prisma.user.upsert({
    where: { email: 'artisan@handcraftedhaven.com' },
    update: {},
    create: { name: 'Emma Crafts', email: 'artisan@handcraftedhaven.com', password: sellerPwd, role: 'SELLER' },
  })
  const sellerProfile = await prisma.sellerProfile.upsert({
    where: { userId: seller.id },
    update: {},
    create: {
      userId: seller.id,
      shopName: "Emma's Artisan Studio",
      bio: 'Hello! I am Emma, a passionate ceramicist and jeweler based in Portland. I create unique handcrafted pieces inspired by the Pacific Northwest landscape.',
      location: 'Portland, OR',
    },
  })
  console.log('✅ Seller seeded')

  const buyerPwd = await bcrypt.hash('password123', 12)
  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@example.com' },
    update: {},
    create: { name: 'Alex Buyer', email: 'buyer@example.com', password: buyerPwd, role: 'BUYER' },
  })
  console.log('✅ Buyer seeded')

  const productsData = [
    { title: 'Hand-thrown Stoneware Mug', description: 'A beautifully hand-thrown stoneware mug, perfect for your morning coffee or tea. Each piece is unique with subtle variations in glaze. Microwave and dishwasher safe. Holds approximately 12oz.', price: 38.00, categorySlug: 'ceramics', images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600'], tags: ['mug','stoneware','pottery','kitchen'] },
    { title: 'Sterling Silver Leaf Earrings', description: 'Delicate sterling silver earrings inspired by autumn leaves. Hand-forged and hammered for a beautiful texture. Hypoallergenic sterling silver posts.', price: 65.00, categorySlug: 'jewelry', images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600'], tags: ['earrings','silver','leaf','nature'] },
    { title: 'Hand-woven Wool Throw Blanket', description: 'A luxuriously soft hand-woven throw blanket made from 100% merino wool. The earthy tones make it a perfect accent for any living room. Measures 50" x 60".', price: 145.00, categorySlug: 'textiles', images: ['https://images.unsplash.com/photo-1580500015958-2a27d2a23e97?w=600'], tags: ['blanket','wool','woven','home decor'] },
    { title: 'Live Edge Walnut Serving Board', description: 'A stunning live edge walnut serving board, hand-finished with food-safe mineral oil. Each board is unique, showcasing the natural beauty of the wood grain.', price: 89.00, categorySlug: 'woodwork', images: ['https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600'], tags: ['wood','walnut','serving board','kitchen'] },
    { title: 'Hand-poured Lavender Soy Candle', description: 'A calming hand-poured soy candle with pure lavender essential oil. Burns cleanly for up to 50 hours. Made with 100% natural soy wax and a cotton wick.', price: 24.00, categorySlug: 'candles', images: ['https://images.unsplash.com/photo-1602928309714-ea1b1d13f5f1?w=600'], tags: ['candle','lavender','soy','relaxation'] },
    { title: 'Watercolor Botanical Print', description: 'An original watercolor painting of Pacific Northwest botanicals. Painted on 140lb cold press paper. Unframed. Each painting is a one-of-a-kind original.', price: 120.00, categorySlug: 'paintings', images: ['https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600'], tags: ['watercolor','botanical','art','original'] },
  ]

  const created = []
  for (const p of productsData) {
    const product = await prisma.product.create({
      data: { title: p.title, description: p.description, price: p.price, images: p.images, tags: p.tags, categoryId: categories[p.categorySlug], sellerId: seller.id, sellerProfileId: sellerProfile.id, status: 'ACTIVE' },
    })
    created.push(product)
  }
  console.log('✅ Products seeded')

  const reviewTexts = [
    { rating: 5, comment: 'Absolutely love it! The quality is exceptional and it arrived beautifully packaged.' },
    { rating: 4, comment: 'Beautiful piece, exactly as described. Shipping was fast too!' },
    { rating: 5, comment: 'This is even more gorgeous in person. Will definitely order again.' },
  ]
  for (let i = 0; i < 3; i++) {
    await prisma.review.create({ data: { rating: reviewTexts[i].rating, comment: reviewTexts[i].comment, userId: buyer.id, productId: created[i].id } })
  }
  console.log('✅ Reviews seeded')

  console.log('\n🎉 Seed complete!')
  console.log('  Seller → artisan@handcraftedhaven.com / password123')
  console.log('  Buyer  → buyer@example.com / password123')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })

  // .finally(() => prisma.$disconnect())
