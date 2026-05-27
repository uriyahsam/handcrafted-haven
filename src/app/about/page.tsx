import Link from 'next/link'
import type { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'About Us — Handcrafted Haven',
  description: 'Learn about Handcrafted Haven, our mission to support independent artisans, our fees, and how to get in touch.',
}

const TEAM = [
  { initials: 'EK', name: 'Emma Krause',    role: 'Founder & CEO',       color: '#C0522B' },
  { initials: 'LM', name: 'Luca Moran',     role: 'Head of Community',   color: '#8B4513' },
  { initials: 'AN', name: 'Aiko Nakamura',  role: 'Lead Designer',       color: '#4a7c59' },
  { initials: 'JO', name: 'James Okafor',   role: 'Engineering Lead',    color: '#b5860d' },
]

const FAQ = [
  { q: 'Is it free to create a shop?', a: 'Yes — setting up your shop on Handcrafted Haven is completely free. We only earn a small commission when you make a sale.' },
  { q: 'What commission does Handcrafted Haven take?', a: 'We take a 5% commission on each completed sale. There are no listing fees, monthly fees, or hidden charges.' },
  { q: 'How do I get paid?', a: 'Payouts are processed via Stripe and sent directly to your bank account within 3–5 business days of a completed order.' },
  { q: 'Can I sell internationally?', a: 'Yes! You can ship to any country. You set your own shipping rates and regions in your seller dashboard.' },
  { q: 'What can I sell on Handcrafted Haven?', a: 'Any genuinely handcrafted, handmade, or artisan-designed item. Mass-produced goods are not permitted. See our seller guidelines for the full list.' },
  { q: 'How do I contact support?', a: 'Email us at support@handcraftedhaven.com or use the contact form below. We respond within 24 hours on business days.' },
]

export default function AboutPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className={styles.hero} aria-label="About Handcrafted Haven">
        <div className={`${styles.heroInner} container`}>
          <span className={styles.badge}>Our Story</span>
          <h1 className={styles.heroTitle}>
            Built for <span className={styles.accent}>Makers</span>,<br />
            by People Who Love Craft
          </h1>
          <p className={styles.heroSub}>
            Handcrafted Haven was founded to give independent artisans a beautiful,
            fair platform to sell their work — and to help customers find truly
            unique pieces that carry meaning.
          </p>
          <div className={styles.heroBtns}>
            <Link href="/shop" className="btn btn-primary" style={{ padding: '12px 28px' }}>
              Browse the Shop
            </Link>
            <Link href="/register?role=SELLER" className={styles.btnOutline} style={{ padding: '12px 28px' }}>
              Start Selling
            </Link>
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className={styles.missionSection} aria-labelledby="mission-heading">
        <div className="container">
          <div className={styles.missionGrid}>
            <div>
              <h2 id="mission-heading" className={styles.sectionTitle}>
                Our <span className={styles.accent}>Mission</span>
              </h2>
              <p className={styles.bodyText}>
                We believe handmade objects carry something mass-produced goods never can —
                the mark of a human hand, a personal story, and genuine skill. Our mission
                is to make those objects findable, and to make sure the people who create
                them earn a fair living doing what they love.
              </p>
              <p className={styles.bodyText} style={{ marginTop: 16 }}>
                We keep our fees low, our tools simple, and our community supportive.
                Every decision we make starts with one question: does this help artisans
                and customers connect more easily?
              </p>
            </div>
            <div className={styles.missionStats}>
              {[
                { value: '2,400+', label: 'Active Artisans' },
                { value: '18,000+', label: 'Products Listed' },
                { value: '4.9★', label: 'Average Rating' },
                { value: '50+', label: 'Countries Reached' },
              ].map(s => (
                <div key={s.label} className={styles.missionStat}>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className={styles.valuesSection} aria-labelledby="values-heading">
        <div className="container">
          <h2 id="values-heading" className={styles.sectionTitle} style={{ textAlign: 'center', marginBottom: 40 }}>
            What We Stand For
          </h2>
          <div className={styles.valuesGrid}>
            {[
              { icon: '✋', title: 'Truly Handmade', desc: 'Every listing is reviewed to ensure items are genuinely crafted by hand. No mass production, no dropshipping.' },
              { icon: '⚖️', title: 'Fair for Sellers', desc: 'A 5% commission and zero listing fees. Artisans keep the vast majority of every sale they make.' },
              { icon: '🌱', title: 'Sustainable First', desc: 'We actively promote sellers who use natural, recycled, or ethically sourced materials in their work.' },
              { icon: '🤝', title: 'Real Community', desc: 'From seller forums to buyer reviews, we foster genuine connection between makers and their customers.' },
            ].map(v => (
              <div key={v.title} className={styles.valueCard}>
                <span className={styles.valueIcon} aria-hidden="true">{v.icon}</span>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className={styles.teamSection} aria-labelledby="team-heading">
        <div className="container">
          <h2 id="team-heading" className={styles.sectionTitle}>
            Meet the <span className={styles.accent}>Team</span>
          </h2>
          <div className={styles.teamGrid}>
            {TEAM.map(m => (
              <div key={m.name} className={styles.teamCard}>
                <div className={styles.teamAvatar} style={{ background: m.color }} aria-hidden="true">
                  {m.initials}
                </div>
                <h3 className={styles.teamName}>{m.name}</h3>
                <p className={styles.teamRole}>{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Fees & Pricing ── */}
      <section className={styles.feesSection} id="fees" aria-labelledby="fees-heading">
        <div className="container">
          <h2 id="fees-heading" className={styles.sectionTitle}>
            Fees &amp; <span className={styles.accent}>Pricing</span>
          </h2>
          <p className={styles.bodyText} style={{ maxWidth: 600, marginBottom: 32 }}>
            We keep pricing simple and transparent. No surprises, no monthly subscriptions.
          </p>
          <div className={styles.feesGrid}>
            {[
              { label: 'Listing Fee',    value: '$0.00',  note: 'Free to list any item' },
              { label: 'Transaction Fee',value: '5%',     note: 'Per completed sale' },
              { label: 'Payment Processing', value: '3% + $0.25', note: 'Handled by Stripe' },
              { label: 'Monthly Fee',    value: '$0.00',  note: 'No subscription required' },
            ].map(f => (
              <div key={f.label} className={styles.feeCard}>
                <p className={styles.feeLabel}>{f.label}</p>
                <p className={styles.feeValue}>{f.value}</p>
                <p className={styles.feeNote}>{f.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className={styles.faqSection} id="faq" aria-labelledby="faq-heading">
        <div className="container">
          <h2 id="faq-heading" className={styles.sectionTitle}>
            Frequently Asked <span className={styles.accent}>Questions</span>
          </h2>
          <div className={styles.faqList}>
            {FAQ.map(item => (
              <details key={item.q} className={styles.faqItem}>
                <summary className={styles.faqQuestion}>{item.q}</summary>
                <p className={styles.faqAnswer}>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section className={styles.contactSection} id="contact" aria-labelledby="contact-heading">
        <div className="container">
          <div className={styles.contactInner}>
            <div>
              <h2 id="contact-heading" className={styles.sectionTitle}>
                Get in <span className={styles.accent}>Touch</span>
              </h2>
              <p className={styles.bodyText} style={{ marginBottom: 8 }}>
                Have a question, a suggestion, or just want to say hello?
                We&apos;d love to hear from you.
              </p>
              <p className={styles.contactEmail}>
                📧 <a href="mailto:support@handcraftedhaven.com">support@handcraftedhaven.com</a>
              </p>
              <p className={styles.contactNote}>We respond within 24 hours on business days.</p>
            </div>
            <div className={styles.contactLinks}>
              <Link href="/register?role=SELLER" className="btn btn-primary" style={{ padding: '12px 28px' }}>
                Start Selling
              </Link>
              <Link href="/shop" className={styles.btnSecondary} style={{ padding: '12px 28px' }}>
                Browse Shop
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
