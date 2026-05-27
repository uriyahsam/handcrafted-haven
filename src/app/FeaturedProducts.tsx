'use client'
import Link from 'next/link'
import { useCartWishlist } from '@/context/CartWishlistContext'
import styles from './page.module.css'

const FEATURED_PRODUCTS = [
  { id: '1', label: '-15%', labelType: 'sale', seller: 'ArtisanCraft Co.', title: 'Hand-Thrown Ceramic Mug', price: 28.00, oldPrice: '$33.00', rating: 4, img: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&q=80' },
  { id: '2', label: 'New',  labelType: 'new',  seller: 'WeavingWonders',   title: 'Macramé Wall Hanging',  price: 54.00, oldPrice: null,    rating: 5, img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
  { id: '3', label: null,   labelType: null,   seller: 'WoodWhisper',      title: 'Reclaimed Oak Cutting Board', price: 72.00, oldPrice: null, rating: 4, img: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&q=80' },
  { id: '4', label: '-20%', labelType: 'sale', seller: 'GlowCraft Studio', title: 'Soy Wax Candle Set (3pk)', price: 36.00, oldPrice: '$45.00', rating: 5, img: 'https://images.unsplash.com/photo-1602928309714-ea1b1d13f5f1?w=400&q=80' },
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

export function FeaturedProducts() {
  const { addToCart, toggleWishlist, isInCart, isInWishlist } = useCartWishlist()

  return (
    <section className={styles.productsSection} aria-labelledby="prod-heading">
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 id="prod-heading" className={styles.sectionTitle}>
            Featured <span className={styles.accent}>Products</span>
          </h2>
          <Link href="/shop" className={styles.seeAll}>Browse all →</Link>
        </div>

        <div className={styles.productGrid} role="list">
          {FEATURED_PRODUCTS.map((p) => {
            const inCart = isInCart(p.id)
            const inWishlist = isInWishlist(p.id)

            return (
              <article key={p.id} className={styles.productCard} role="listitem">
                <div className={styles.productImgWrap}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt={p.title} className={styles.productImg} />
                  {p.label && (
                    <span className={`${styles.productBadge} ${p.labelType === 'sale' ? styles.productBadgeSale : styles.productBadgeNew}`}>
                      {p.label}
                    </span>
                  )}
                  <button
                    className={`${styles.wishlistBtn} ${inWishlist ? styles.wishlistBtnActive : ''}`}
                    aria-label={inWishlist ? `Remove ${p.title} from wishlist` : `Save ${p.title} to wishlist`}
                    aria-pressed={inWishlist}
                    onClick={() => toggleWishlist({ id: p.id, title: p.title, price: p.price, image: p.img })}
                  >
                    {inWishlist ? '♥' : '♡'}
                  </button>
                </div>
                <div className={styles.productBody}>
                  <p className={styles.productSeller}>{p.seller}</p>
                  <Link href="/shop" className={styles.productTitle} title="Browse the shop to find this product">{p.title}</Link>
                  <div className={styles.productPriceRow}>
                    <span className={styles.productPrice}>${p.price.toFixed(2)}</span>
                    {p.oldPrice && <span className={styles.productOldPrice}>{p.oldPrice}</span>}
                    <StarRow rating={p.rating} />
                  </div>
                  <button
                    className={`${styles.addToCartBtn} ${inCart ? styles.addToCartBtnAdded : ''}`}
                    onClick={() => addToCart({ id: p.id, title: p.title, price: p.price, image: p.img })}
                    aria-label={inCart ? `${p.title} is in your cart` : `Add ${p.title} to cart`}
                  >
                    {inCart ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                        In Cart
                      </>
                    ) : 'Add to Cart'}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
