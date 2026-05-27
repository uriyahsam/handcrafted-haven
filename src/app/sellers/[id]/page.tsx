'use client'
import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { ProductCard } from '@/components/products/ProductCard'
import styles from './page.module.css'

interface SellerProfile {
  id: string
  userId: string
  shopName: string
  bio: string | null
  avatar: string | null
  banner: string | null
  location: string | null
  website: string | null
  user: { id: string; name: string | null; createdAt: string }
  products: Array<{
    id: string
    title: string
    price: number
    images: string[]
    category: { name: string; slug: string }
    reviews: { rating: number }[]
  }>
}

export default function SellerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [seller, setSeller] = useState<SellerProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/sellers/${id}`)
      .then((r) => r.json())
      .then((d) => { setSeller(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="container" style={{ padding: '60px 16px' }}>
      <div className="skeleton" style={{ height: 300 }} aria-busy="true" aria-label="Loading seller profile" />
    </div>
  )

  if (!seller || seller.id === undefined) return (
    <div className="container" style={{ padding: '60px 16px', textAlign: 'center' }}>
      <h1>Seller not found</h1>
      <Link href="/sellers" className="btn btn-primary" style={{ marginTop: 16 }}>Browse Sellers</Link>
    </div>
  )

  const enrichedProducts = seller.products.map((p) => ({
    ...p,
    avgRating: p.reviews.length > 0 ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length : null,
    reviewCount: p.reviews.length,
    sellerProfile: { shopName: seller.shopName },
  }))

  return (
    <>
      {/* Banner */}
      <div
        className={styles.banner}
        style={{ background: seller.banner ? `url(${seller.banner}) center/cover` : 'linear-gradient(135deg, var(--color-espresso), #5c3d2a)' }}
        aria-hidden="true"
      />

      <div className="container" style={{ padding: '0 16px 80px' }}>
        {/* Profile Header */}
        <div className={styles.profileHeader}>
          <div className={styles.avatar} aria-hidden="true">
            {seller.avatar
              ? <img src={seller.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              : seller.shopName[0].toUpperCase()}
          </div>
          <div className={styles.profileInfo}>
            <h1 className={styles.shopName}>{seller.shopName}</h1>
            <p className={styles.sellerName}>by {seller.user.name || 'Artisan'}</p>
            {seller.location && <p className={styles.meta}>📍 {seller.location}</p>}
            <p className={styles.meta}>🗓 Member since {new Date(seller.user.createdAt).getFullYear()}</p>
            {seller.website && (
              <a href={seller.website} target="_blank" rel="noopener noreferrer" className={styles.website}>
                🔗 {seller.website}
              </a>
            )}
          </div>
        </div>

        {seller.bio && (
          <div className={styles.bio}>
            <h2>About the Artisan</h2>
            <p>{seller.bio}</p>
          </div>
        )}

        {/* Products */}
        <section aria-labelledby="products-heading">
          <h2 id="products-heading" style={{ fontSize: '1.5rem', marginBottom: 24, marginTop: 48 }}>
            Products ({seller.products.length})
          </h2>
          {enrichedProducts.length === 0 ? (
            <p style={{ color: 'var(--color-gray-500)' }}>No products listed yet.</p>
          ) : (
            <div className="product-grid">
              {enrichedProducts.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  )
}
