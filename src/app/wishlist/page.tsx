'use client'
import { useCartWishlist } from '@/context/CartWishlistContext'
import Link from 'next/link'
import styles from './page.module.css'

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart, isInCart } = useCartWishlist()

  if (wishlist.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon} aria-hidden="true">♡</div>
        <h1>Your wishlist is empty</h1>
        <p>Save items you love and come back to them anytime.</p>
        <Link href="/shop" className="btn btn-primary" style={{ marginTop: 16 }}>Browse Products</Link>
      </div>
    )
  }

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Wishlist</h1>
        <span className={styles.itemCount}>{wishlist.length} item{wishlist.length !== 1 ? 's' : ''}</span>
      </div>

      <div className={styles.grid} role="list">
        {wishlist.map((item) => {
          const inCart = isInCart(item.id)
          return (
            <article key={item.id} className={styles.card} role="listitem">
              <div className={styles.imgWrap}>
                <Link href={`/product/${item.id}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className={styles.img}
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x300/F0E6D3/3D2B1F?text=Handcrafted' }}
                  />
                </Link>
                <button
                  className={styles.removeWishlist}
                  onClick={() => toggleWishlist(item)}
                  aria-label={`Remove ${item.title} from wishlist`}
                  title="Remove from wishlist"
                >
                  ×
                </button>
              </div>
              <div className={styles.body}>
                <Link href={`/product/${item.id}`} className={styles.itemTitle}>{item.title}</Link>
                <p className={styles.price}>${item.price.toFixed(2)}</p>
                <button
                  className={`${styles.cartBtn} ${inCart ? styles.cartBtnAdded : ''}`}
                  onClick={() => addToCart({ id: item.id, title: item.title, price: item.price, image: item.image })}
                  aria-label={inCart ? `${item.title} is in your cart` : `Add ${item.title} to cart`}
                >
                  {inCart ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                      In Cart
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                      </svg>
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
