'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ProductCard } from '@/components/products/ProductCard'
import styles from './page.module.css'

interface Product {
  id: string
  title: string
  price: number
  images: string[]
  category: { name: string; slug: string }
  sellerProfile: { shopName: string } | null
  avgRating: number | null
  reviewCount: number
}

interface ProductsResult {
  products: Product[]
  total: number
  pages: number
}

const CATEGORIES = [
  { name: 'All',      slug: '' },
  { name: 'Jewelry',  slug: 'jewelry' },
  { name: 'Ceramics', slug: 'ceramics' },
  { name: 'Textiles', slug: 'textiles' },
  { name: 'Woodwork', slug: 'woodwork' },
  { name: 'Candles',  slug: 'candles' },
  { name: 'Paintings',slug: 'paintings' },
]

export default function ShopContent() {
  const searchParams = useSearchParams()
  const router       = useRouter()

  const [result,   setResult]   = useState<ProductsResult>({ products: [], total: 0, pages: 1 })
  const [loading,  setLoading]  = useState(true)
  const [fetchErr, setFetchErr] = useState<string | null>(null)

  const category = searchParams.get('category') || ''
  const search   = searchParams.get('search')   || ''
  const sort     = searchParams.get('sort')     || 'newest'
  const page     = parseInt(searchParams.get('page') || '1')
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''

  const fetchProducts = useCallback(async (): Promise<ProductsResult> => {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (search)   params.set('search',   search)
    if (sort)     params.set('sort',     sort)
    if (page)     params.set('page',     String(page))
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)

    const res = await fetch(`/api/products?${params}`)

    // Always parse JSON — the API now guarantees a JSON body even on DB errors.
    // Guard against rare cases where Next.js returns an HTML crash page.
    let data: Record<string, unknown> = {}
    try {
      data = await res.json()
    } catch {
      throw new Error('Unexpected server response. Please try again.')
    }

    if (!res.ok) {
      throw new Error((data.error as string) || 'Failed to load products.')
    }

    return {
      products: (data.products as Product[]) ?? [],
      total:    (data.total    as number)    ?? 0,
      pages:    (data.pages    as number)    ?? 1,
    }
  }, [category, search, sort, page, minPrice, maxPrice])

  useEffect(() => {
    let active = true
    Promise.resolve().then(() => {
      if (!active) return
      setLoading(true)
      setFetchErr(null)
      return fetchProducts()
    }).then((r) => {
      if (active && r) { setResult(r); setLoading(false) }
    }).catch((err: Error) => {
      if (active) { setFetchErr(err.message); setLoading(false) }
    })
    return () => { active = false }
  }, [fetchProducts])

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else        params.delete(key)
    params.delete('page')
    router.push(`/shop?${params.toString()}`)
  }

  const { products, total, pages } = result

  return (
    <div className={styles.layout}>
      {/* Sidebar Filters */}
      <aside className={styles.sidebar} aria-label="Product filters">
        <h2 className={styles.sidebarTitle}>Filters</h2>

        {/* Search */}
        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label htmlFor="search" className="form-label">Search</label>
          <input
            id="search"
            type="search"
            className="form-input"
            placeholder="Search products…"
            defaultValue={search}
            onKeyDown={(e) => {
              if (e.key === 'Enter') updateParam('search', (e.target as HTMLInputElement).value)
            }}
            aria-label="Search products"
          />
        </div>

        {/* Categories */}
        <fieldset className={styles.filterGroup}>
          <legend className={styles.filterLabel}>Category</legend>
          {CATEGORIES.map((cat) => (
            <label key={cat.slug} className={styles.radioLabel}>
              <input
                type="radio"
                name="category"
                value={cat.slug}
                checked={category === cat.slug}
                onChange={() => updateParam('category', cat.slug)}
              />
              {cat.name}
            </label>
          ))}
        </fieldset>

        {/* Price Range */}
        <fieldset className={styles.filterGroup}>
          <legend className={styles.filterLabel}>Price Range</legend>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="number"
              className="form-input"
              placeholder="Min"
              defaultValue={minPrice}
              min="0"
              onBlur={(e) => updateParam('minPrice', e.target.value)}
              style={{ flex: 1 }}
              aria-label="Minimum price"
            />
            <span aria-hidden="true">–</span>
            <input
              type="number"
              className="form-input"
              placeholder="Max"
              defaultValue={maxPrice}
              min="0"
              onBlur={(e) => updateParam('maxPrice', e.target.value)}
              style={{ flex: 1 }}
              aria-label="Maximum price"
            />
          </div>
        </fieldset>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.topBar}>
          <p className={styles.resultsCount} aria-live="polite">
            {loading ? 'Loading…' : fetchErr ? '' : `${total} product${total !== 1 ? 's' : ''} found`}
          </p>
          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <label htmlFor="sort" className="form-label" style={{ whiteSpace: 'nowrap' }}>Sort by</label>
            <select
              id="sort"
              className="form-select"
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="product-grid" aria-label="Loading products" aria-busy="true">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 280 }} aria-hidden="true" />
            ))}
          </div>
        ) : fetchErr ? (
          <div className={styles.errorBox} role="alert">
            <span className={styles.errorIcon} aria-hidden="true">⚠</span>
            <div>
              <p className={styles.errorTitle}>Could not load products</p>
              <p className={styles.errorMsg}>{fetchErr}</p>
              <button
                className="btn btn-primary"
                style={{ marginTop: 12, padding: '8px 18px', fontSize: '0.875rem' }}
                onClick={() => { setLoading(true); setFetchErr(null); fetchProducts().then(setResult).catch((e: Error) => setFetchErr(e.message)).finally(() => setLoading(false)) }}
              >
                Retry
              </button>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className={styles.empty} role="status">
            <p>No products found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((p) => <ProductCard key={p.id} {...p} />)}
          </div>
        )}

        {/* Pagination */}
        {!fetchErr && pages > 1 && (
          <nav className={styles.pagination} aria-label="Product pages">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => updateParam('page', String(p))}
                className={`btn ${page === p ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '6px 14px' }}
                aria-current={page === p ? 'page' : undefined}
                aria-label={`Page ${p}`}
              >
                {p}
              </button>
            ))}
          </nav>
        )}
      </main>
    </div>
  )
}
