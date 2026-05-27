'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './Navbar.module.css'
import { useCartWishlist } from '@/context/CartWishlistContext'

export function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState<'nav' | 'search' | false>(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { cartCount, wishlistCount } = useCartWishlist()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchQuery.trim()
    if (q) router.push(`/shop?search=${encodeURIComponent(q)}`)
  }

  return (
    <header className={styles.header} role="banner">
      <nav className={`${styles.nav} container`} aria-label="Main navigation">

        {/* Logo */}
        <Link href="/" className={styles.logo} aria-label="Handcrafted Haven home">
          <span className={styles.logoIcon} aria-hidden="true">🏺</span>
          <span className={styles.logoText}>Handcrafted Haven</span>
        </Link>

        {/* Search bar — desktop only */}
        <form onSubmit={handleSearch} className={styles.searchForm} role="search">
          <label htmlFor="nav-search" className={styles.srOnly}>Search handmade goods</label>
          <input
            id="nav-search"
            type="search"
            className={styles.searchInput}
            placeholder="Search handmade goods..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search products"
          />
          <button type="submit" className={styles.searchBtn} aria-label="Submit search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
        </form>

        {/* Desktop Nav Links */}
        <ul className={styles.navLinks} role="list">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/shop">Shop</Link></li>
          <li><Link href="/sellers">Sellers</Link></li>
          <li><Link href="/about">About</Link></li>
        </ul>

        {/* Desktop: Wishlist + Cart + Auth */}
        <div className={styles.navActions}>
          {/* Wishlist icon */}
          <Link href="/wishlist" className={styles.iconBtn} aria-label={`Wishlist (${wishlistCount} items)`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {wishlistCount > 0 && <span className={styles.badge}>{wishlistCount}</span>}
          </Link>

          {/* Cart icon */}
          <Link href="/cart" className={styles.iconBtn} aria-label={`Cart (${cartCount} items)`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
          </Link>

          {session ? (
            <>
              {session.user?.role === 'SELLER' && (
                <Link href="/dashboard" className={styles.btnStartSelling}>
                  Dashboard
                </Link>
              )}
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="btn btn-primary"
                style={{ padding: '6px 14px', fontSize: '.875rem' }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '.875rem', color: '#f0e6d3' }}>
                Log In
              </Link>
              <Link href="/register?role=SELLER" className={styles.btnStartSelling}>
                Start Selling
              </Link>
            </>
          )}
        </div>

        {/* Mobile: search icon + wishlist + cart + hamburger */}
        <div className={styles.mobileRight}>
          <Link href="/wishlist" className={styles.mobileIconBtn} aria-label={`Wishlist (${wishlistCount})`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {wishlistCount > 0 && <span className={styles.mobileBadge}>{wishlistCount}</span>}
          </Link>
          <Link href="/cart" className={styles.mobileIconBtn} aria-label={`Cart (${cartCount})`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {cartCount > 0 && <span className={styles.mobileBadge}>{cartCount}</span>}
          </Link>
          <button
            className={styles.mobileSearchToggle}
            onClick={() => setMenuOpen(menuOpen === 'search' ? false : 'search')}
            aria-label="Toggle search"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen(menuOpen === 'nav' ? false : 'nav')}
            aria-label={menuOpen === 'nav' ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen === 'nav'}
            aria-controls="mobile-menu"
          >
            <span aria-hidden="true">{menuOpen === 'nav' ? '✕' : '☰'}</span>
          </button>
        </div>
      </nav>

      {/* Mobile search bar */}
      {menuOpen === 'search' && (
        <div className={styles.mobileSearchBar}>
          <form onSubmit={(e) => { handleSearch(e); setMenuOpen(false) }} role="search">
            <label htmlFor="mobile-search" className={styles.srOnly}>Search</label>
            <input
              id="mobile-search"
              type="search"
              className={styles.mobileSearchInput}
              placeholder="Search handmade goods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button type="submit" className={styles.mobileSearchSubmit}>Search</button>
          </form>
        </div>
      )}

      {/* Mobile nav menu */}
      {menuOpen === 'nav' && (
        <div id="mobile-menu" className={styles.mobileMenu} role="dialog" aria-label="Mobile navigation">
          <ul role="list">
            <li><Link href="/"        onClick={() => setMenuOpen(false)}>Home</Link></li>
            <li><Link href="/shop"    onClick={() => setMenuOpen(false)}>Shop</Link></li>
            <li><Link href="/sellers" onClick={() => setMenuOpen(false)}>Sellers</Link></li>
            <li><Link href="/about"   onClick={() => setMenuOpen(false)}>About</Link></li>
            {session ? (
              <>
                {session.user?.role === 'SELLER' && (
                  <li><Link href="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
                )}
                <li>
                  <button onClick={() => { setMenuOpen(false); signOut({ callbackUrl: '/' }) }}>
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link href="/login"              onClick={() => setMenuOpen(false)}>Log In</Link></li>
                <li><Link href="/register?role=SELLER" onClick={() => setMenuOpen(false)}>Start Selling</Link></li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  )
}
