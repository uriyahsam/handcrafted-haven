import { Suspense } from 'react'
import ShopContent from './ShopContent'

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 280 }} />
          ))}
        </div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  )
}
