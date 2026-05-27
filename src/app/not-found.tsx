import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '120px 16px' }}>
      <p style={{ fontSize: '5rem', marginBottom: 16 }} aria-hidden="true">🏺</p>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: 12 }}>
        Page Not Found
      </h1>
      <p style={{ color: 'var(--color-gray-500)', fontSize: '1.0625rem', marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <Link href="/" className="btn btn-primary">Go Home</Link>
        <Link href="/shop" className="btn btn-secondary">Browse Shop</Link>
      </div>
    </div>
  )
}
