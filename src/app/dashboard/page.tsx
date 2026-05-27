'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './page.module.css'

interface Product {
  id: string
  title: string
  price: number
  status: string
  images: string[]
  category: { name: string }
  reviews: { rating: number }[]
  createdAt: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [shopName, setShopName] = useState('')
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const [profileMsg, setProfileMsg] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated' && session?.user?.role !== 'SELLER' && session?.user?.role !== 'ADMIN') {
      router.push('/')
    }
  }, [status, session, router])

  useEffect(() => {
    if (!session?.user?.id) return

    // Load seller profile
    fetch(`/api/sellers/${session.user.id}`)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => {
        if (d) {
          setShopName(d.shopName || '')
          setBio(d.bio || '')
          setLocation(d.location || '')
        }
      })

    // Load products
    fetch(`/api/products?sellerId=${session.user.id}&limit=50`)
      .then((r) => r.json())
      .then((d) => {
        // Filter to own products
        setProducts(d.products || [])
        setLoading(false)
      })
  }, [session])

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.id) return
    setSavingProfile(true)
    const res = await fetch(`/api/sellers/${session.user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shopName, bio, location }),
    })
    setProfileMsg(res.ok ? 'Profile saved!' : 'Error saving profile.')
    setSavingProfile(false)
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return
    await fetch(`/api/products/${id}`, { method: 'DELETE' })
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  if (status === 'loading' || loading) {
    return (
      <div className="container" style={{ padding: '60px 16px' }}>
        <div className="skeleton" style={{ height: 400 }} aria-busy="true" aria-label="Loading dashboard" />
      </div>
    )
  }

  const activeCount = products.filter((p) => p.status === 'ACTIVE').length
  const totalReviews = products.reduce((s, p) => s + p.reviews.length, 0)

  return (
    <div className="container" style={{ padding: '40px 16px 80px' }}>
      <h1 className={styles.heading}>Seller Dashboard</h1>
      <p className={styles.subheading}>Welcome back, {session?.user?.name}!</p>

      {/* Stats */}
      <div className={styles.statsGrid} aria-label="Dashboard statistics">
        <div className={styles.stat}>
          <span className={styles.statNumber}>{products.length}</span>
          <span className={styles.statLabel}>Total Listings</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNumber}>{activeCount}</span>
          <span className={styles.statLabel}>Active Listings</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNumber}>{totalReviews}</span>
          <span className={styles.statLabel}>Total Reviews</span>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Seller Profile */}
        <section className={styles.section} aria-labelledby="profile-heading">
          <h2 id="profile-heading">Shop Profile</h2>
          <form onSubmit={saveProfile} className={styles.form} noValidate>
            <div className="form-group">
              <label htmlFor="shopName" className="form-label">Shop Name *</label>
              <input
                id="shopName"
                type="text"
                className="form-input"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                required
                placeholder="My Artisan Shop"
                aria-required="true"
              />
            </div>
            <div className="form-group">
              <label htmlFor="location" className="form-label">Location</label>
              <input
                id="location"
                type="text"
                className="form-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Country"
              />
            </div>
            <div className="form-group">
              <label htmlFor="bio" className="form-label">Bio</label>
              <textarea
                id="bio"
                className="form-textarea"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell customers about your craft and story…"
                rows={5}
              />
            </div>
            {profileMsg && (
              <div className={`alert ${profileMsg.includes('Error') ? 'alert-error' : 'alert-success'}`} role="status">
                {profileMsg}
              </div>
            )}
            <button type="submit" className="btn btn-primary" disabled={savingProfile}>
              {savingProfile ? 'Saving…' : 'Save Profile'}
            </button>
          </form>
        </section>

        {/* Products */}
        <section className={styles.section} aria-labelledby="products-heading">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 id="products-heading">My Products</h2>
            <Link href="/dashboard/products/new" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '.875rem' }}>
              + New Product
            </Link>
          </div>

          {products.length === 0 ? (
            <div className={styles.emptyProducts}>
              <p>You haven&apos;t listed any products yet.</p>
              <Link href="/dashboard/products/new" className="btn btn-primary" style={{ marginTop: 12 }}>
                List Your First Product
              </Link>
            </div>
          ) : (
            <div className={styles.productList} role="list">
              {products.map((p) => (
                <div key={p.id} className={styles.productRow} role="listitem">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.images[0] || 'https://placehold.co/60x48/F0E6D3/3D2B1F?text=?'}
                    alt=""
                    className={styles.productThumb}
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/60x48/F0E6D3/3D2B1F?text=?' }}
                  />
                  <div className={styles.productInfo}>
                    <Link href={`/product/${p.id}`} className={styles.productTitle}>{p.title}</Link>
                    <span className={styles.productMeta}>{p.category.name} · ${Number(p.price).toFixed(2)}</span>
                  </div>
                  <span className={`badge ${p.status === 'ACTIVE' ? '' : styles.inactiveBadge}`}>{p.status}</span>
                  <div className={styles.productActions}>
                    <Link href={`/dashboard/products/edit/${p.id}`} className="btn btn-secondary" style={{ padding: '5px 12px', fontSize: '.8125rem' }}>
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="btn btn-danger"
                      style={{ padding: '5px 12px', fontSize: '.8125rem' }}
                      aria-label={`Delete ${p.title}`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
