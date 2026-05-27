import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AuthProvider } from '@/components/layout/AuthProvider'
import { CartWishlistProvider } from '@/context/CartWishlistContext'

export const metadata: Metadata = {
  title: 'Handcrafted Haven — Unique Artisan Marketplace',
  description: 'Discover and shop unique handcrafted items from talented artisans.',
  keywords: 'handmade, artisan, crafts, marketplace, handcrafted',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartWishlistProvider>
            <Navbar />
            <main style={{ minHeight: '80vh' }}>{children}</main>
            <Footer />
          </CartWishlistProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
