'use client'
import { useState, useEffect, use } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from '../../../dashboard.module.css'

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { status } = useSession()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [images, setImages] = useState('')
  const [tags, setTags] = useState('')
  const [productStatus, setProductStatus] = useState('ACTIVE')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((p) => {
        setTitle(p.title || '')
        setDescription(p.description || '')
        setPrice(String(p.price || ''))
        setImages((p.images || []).join('\n'))
        setTags((p.tags || []).join(', '))
        setProductStatus(p.status || 'ACTIVE')
        setLoading(false)
      })
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    const imageUrls = images.split('\n').map((s) => s.trim()).filter(Boolean)
    const tagList = tags.split(',').map((s) => s.trim()).filter(Boolean)

    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        price: parseFloat(price),
        images: imageUrls,
        tags: tagList,
        status: productStatus,
      }),
    })

    if (res.ok) {
      router.push('/dashboard')
    } else {
      const data = await res.json()
      setError(data.error || 'Failed to update product.')
    }
    setSaving(false)
  }

  if (loading) return (
    <div className="container" style={{ padding: '60px 16px' }}>
      <div className="skeleton" style={{ height: 400 }} aria-busy="true" />
    </div>
  )

  return (
    <div className="container" style={{ padding: '40px 16px 80px', maxWidth: 760 }}>
      <nav aria-label="Breadcrumb" style={{ marginBottom: 24, fontSize: '.875rem', color: 'var(--color-gray-500)' }}>
        <Link href="/dashboard">Dashboard</Link> › Edit Product
      </nav>

      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: 32 }}>
        Edit Product
      </h1>

      <div className={styles.formCard}>
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {error && <div className="alert alert-error" role="alert">{error}</div>}

          <div className="form-group">
            <label htmlFor="title" className="form-label">Product Title *</label>
            <input id="title" type="text" className="form-input" value={title}
              onChange={(e) => setTitle(e.target.value)} required aria-required="true" />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">Description *</label>
            <textarea id="description" className="form-textarea" value={description}
              onChange={(e) => setDescription(e.target.value)} required rows={6} aria-required="true" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label htmlFor="price" className="form-label">Price (USD) *</label>
              <input id="price" type="number" className="form-input" value={price}
                onChange={(e) => setPrice(e.target.value)} required min="0.01" step="0.01" aria-required="true" />
            </div>

            <div className="form-group">
              <label htmlFor="status" className="form-label">Status</label>
              <select id="status" className="form-select" value={productStatus}
                onChange={(e) => setProductStatus(e.target.value)}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SOLD">Sold</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="images" className="form-label">Image URLs</label>
            <textarea id="images" className="form-textarea" value={images}
              onChange={(e) => setImages(e.target.value)} rows={3}
              placeholder="One URL per line" />
          </div>

          <div className="form-group">
            <label htmlFor="tags" className="form-label">Tags</label>
            <input id="tags" type="text" className="form-input" value={tags}
              onChange={(e) => setTags(e.target.value)} placeholder="handmade, pottery, gift" />
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 8 }}>
            <Link href="/dashboard" className="btn btn-secondary">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
