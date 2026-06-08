'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCartWishlist } from '@/context/CartWishlistContext'
import Link from 'next/link'
import styles from './page.module.css'

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { cart, clearCart } = useCartWishlist()

  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [cardLast, setCardLast] = useState('')
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [orderIds, setOrderIds] = useState<string[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/checkout')
    }
  }, [status, router])

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0)
  const shipping = subtotal > 0 ? 4.99 : 0
  const total = subtotal + shipping

  const handlePlaceOrder = async () => {
    if (!session?.user) return
    if (!address.trim() || !city.trim() || cardLast.length !== 4) {
      setError('Please fill in your address, city, and the last 4 digits of your card.')
      return
    }
    setError('')
    setPlacing(true)

    const results: string[] = []
    for (const item of cart) {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: item.id,
          quantity: item.quantity,
          paymentName: session.user.name || '',
          paymentEmail: session.user.email || '',
          paymentAddress: address,
          paymentCity: city,
          paymentCardLast: cardLast,
        }),
      })
      const data = await res.json()
      if (res.ok && data.order) {
        results.push(data.order.id)
      }
    }

    if (results.length > 0) {
      clearCart()
      setOrderIds(results)
      setSuccess(true)
    } else {
      setError('Something went wrong placing your order. Please try again.')
    }
    setPlacing(false)
  }

  if (status === 'loading') {
    return <div className="container" style={{ padding: '60px 16px' }}><div className="skeleton" style={{ height: 400 }} /></div>
  }

  if (success) {
    return (
      <div className={styles.successWrap}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.successTitle}>Order Placed!</h1>
          <p className={styles.successMsg}>
            Thank you, {session?.user?.name}! Your {orderIds.length} order{orderIds.length !== 1 ? 's have' : ' has'} been received and will be processed shortly.
          </p>
          <div className={styles.successActions}>
            <Link href="/orders" className="btn btn-primary">Track My Orders</Link>
            <Link href="/shop" className="btn btn-secondary">Continue Shopping</Link>
          </div>
        </div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className={styles.emptyWrap}>
        <div className={styles.emptyIcon}>🛒</div>
        <h1>Your cart is empty</h1>
        <p>Add some items before checking out.</p>
        <Link href="/shop" className="btn btn-primary" style={{ marginTop: 16 }}>Browse Shop</Link>
      </div>
    )
  }

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>Checkout</h1>
      <p className={styles.subtitle}>Review your order and confirm payment details</p>

      <div className={styles.layout}>
        {/* Left — shipping + payment */}
        <div className={styles.forms}>
          {/* Delivery Info */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.stepNum}>1</span>
              Delivery Information
            </h2>

            <div className={styles.lockedField}>
              <label className={styles.fieldLabel}>Full Name</label>
              <div className={styles.lockedValue}>
                {session?.user?.name}
                <span className={styles.lockBadge}>🔒 auto-filled</span>
              </div>
            </div>

            <div className={styles.lockedField}>
              <label className={styles.fieldLabel}>Email Address</label>
              <div className={styles.lockedValue}>
                {session?.user?.email}
                <span className={styles.lockBadge}>🔒 auto-filled</span>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: 16 }}>
              <label htmlFor="address" className="form-label">Delivery Address *</label>
              <input
                id="address"
                type="text"
                className="form-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Artisan Street"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="city" className="form-label">City *</label>
              <input
                id="city"
                type="text"
                className="form-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Accra"
                required
              />
            </div>
          </section>

          {/* Payment Info */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.stepNum}>2</span>
              Payment Details
            </h2>
            <div className={styles.demoNotice}>
              <span>🎓</span>
              <span>This is a school demo — no real payment is processed.</span>
            </div>

            <div className={styles.lockedField}>
              <label className={styles.fieldLabel}>Cardholder Name</label>
              <div className={styles.lockedValue}>
                {session?.user?.name}
                <span className={styles.lockBadge}>🔒 auto-filled</span>
              </div>
            </div>

            <div className={styles.lockedField}>
              <label className={styles.fieldLabel}>Card Number</label>
              <div className={styles.lockedValue}>
                •••• •••• •••• <span style={{ letterSpacing: 2 }}>????</span>
                <span className={styles.lockBadge}>demo card</span>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: 16 }}>
              <label htmlFor="cardLast" className="form-label">Last 4 digits of card *</label>
              <input
                id="cardLast"
                type="text"
                className="form-input"
                value={cardLast}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 4)
                  setCardLast(v)
                }}
                placeholder="1234"
                maxLength={4}
                inputMode="numeric"
                style={{ maxWidth: 160 }}
                required
              />
              <p className={styles.fieldHint}>Enter any 4-digit number for this demo.</p>
            </div>
          </section>
        </div>

        {/* Right — order summary */}
        <aside className={styles.summary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>

          <div className={styles.items}>
            {cart.map((item) => (
              <div key={item.id} className={styles.summaryItem}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title}
                  className={styles.summaryImg}
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/56x44/F0E6D3/3D2B1F?text=?' }}
                />
                <div className={styles.summaryItemInfo}>
                  <p className={styles.summaryItemTitle}>{item.title}</p>
                  <p className={styles.summaryItemMeta}>Qty {item.quantity} × ${item.price.toFixed(2)}</p>
                </div>
                <span className={styles.summaryItemTotal}>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className={styles.totals}>
            <div className={styles.totalRow}>
              <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
            </div>
            <div className={styles.totalRow}>
              <span>Shipping</span><span>${shipping.toFixed(2)}</span>
            </div>
            <div className={`${styles.totalRow} ${styles.grandTotal}`}>
              <span>Total</span>
              <span className={styles.lockedPrice}>
                ${total.toFixed(2)}
                <span className={styles.lockBadge}>🔒 locked</span>
              </span>
            </div>
          </div>

          {error && (
            <div className="alert alert-error" role="alert" style={{ marginBottom: 16 }}>
              {error}
            </div>
          )}

          <button
            className={`btn btn-primary ${styles.placeBtn}`}
            onClick={handlePlaceOrder}
            disabled={placing}
          >
            {placing ? 'Placing Order…' : `Place Order · $${total.toFixed(2)}`}
          </button>

          <Link href="/cart" className={styles.backLink}>← Back to Cart</Link>
        </aside>
      </div>
    </div>
  )
}
