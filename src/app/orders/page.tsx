'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './page.module.css'

interface Order {
  id: string
  status: string
  totalPrice: number
  quantity: number
  createdAt: string
  updatedAt: string
  paymentAddress: string
  paymentCity: string
  product: {
    id: string
    title: string
    images: string[]
  }
  seller: {
    id: string
    name: string
  }
}

const STATUS_STEPS = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED']

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Order Received',
  PROCESSING: 'Being Prepared',
  SHIPPED: 'On the Way',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
}

const STATUS_ICONS: Record<string, string> = {
  PENDING: '📬',
  PROCESSING: '🔨',
  SHIPPED: '🚚',
  DELIVERED: '✅',
  CANCELLED: '❌',
}

function OrderCard({ order }: { order: Order }) {
  const stepIndex = STATUS_STEPS.indexOf(order.status)
  const isCancelled = order.status === 'CANCELLED'

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardLeft}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={order.product.images[0] || 'https://placehold.co/72x56/F0E6D3/3D2B1F?text=?'}
            alt={order.product.title}
            className={styles.productImg}
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/72x56/F0E6D3/3D2B1F?text=?' }}
          />
          <div>
            <Link href={`/product/${order.product.id}`} className={styles.productTitle}>
              {order.product.title}
            </Link>
            <p className={styles.orderMeta}>
              Qty {order.quantity} · Seller: {order.seller.name}
            </p>
            <p className={styles.orderMeta}>
              Ordered {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
        <div className={styles.cardRight}>
          <span className={`${styles.statusBadge} ${styles[`status_${order.status}`]}`}>
            {STATUS_ICONS[order.status]} {STATUS_LABELS[order.status]}
          </span>
          <p className={styles.orderPrice}>${Number(order.totalPrice).toFixed(2)}</p>
        </div>
      </div>

      {/* Progress tracker */}
      {!isCancelled && (
        <div className={styles.tracker}>
          {STATUS_STEPS.map((step, i) => (
            <div key={step} className={styles.trackerStep}>
              <div className={styles.trackerDotWrap}>
                {i > 0 && (
                  <div className={`${styles.trackerLine} ${i <= stepIndex ? styles.lineActive : ''}`} />
                )}
                <div className={`${styles.trackerDot} ${
                  i < stepIndex ? styles.dotDone :
                  i === stepIndex ? styles.dotCurrent :
                  styles.dotFuture
                }`}>
                  {i < stepIndex ? '✓' : i + 1}
                </div>
              </div>
              <span className={`${styles.trackerLabel} ${i === stepIndex ? styles.trackerLabelActive : ''}`}>
                {STATUS_LABELS[step]}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className={styles.deliveryInfo}>
        <span className={styles.deliveryLabel}>Delivering to:</span>
        <span>{order.paymentAddress}, {order.paymentCity}</span>
      </div>
    </div>
  )
}

export default function OrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login?callbackUrl=/orders')
  }, [status, router])

  useEffect(() => {
    if (!session?.user) return
    fetch('/api/orders?role=buyer')
      .then((r) => r.json())
      .then((d) => {
        setOrders(d.orders || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [session])

  if (status === 'loading' || loading) {
    return (
      <div className="container" style={{ padding: '60px 16px' }}>
        <div className="skeleton" style={{ height: 300, borderRadius: 12 }} />
      </div>
    )
  }

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Orders</h1>
        <Link href="/shop" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '.875rem' }}>
          Continue Shopping
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📦</div>
          <h2>No orders yet</h2>
          <p>When you place an order, it will appear here.</p>
          <Link href="/shop" className="btn btn-primary" style={{ marginTop: 16 }}>Shop Now</Link>
        </div>
      ) : (
        <div className={styles.list}>
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}
