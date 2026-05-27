'use client'
import { useState, useEffect, use } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useCartWishlist } from '@/context/CartWishlistContext'
import styles from './page.module.css'

interface Review {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  user: { id: string; name: string | null; image: string | null }
}

interface Product {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  tags: string[]
  status: string
  avgRating: number | null
  reviewCount: number
  category: { name: string; slug: string }
  seller: { id: string; name: string | null }
  sellerProfile: { shopName: string; bio: string | null; avatar: string | null } | null
  reviews: Review[]
}

function Stars({ rating, interactive = false, onChange }: {
  rating: number
  interactive?: boolean
  onChange?: (r: number) => void
}) {
  const [hover, setHover] = useState(0)
  return (
    <span className="stars" aria-label={interactive ? 'Select rating' : `${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`star${i <= (interactive ? (hover || rating) : Math.round(rating)) ? '' : ' empty'}`}
          style={interactive ? { cursor: 'pointer', fontSize: '1.5rem' } : {}}
          onMouseEnter={interactive ? () => setHover(i) : undefined}
          onMouseLeave={interactive ? () => setHover(0) : undefined}
          onClick={interactive ? () => onChange?.(i) : undefined}
          role={interactive ? 'button' : undefined}
          aria-label={interactive ? `Rate ${i} star${i > 1 ? 's' : ''}` : undefined}
          tabIndex={interactive ? 0 : undefined}
          onKeyDown={interactive ? (e) => { if (e.key === 'Enter') onChange?.(i) } : undefined}
          aria-hidden={!interactive ? 'true' : undefined}
        >★</span>
      ))}
    </span>
  )
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: session } = useSession()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetchErr, setFetchErr] = useState<string | null>(null)
  const [selectedImg, setSelectedImg] = useState(0)

  // Review form
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [reviewMsg, setReviewMsg] = useState('')

  // Cart / Wishlist
  const { addToCart, toggleWishlist, isInCart, isInWishlist } = useCartWishlist()

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(async (r) => {
        let d: Record<string, unknown> = {}
        try { d = await r.json() } catch { throw new Error('Unexpected server response.') }
        if (!r.ok) throw new Error((d.error as string) || 'Failed to load product.')
        return d
      })
      .then((d) => { setProduct(d as unknown as Product); setLoading(false) })
      .catch((e: Error) => { setFetchErr(e.message); setLoading(false) })
  }, [id])

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) return
    setSubmitting(true)
    const res = await fetch(`/api/reviews/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, comment }),
    })
    if (res.ok) {
      setReviewMsg('Review submitted!')
      const updated = await fetch(`/api/products/${id}`).then((r) => r.json())
      setProduct(updated)
      setComment('')
    } else {
      setReviewMsg('Error submitting review.')
    }
    setSubmitting(false)
  }

  if (loading) return (
    <div className="container" style={{ padding: '60px 16px' }}>
      <div className="skeleton" style={{ height: 400 }} aria-busy="true" aria-label="Loading product" />
    </div>
  )

  if (fetchErr) return (
    <div className="container" style={{ padding: '60px 16px', textAlign: 'center' }}>
      <p style={{ fontSize: '2rem', marginBottom: 12 }} aria-hidden="true">⚠</p>
      <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>Could not load product</h1>
      <p style={{ color: 'var(--color-gray-500)', marginBottom: 20 }}>{fetchErr}</p>
      <Link href="/shop" className="btn btn-primary">Back to Shop</Link>
    </div>
  )

  if (!product) return (
    <div className="container" style={{ padding: '60px 16px', textAlign: 'center' }}>
      <h1>Product not found</h1>
      <Link href="/shop" className="btn btn-primary" style={{ marginTop: 16 }}>Back to Shop</Link>
    </div>
  )

  const images = product.images.length > 0
    ? product.images
    : ['https://placehold.co/600x500/F0E6D3/3D2B1F?text=Handcrafted']

  const displayImage = images[0]
  const inCart = isInCart(product.id)
  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: Number(product.price),
      image: displayImage,
    })
  }

  const handleWishlist = () => {
    toggleWishlist({
      id: product.id,
      title: product.title,
      price: Number(product.price),
      image: displayImage,
    })
  }

  return (
    <div className="container" style={{ padding: '40px 16px 80px' }}>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: 24, fontSize: '.875rem', color: 'var(--color-gray-500)' }}>
        <Link href="/">Home</Link> › <Link href="/shop">Shop</Link> › <Link href={`/shop?category=${product.category.slug}`}>{product.category.name}</Link> › <span aria-current="page">{product.title}</span>
      </nav>

      <div className={styles.grid}>
        {/* Image Gallery */}
        <div className={styles.gallery}>
          <div className={styles.mainImage}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[selectedImg]}
              alt={`${product.title} - image ${selectedImg + 1}`}
              className={styles.mainImg}
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x500/F0E6D3/3D2B1F?text=Handcrafted' }}
            />
          </div>
          {images.length > 1 && (
            <div className={styles.thumbs} role="list" aria-label="Product images">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`${styles.thumb} ${i === selectedImg ? styles.thumbActive : ''}`}
                  onClick={() => setSelectedImg(i)}
                  aria-label={`View image ${i + 1}`} aria-current={i === selectedImg ? "true" : undefined}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className={styles.thumbImg}
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x80/F0E6D3/3D2B1F?text=?' }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className={styles.info}>
          <span className="badge">{product.category.name}</span>
          <h1 className={styles.title}>{product.title}</h1>

          {product.avgRating !== null && (
            <div className={styles.ratingRow}>
              <Stars rating={product.avgRating} />
              <span style={{ fontSize: '.875rem', color: 'var(--color-gray-500)' }}>
                {product.avgRating.toFixed(1)} ({product.reviewCount} review{product.reviewCount !== 1 ? 's' : ''})
              </span>
            </div>
          )}

          <p className={styles.price} aria-label={`Price: $${Number(product.price).toFixed(2)}`}>
            ${Number(product.price).toFixed(2)}
          </p>

          <p className={styles.description}>{product.description}</p>

          {product.tags.length > 0 && (
            <div className={styles.tags} aria-label="Product tags">
              {product.tags.map((tag) => (
                <span key={tag} className="badge" style={{ marginRight: 6 }}>{tag}</span>
              ))}
            </div>
          )}

          {/* Cart + Wishlist actions */}
          <div className={styles.actions}>
            <button
              className={`${styles.addToCartBtn} ${inCart ? styles.addToCartBtnAdded : ''}`}
              onClick={handleAddToCart}
              aria-label={inCart ? 'Added to cart' : 'Add to cart'}
            >
              {inCart ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                  Added to Cart
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  Add to Cart
                </>
              )}
            </button>
            <button
              className={`${styles.wishlistBtn} ${inWishlist ? styles.wishlistBtnActive : ''}`}
              onClick={handleWishlist}
              aria-label={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
              aria-pressed={inWishlist}
            >
              {inWishlist ? '♥' : '♡'}
            </button>
          </div>

          {inCart && (
            <Link href="/cart" className={styles.viewCartLink}>View cart →</Link>
          )}

          {/* Seller info */}
          {product.sellerProfile && (
            <div className={styles.sellerBox}>
              <div className={styles.sellerAvatar} aria-hidden="true">
                {product.sellerProfile.avatar
                  ? <img src={product.sellerProfile.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                  : product.sellerProfile.shopName[0]}
              </div>
              <div>
                <p style={{ fontSize: '.875rem', color: 'var(--color-gray-500)' }}>Sold by</p>
                <Link href={`/sellers/${product.seller.id}`} style={{ fontWeight: 600, color: 'var(--color-espresso)' }}>
                  {product.sellerProfile.shopName}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <section className={styles.reviewsSection} aria-labelledby="reviews-heading">
        <h2 id="reviews-heading">Reviews ({product.reviewCount})</h2>

        {/* Write a review */}
        {session ? (
          <form onSubmit={submitReview} className={styles.reviewForm} aria-label="Write a review">
            <h3>Write a Review</h3>
            <div className="form-group">
              <label className="form-label">Your Rating</label>
              <Stars rating={rating} interactive onChange={setRating} />
            </div>
            <div className="form-group">
              <label htmlFor="comment" className="form-label">Comment (optional)</label>
              <textarea
                id="comment"
                className="form-textarea"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts on this product…"
                rows={4}
              />
            </div>
            {reviewMsg && (
              <div className={`alert ${reviewMsg.includes('Error') ? 'alert-error' : 'alert-success'}`} role="status">
                {reviewMsg}
              </div>
            )}
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit Review'}
            </button>
          </form>
        ) : (
          <p className={styles.loginPrompt}>
            <Link href="/login">Log in</Link> to write a review.
          </p>
        )}

        {/* Existing reviews */}
        <div className={styles.reviewList} aria-label="Customer reviews">
          {product.reviews.length === 0 ? (
            <p style={{ color: 'var(--color-gray-500)' }}>No reviews yet. Be the first!</p>
          ) : (
            product.reviews.map((r) => (
              <article key={r.id} className={styles.reviewItem}>
                <div className={styles.reviewHeader}>
                  <strong>{r.user.name || 'Anonymous'}</strong>
                  <Stars rating={r.rating} />
                  <time className={styles.reviewDate} dateTime={r.createdAt}>
                    {new Date(r.createdAt).toLocaleDateString()}
                  </time>
                </div>
                {r.comment && <p className={styles.reviewComment}>{r.comment}</p>}
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
