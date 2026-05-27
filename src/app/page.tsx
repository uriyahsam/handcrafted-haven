import Link from 'next/link'
import styles from './page.module.css'
import { FeaturedProducts } from './FeaturedProducts'

// Static demo data — in a real build these would be fetched from the DB.
// Using static data here so the page renders at build time with no DB calls,
// which keeps the home page fast and avoids any SSR issues.

const CATEGORIES = [
  { name: 'Jewelry',    slug: 'jewelry',   icon: '💍', count: '1,240' },
  { name: 'Pottery',    slug: 'ceramics',  icon: '🏺', count: '876'   },
  { name: 'Textiles',   slug: 'textiles',  icon: '🧵', count: '2,100' },
  { name: 'Woodwork',   slug: 'woodwork',  icon: '🪵', count: '543'   },
  { name: 'Candles',    slug: 'candles',   icon: '🕯️', count: '389'   },
  { name: 'Art & Prints',slug: 'paintings',icon: '🎨', count: '754'   },
]

const FEATURED_PRODUCTS = [
  { id: '1', label: '-15%', labelType: 'sale', seller: 'ArtisanCraft Co.', title: 'Hand-Thrown Ceramic Mug', price: '$28.00', oldPrice: '$33.00', rating: 4, img: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&q=80' },
  { id: '2', label: 'New',  labelType: 'new',  seller: 'WeavingWonders',   title: 'Macramé Wall Hanging',  price: '$54.00', oldPrice: null,    rating: 5, img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
  { id: '3', label: null,   labelType: null,   seller: 'WoodWhisper',      title: 'Reclaimed Oak Cutting Board', price: '$72.00', oldPrice: null, rating: 4, img: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&q=80' },
  { id: '4', label: '-20%', labelType: 'sale', seller: 'GlowCraft Studio', title: 'Soy Wax Candle Set (3pk)', price: '$36.00', oldPrice: '$45.00', rating: 5, img: 'https://images.unsplash.com/photo-1602928309714-ea1b1d13f5f1?w=400&q=80' },
]

const ARTISANS = [
  { initials: 'MJ', name: 'Maya Johnson',   specialty: 'Ceramics & Pottery',  items: 128, rating: 4.9, sales: 340, color: '#C0522B' },
  { initials: 'RP', name: 'Rafael Pinto',   specialty: 'Woodwork & Carving',  items: 64,  rating: 5.0, sales: 210, color: '#8B4513' },
  { initials: 'SL', name: 'Sophia Lee',     specialty: 'Jewelry & Metalwork', items: 205, rating: 4.8, sales: 580, color: '#b5860d' },
  { initials: 'AT', name: 'Amara Tesfaye',  specialty: 'Textiles & Weaving',  items: 87,  rating: 4.9, sales: 175, color: '#4a7c59' },
]

const REVIEWS = [
  { initials: 'TC', name: 'Tamar Cohen',   time: '3 days ago',  rating: 5, text: 'Absolutely stunning craftsmanship. The mug arrived perfectly packaged and it\'s even more beautiful in person. Will definitely buy again!', product: 'Hand-Thrown Ceramic Mug by ArtisanCraft Co.' },
  { initials: 'BM', name: 'Brandon Mills', time: '1 week ago',  rating: 5, text: 'Great quality macramé piece. Fast shipping and the seller was very responsive when I had a question. The texture and color are exactly as shown.', product: 'Macramé Wall Hanging by WeavingWonders' },
  { initials: 'KO', name: 'Keiko Ogawa',   time: '2 weeks ago', rating: 5, text: 'The cutting board is a work of art. I genuinely feel bad using it in the kitchen! The wood grain is gorgeous. Worth every penny.', product: 'Reclaimed Oak Cutting Board by WoodWhisper' },
]

function StarRow({ rating }: { rating: number }) {
  return (
    <span className={styles.starRow} aria-label={`${rating} out of 5 stars`}>
      {[1,2,3,4,5].map(i => (
        <span key={i} className={i <= rating ? styles.starFilled : styles.starEmpty} aria-hidden="true">★</span>
      ))}
    </span>
  )
}

export default function HomePage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className={styles.hero} aria-label="Hero">
        <div className={`${styles.heroInner} container`}>
          {/* Left copy */}
          <div className={styles.heroCopy}>
            <span className={styles.heroBadge}>✦ New arrivals this week</span>
            <h1 className={styles.heroTitle}>
              Discover <span className={styles.heroAccent}>Unique</span><br />
              Handcrafted Treasures
            </h1>
            <p className={styles.heroSub}>
              Support independent artisans and find one-of-a-kind handmade pieces
              crafted with love, skill, and authentic materials.
            </p>
            <div className={styles.heroBtns}>
              <Link href="/shop" className="btn btn-primary" style={{ padding: '13px 28px', fontSize: '1rem' }}>
                Shop Now
              </Link>
              <Link href="/sellers" className={styles.btnOutlineLight} style={{ padding: '13px 28px', fontSize: '1rem' }}>
                Meet Our Artisans
              </Link>
            </div>
            <div className={styles.heroStats} aria-label="Site statistics">
              <div className={styles.heroStat}>
                <strong>2,400+</strong><span>Artisans</span>
              </div>
              <div className={styles.heroStatDivider} aria-hidden="true" />
              <div className={styles.heroStat}>
                <strong>18,000+</strong><span>Products</span>
              </div>
              <div className={styles.heroStatDivider} aria-hidden="true" />
              <div className={styles.heroStat}>
                <strong>4.9★</strong><span>Avg Rating</span>
              </div>
            </div>
          </div>

          {/* Right image mosaic (desktop) */}
          <div className={styles.heroMosaic} aria-hidden="true">
            <div className={styles.heroMosaicMain}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" alt="" className={styles.heroMosaicImg} />
            </div>
            <div className={styles.heroMosaicStack}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=300&q=80" alt="" className={styles.heroMosaicImg} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1517705008128-361805f42e86?w=300&q=80" alt="" className={styles.heroMosaicImg} />
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────── */}
      <section className={styles.categoriesSection} aria-labelledby="cat-heading">
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 id="cat-heading" className={styles.sectionTitle}>
              Shop by <span className={styles.accent}>Category</span>
            </h2>
            <Link href="/shop" className={styles.seeAll}>See all categories →</Link>
          </div>
          <div className={styles.categoryGrid} role="list">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/shop?category=${cat.slug}`}
                className={styles.categoryCard}
                role="listitem"
                aria-label={`Browse ${cat.name}`}
              >
                <span className={styles.categoryIcon} aria-hidden="true">{cat.icon}</span>
                <span className={styles.categoryName}>{cat.name}</span>
                <span className={styles.categoryCount}>{cat.count} items</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────────────── */}
      <FeaturedProducts />

      {/* ── MEET OUR ARTISANS ────────────────────────────── */}
      <section className={styles.artisansSection} aria-labelledby="artisan-heading">
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 id="artisan-heading" className={styles.sectionTitle}>
              Meet Our <span className={styles.accent}>Artisans</span>
            </h2>
            <Link href="/sellers" className={styles.seeAll}>View all sellers →</Link>
          </div>

          <div className={styles.artisanGrid} role="list">
            {ARTISANS.map((a) => (
              <div key={a.name} className={styles.artisanCard} role="listitem">
                <div
                  className={styles.artisanAvatar}
                  style={{ background: a.color }}
                  aria-hidden="true"
                >
                  {a.initials}
                </div>
                <h3 className={styles.artisanName}>{a.name}</h3>
                <p className={styles.artisanSpecialty}>{a.specialty}</p>
                <div className={styles.artisanStats}>
                  <span><strong>{a.items}</strong> Items</span>
                  <span><strong>{a.rating}★</strong> Rating</span>
                  <span><strong>{a.sales}</strong> Sales</span>
                </div>
                <Link href="/sellers" className={styles.followBtn}>Follow Shop</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SELLER CTA BANNER ────────────────────────────── */}
      <section className={styles.sellerBanner} aria-label="Become a seller">
        <div className={`${styles.sellerBannerInner} container`}>
          <div className={styles.sellerBannerCopy}>
            <h2>
              Are you an artisan?{' '}
              <span className={styles.sellerBannerAccent}>Start selling</span>{' '}
              on Handcrafted Haven
            </h2>
            <p>
              Join thousands of independent makers reaching customers who value
              handmade quality. Free to set up — we only earn when you do.
            </p>
          </div>
          <div className={styles.sellerBannerBtns}>
            <Link href="/register?role=SELLER" className="btn btn-primary" style={{ padding: '13px 28px', fontSize: '1rem', whiteSpace: 'nowrap' }}>
              Create Your Shop
            </Link>
            <Link href="/sellers" className={styles.btnOutlineDark} style={{ padding: '13px 28px', fontSize: '1rem', whiteSpace: 'nowrap' }}>
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* ── CUSTOMER REVIEWS ─────────────────────────────── */}
      <section className={styles.reviewsSection} aria-labelledby="reviews-heading">
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 id="reviews-heading" className={styles.sectionTitle}>
              Customer <span className={styles.accent}>Reviews</span>
            </h2>
            <Link href="/shop" className={styles.seeAll}>Read more reviews →</Link>
          </div>

          <div className={styles.reviewGrid} role="list">
            {REVIEWS.map((r) => (
              <article key={r.name} className={styles.reviewCard} role="listitem">
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewAvatar} aria-hidden="true">{r.initials}</div>
                  <div>
                    <p className={styles.reviewName}>{r.name}</p>
                    <p className={styles.reviewMeta}>Verified Buyer · {r.time}</p>
                  </div>
                </div>
                <StarRow rating={r.rating} />
                <p className={styles.reviewText}>{r.text}</p>
                <p className={styles.reviewProduct}>→ <em>{r.product}</em></p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
