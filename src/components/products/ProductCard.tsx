'use client'
import Link from 'next/link'
import { useCartWishlist } from '@/context/CartWishlistContext'
import styles from './ProductCard.module.css'

interface ProductCardProps {
  id: string
  title: string
  price: number | string
  images: string[]
  category?: { name: string }
  sellerProfile?: { shopName: string } | null
  avgRating?: number | null
  reviewCount?: number
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="stars" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`star${i <= Math.round(rating) ? '' : ' empty'}`} aria-hidden="true">★</span>
      ))}
    </span>
  )
}

export function ProductCard({ id, title, price, images, category, sellerProfile, avgRating, reviewCount }: ProductCardProps) {
  const displayImage = images?.[0] || 'https://placehold.co/400x300/F0E6D3/3D2B1F?text=Handcrafted'
  const numericPrice = Number(price)
  const { addToCart, toggleWishlist, isInCart, isInWishlist } = useCartWishlist()

  const inCart = isInCart(id)
  const inWishlist = isInWishlist(id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart({ id, title, price: numericPrice, image: displayImage })
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    toggleWishlist({ id, title, price: numericPrice, image: displayImage })
  }

  return (
    <article className={`card ${styles.card}`}>
      <div className={styles.imageWrapper}>
        <Link href={`/product/${id}`} className={styles.imageLink} aria-label={`View ${title}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayImage}
            alt={title}
            className={styles.image}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/400x300/F0E6D3/3D2B1F?text=Handcrafted'
            }}
          />
        </Link>
        <button
          className={`${styles.wishlistBtn} ${inWishlist ? styles.wishlistActive : ''}`}
          onClick={handleWishlist}
          aria-label={inWishlist ? `Remove ${title} from wishlist` : `Add ${title} to wishlist`}
          aria-pressed={inWishlist}
        >
          {inWishlist ? '♥' : '♡'}
        </button>
      </div>
      <div className={styles.body}>
        {category && <span className="badge">{category.name}</span>}
        <Link href={`/product/${id}`}>
          <h3 className={styles.title}>{title}</h3>
        </Link>
        {sellerProfile && (
          <p className={styles.seller}>by {sellerProfile.shopName}</p>
        )}
        <div className={styles.footer}>
          <span className="price" aria-label={`Price: $${numericPrice.toFixed(2)}`}>
            ${numericPrice.toFixed(2)}
          </span>
          {avgRating !== null && avgRating !== undefined && (
            <div className={styles.rating}>
              <Stars rating={avgRating} />
              <span className={styles.ratingCount}>({reviewCount})</span>
            </div>
          )}
        </div>
        <button
          className={`${styles.cartBtn} ${inCart ? styles.cartBtnAdded : ''}`}
          onClick={handleAddToCart}
          aria-label={inCart ? `${title} is in your cart` : `Add ${title} to cart`}
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
}
