import Link from 'next/link'
import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={`${styles.grid} container`}>
        {/* Brand column */}
        <div className={styles.brand}>
          <Link href="/" className={styles.brandLogo}>
            <span aria-hidden="true">🏺</span> Handcrafted Haven
          </Link>
          <p className={styles.brandDesc}>
            A marketplace for independent artisans and handmade-goods lovers.
            Handmade with love, shipped with care.
          </p>
          <p className={styles.brandBuilt}>Built with Next.js · Deployed on Vercel</p>
        </div>

        {/* Shop column */}
        <div className={styles.col}>
          <h3>SHOP</h3>
          <ul role="list">
            <li><Link href="/shop">Browse All</Link></li>
            <li><Link href="/shop?sort=newest">New Arrivals</Link></li>
            <li><Link href="/shop?category=paintings">On Sale</Link></li>
            <li><Link href="/shop">Gift Cards</Link></li>
          </ul>
        </div>

        {/* Sell column */}
        <div className={styles.col}>
          <h3>SELL</h3>
          <ul role="list">
            <li><Link href="/register?role=SELLER">Start Selling</Link></li>
            <li><Link href="/dashboard">Seller Dashboard</Link></li>
            <li><Link href="/about#fees">Fees &amp; Pricing</Link></li>
            <li><Link href="/about#sellers">Seller Forum</Link></li>
          </ul>
        </div>

        {/* Help column */}
        <div className={styles.col}>
          <h3>HELP</h3>
          <ul role="list">
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/about#contact">Contact</Link></li>
            <li><Link href="/about#faq">FAQ</Link></li>
            <li><Link href="/about#privacy">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <p className="container">
          © {new Date().getFullYear()} Handcrafted Haven. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
