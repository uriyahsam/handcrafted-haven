'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import styles from '../auth.module.css'

export default function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const roleParam = searchParams.get('role') === 'SELLER' ? 'SELLER' : 'BUYER'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState(roleParam)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Registration failed.')
      setLoading(false)
      return
    }

    await signIn('credentials', { email, password, redirect: false })
    router.push(role === 'SELLER' ? '/dashboard' : '/')
    router.refresh()
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.logo} aria-hidden="true">🏺</span>
          <h1 className={styles.title}>Join Handcrafted Haven</h1>
          <p className={styles.subtitle}>Create your account to get started</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {error && <div className="alert alert-error" role="alert">{error}</div>}

          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input id="name" type="text" className="form-input" value={name}
              onChange={(e) => setName(e.target.value)} required autoComplete="name"
              placeholder="Your name" aria-required="true" />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email address</label>
            <input id="email" type="email" className="form-input" value={email}
              onChange={(e) => setEmail(e.target.value)} required autoComplete="email"
              placeholder="you@example.com" aria-required="true" />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input id="password" type="password" className="form-input" value={password}
              onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password"
              placeholder="At least 8 characters" minLength={8} aria-required="true"
              aria-describedby="pwd-hint" />
            <span id="pwd-hint" style={{ fontSize: '.8125rem', color: 'var(--color-gray-500)' }}>
              Minimum 8 characters
            </span>
          </div>

          <fieldset className="form-group">
            <legend className="form-label">I want to…</legend>
            <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input type="radio" name="role" value="BUYER" checked={role === 'BUYER'} onChange={() => setRole('BUYER')} />
                Shop & Browse
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input type="radio" name="role" value="SELLER" checked={role === 'SELLER'} onChange={() => setRole('SELLER')} />
                Sell My Crafts
              </label>
            </div>
          </fieldset>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '12px' }}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account?{' '}
          <Link href="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
