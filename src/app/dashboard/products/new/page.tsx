'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from '../../dashboard.module.css'

interface Category {
  id: string
  name: string
  slug: string
}

export default function NewProductPage() {
  const { status } = useSession()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [images, setImages] = useState('')
  const [tags, setTags] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  // Fetch real category IDs from the database
  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => {
        setCategories(Array.isArray(data) ? data : [])
        setCategoriesLoading(false)
      })
      .catch(() => setCategoriesLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const imageUrls = images.split('\n').map((s) => s.trim()).filter(Boolean)
    const tagList = tags.split(',').map((s) => s.trim()).filter(Boolean)

    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        price: parseFloat(price),
        categoryId,
        images: imageUrls,
        tags: tagList,
      }),
    })

    if (res.ok) {
      router.push('/dashboard')
    } else {
      const data = await res.json()
      setError(data.error || 'Failed to create product.')
    }
    setLoading(false)
  }

  return (
    <div className="container" style={{ padding: '40px 16px 80px', maxWidth: 760 }}>
      <nav aria-label="Breadcrumb" style={{ marginBottom: 24, fontSize: '.875rem', color: 'var(--color-gray-500)' }}>
        <Link href="/dashboard">Dashboard</Link> › New Product
      </nav>

      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: 32 }}>
        List a New Product
      </h1>

      <div className={styles.formCard}>
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {error && <div className="alert alert-error" role="alert">{error}</div>}

          <div className="form-group">
            <label htmlFor="title" className="form-label">Product Title *</label>
            <input
              id="title"
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Hand-thrown Stoneware Mug"
              aria-required="true"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">Description *</label>
            <textarea
              id="description"
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Describe your product in detail — materials, dimensions, care instructions…"
              rows={6}
              aria-required="true"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label htmlFor="price" className="form-label">Price (USD) *</label>
              <input
                id="price"
                type="number"
                className="form-input"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0.01"
                step="0.01"
                placeholder="24.99"
                aria-required="true"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category" className="form-label">Category *</label>
              <select
                id="category"
                className="form-select"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                aria-required="true"
                disabled={categoriesLoading}
              >
                <option value="">
                  {categoriesLoading ? 'Loading categories…' : 'Select a category…'}
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="images" className="form-label">Image URLs</label>
            <textarea
              id="images"
              className="form-textarea"
              value={images}
              onChange={(e) => setImages(e.target.value)}
              placeholder={'https://example.com/image1.jpg\nhttps://example.com/image2.jpg'}
              rows={3}
              aria-describedby="images-hint"
            />
            <span id="images-hint" style={{ fontSize: '.8125rem', color: 'var(--color-gray-500)' }}>
              One URL per line. Use publicly accessible image URLs.
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="tags" className="form-label">Tags</label>
            <input
              id="tags"
              type="text"
              className="form-input"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="handmade, pottery, gift"
              aria-describedby="tags-hint"
            />
            <span id="tags-hint" style={{ fontSize: '.8125rem', color: 'var(--color-gray-500)' }}>
              Comma-separated tags to help customers find your product.
            </span>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 8 }}>
            <Link href="/dashboard" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={loading || categoriesLoading}>
              {loading ? 'Creating…' : 'Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
