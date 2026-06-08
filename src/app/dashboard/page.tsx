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

interface Order {
  id: string
  status: string
  totalPrice: number
  quantity: number
  createdAt: string
  paymentName: string
  paymentEmail: string
  paymentAddress: string
  paymentCity: string
  product: { id: string; title: string; images: string[] }
  buyer: { id: string; name: string; email: string }
}

const ORDER_STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']
const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
}

type Tab = 'profile' | 'products' | 'orders'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('orders')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [shopName, setShopName] = useState('')
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const [profileMsg, setProfileMsg] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated' && session?.user?.role !== 'SELLER' && session?.user?.role !== 'ADMIN') {
      router.push('/')
    }
  }, [status, session, router])

  useEffect(() => {
    if (!session?.user?.id) return

    fetch(`/api/sellers/${session.user.id}`)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => {
        if (d) {
          setShopName(d.shopName || '')
          setBio(d.bio || '')
          setLocation(d.location || '')
        }
      })

    fetch(`/api/products?sellerId=${session.user.id}&limit=50`)
      .then((r) => r.json())
      .then((d) => {
        setProducts(d.products || [])
        setLoading(false)
      })

    fetch('/api/orders?role=seller')
      .then((r) => r.json())
      .then((d) => {
        setOrders(d.orders || [])
        setOrdersLoading(false)
      })
      .catch(() => setOrdersLoading(false))
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

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrder(orderId)
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) {
      const data = await res.json()
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: data.order.status } : o))
    }
    setUpdatingOrder(null)
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
  const pendingOrders = orders.filter((o) => o.status === 'PENDING').length

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
          <span className={styles.statNumber}>{orders.length}</span>
          <span className={styles.statLabel}>Total Orders</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNumber} style={{ color: pendingOrders > 0 ? 'var(--color-terracotta)' : 'var(--color-honey)' }}>
            {pendingOrders}
          </span>
          <span className={styles.statLabel}>Pending Orders</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNumber}>{totalReviews}</span>
          <span className={styles.statLabel}>Total Reviews</span>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${activeTab === 'orders' ? styles.tabActive : ''}`} onClick={() => setActiveTab('orders')}>
          📦 Orders {pendingOrders > 0 && <span className={styles.tabBadge}>{pendingOrders}</span>}
        </button>
        <button className={`${styles.tab} ${activeTab === 'products' ? styles.tabActive : ''}`} onClick={() => setActiveTab('products')}>
          🏺 Products
        </button>
        <button className={`${styles.tab} ${activeTab === 'profile' ? styles.tabActive : ''}`} onClick={() => setActiveTab('profile')}>
          👤 Shop Profile
        </button>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <section className={styles.section} aria-labelledby="orders-heading">
          <h2 id="orders-heading">Received Orders</h2>
          {ordersLoading ? (
            <div className="skeleton" style={{ height: 200 }} />
          ) : orders.length === 0 ? (
            <div className={styles.emptyProducts}>
              <p>No orders received yet. Share your shop to start selling!</p>
            </div>
          ) : (
            <div className={styles.orderList} role="list">
              {orders.map((order) => (
                <div key={order.id} className={styles.orderRow} role="listitem">
                  <div className={styles.orderRowLeft}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={order.product.images[0] || 'https://placehold.co/60x48/F0E6D3/3D2B1F?text=?'}
                      alt=""
                      className={styles.productThumb}
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/60x48/F0E6D3/3D2B1F?text=?' }}
                    />
                    <div className={styles.orderInfo}>
                      <p className={styles.orderProductTitle}>{order.product.title}</p>
                      <p className={styles.orderMeta}>
                        Buyer: <strong>{order.buyer.name}</strong> · {order.buyer.email}
                      </p>
                      <p className={styles.orderMeta}>
                        Qty: {order.quantity} · ${Number(order.totalPrice).toFixed(2)} · {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className={styles.orderMeta}>
                        Ship to: {order.paymentAddress}, {order.paymentCity}
                      </p>
                    </div>
                  </div>
                  <div className={styles.orderRowRight}>
                    <span className={`${styles.orderStatusBadge} ${styles[`oStatus_${order.status}`]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                    {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                      <div className={styles.statusActions}>
                        {ORDER_STATUSES.filter((s) => s !== order.status && s !== 'CANCELLED').map((s) => (
                          <button
                            key={s}
                            className={`btn ${s === 'DELIVERED' ? 'btn-primary' : 'btn-secondary'} ${styles.statusBtn}`}
                            onClick={() => updateOrderStatus(order.id, s)}
                            disabled={updatingOrder === order.id}
                          >
                            {updatingOrder === order.id ? '…' : `Mark ${STATUS_LABELS[s]}`}
                          </button>
                        ))}
                        <button
                          className={`btn btn-danger ${styles.statusBtn}`}
                          onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                          disabled={updatingOrder === order.id}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                    {(order.status === 'DELIVERED' || order.status === 'CANCELLED') && (
                      <p className={styles.finalStatus}>
                        {order.status === 'DELIVERED' ? '✅ Order completed' : '❌ Order cancelled'}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
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
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <section className={styles.section} style={{ maxWidth: 540 }} aria-labelledby="profile-heading">
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
      )}
    </div>
  )
}
