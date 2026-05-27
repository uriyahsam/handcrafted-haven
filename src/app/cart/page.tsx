'use client'
import { useCartWishlist } from '@/context/CartWishlistContext'
import Link from 'next/link'
import styles from './page.module.css'

export default function CartPage() {
  const { cart, removeFromCart, updateCartQty, clearCart } = useCartWishlist()

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 0 ? 4.99 : 0
  const total = subtotal + shipping

  if (cart.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon} aria-hidden="true">🛒</div>
        <h1>Your cart is empty</h1>
        <p>Looks like you haven&apos;t added anything yet.</p>
        <Link href="/shop" className="btn btn-primary" style={{ marginTop: 16 }}>Browse Products</Link>
      </div>
    )
  }

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Shopping Cart</h1>
        <span className={styles.itemCount}>{cart.length} item{cart.length !== 1 ? 's' : ''}</span>
      </div>

      <div className={styles.layout}>
        {/* Cart items */}
        <div className={styles.items}>
          {cart.map((item) => (
            <div key={item.id} className={styles.item}>
              <Link href={`/product/${item.id}`} className={styles.itemImgLink}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title}
                  className={styles.itemImg}
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x80/F0E6D3/3D2B1F?text=?' }}
                />
              </Link>
              <div className={styles.itemInfo}>
                <Link href={`/product/${item.id}`} className={styles.itemTitle}>{item.title}</Link>
                <p className={styles.itemPrice}>${item.price.toFixed(2)} each</p>
              </div>
              <div className={styles.itemControls}>
                <div className={styles.qty}>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => updateCartQty(item.id, item.quantity - 1)}
                    aria-label="Decrease quantity"
                  >−</button>
                  <span className={styles.qtyNum} aria-label={`Quantity: ${item.quantity}`}>{item.quantity}</span>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => updateCartQty(item.id, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >+</button>
                </div>
                <p className={styles.itemTotal}>${(item.price * item.quantity).toFixed(2)}</p>
                <button
                  className={styles.removeBtn}
                  onClick={() => removeFromCart(item.id)}
                  aria-label={`Remove ${item.title} from cart`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}

          <button className={styles.clearBtn} onClick={clearCart}>Clear cart</button>
        </div>

        {/* Order summary */}
        <aside className={styles.summary} aria-label="Order summary">
          <h2 className={styles.summaryTitle}>Order Summary</h2>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Shipping</span>
            <span>{shipping === 0 ? '—' : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button className={`btn btn-primary ${styles.checkoutBtn}`} disabled>
            Proceed to Checkout
          </button>
          <p className={styles.checkoutNote}>Checkout coming soon — this is a demo.</p>
          <Link href="/shop" className={styles.continueShopping}>← Continue Shopping</Link>
        </aside>
      </div>
    </div>
  )
}
