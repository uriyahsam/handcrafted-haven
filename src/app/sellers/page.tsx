'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './page.module.css'

interface Seller {
  id: string
  userId: string
  shopName: string
  bio: string | null
  avatar: string | null
  location: string | null
  user: { id: string; name: string | null }
  products: { id: string }[]
}

export default function SellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/sellers')
      .then((r) => r.json())
      .then((d) => { setSellers(d); setLoading(false) })
  }, [])

  return (
    <div className="container" style={{ padding: '40px 16px 80px' }}>
      <h1 className={styles.heading}>Meet Our Artisans</h1>
      <p className={styles.subheading}>
        Talented creators from around the world, each with a unique story and craft.
      </p>

      {loading ? (
        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 240 }} aria-hidden="true" />
          ))}
        </div>
      ) : sellers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px', color: 'var(--color-gray-500)' }}>
          <p>No sellers yet.</p>
          <Link href="/register?role=SELLER" className="btn btn-primary" style={{ marginTop: 16 }}>
            Become the First Seller
          </Link>
        </div>
      ) : (
        <div className={styles.grid} role="list">
          {sellers.map((s) => (
            <Link
              key={s.id}
              href={`/sellers/${s.userId}`}
              className={styles.card}
              role="listitem"
              aria-label={`Visit ${s.shopName}'s shop`}
            >
              <div className={styles.avatar} aria-hidden="true">
                {s.avatar
                  ? <img src={s.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                  : s.shopName[0].toUpperCase()}
              </div>
              <h2 className={styles.shopName}>{s.shopName}</h2>
              {s.location && <p className={styles.location}>📍 {s.location}</p>}
              {s.bio && <p className={styles.bio}>{s.bio.slice(0, 100)}{s.bio.length > 100 ? '…' : ''}</p>}
              <span className={styles.productCount}>
                {s.products.length} item{s.products.length !== 1 ? 's' : ''}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
