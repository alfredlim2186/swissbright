'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from '@/lib/useTranslations'

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  // Fetch translations
  const { t } = useTranslations([
    'login.backToHome',
    'login.welcome',
    'login.enterVerificationCode',
    'login.signInOrCreate',
    'login.codeSentTo',
    'login.email',
    'login.verificationCode',
    'login.sendCode',
    'login.verify',
    'login.verificationCodeSent',
    'login.failedToSendCode',
    'login.invalidCode',
  ])

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || t('login.failedToSendCode', 'Failed to send code'))
      }

      setMessage(t('login.verificationCodeSent', 'Verification code sent! Check your email.'))
      setStep('otp')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || t('login.invalidCode', 'Invalid code'))
      }

      // Get user info to determine redirect
      const meRes = await fetch('/api/auth/me')
      const meData = await meRes.json()

      if (meData.user?.role === 'ADMIN') {
        router.push('/admin')
      } else {
        router.push('/account')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0A0A0A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        position: 'relative',
        zIndex: 2,
      }}>
        <Link 
          href="/"
          style={{
            display: 'inline-block',
            color: '#B8B8B8',
            textDecoration: 'none',
            fontSize: '0.95rem',
            marginBottom: '2rem',
            transition: 'color 0.3s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#C9A86A'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#B8B8B8'}
        >
          {t('login.backToHome', '← Back to Home')}
        </Link>

        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(201, 168, 106, 0.3)',
          padding: '3rem 2.5rem',
        }}>
          {/* Logo */}
          <div style={{
            textAlign: 'center',
            fontFamily: "'Playfair Display', serif",
            fontSize: '2.5rem',
            letterSpacing: '1px',
            marginBottom: '2rem',
          }}>
            <span style={{ color: '#C9A86A' }}>Sweet</span>
            <span style={{ 
              color: '#F8F8F8',
              textShadow: '0 0 8px rgba(255, 255, 255, 0.6)'
            }}>B</span>
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.875rem',
            color: '#F8F8F8',
            textAlign: 'center',
            marginBottom: '0.5rem',
          }}>
            {step === 'email' ? t('login.welcome', 'Welcome') : t('login.enterVerificationCode', 'Enter Verification Code')}
          </h1>

          <p style={{
            color: '#B8B8B8',
            textAlign: 'center',
            marginBottom: '2rem',
            fontSize: '0.95rem',
          }}>
            {step === 'email' 
              ? t('login.signInOrCreate', 'Sign in or create your account with email')
              : `${t('login.codeSentTo', 'We sent a 6-digit code to')} ${email}`}
          </p>

          {error && (
            <div style={{
              backgroundColor: 'rgba(220, 38, 38, 0.1)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              color: '#FCA5A5',
              padding: '0.875rem',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
              textAlign: 'center',
            }}>
              {error}
            </div>
          )}

          {message && (
            <div style={{
              backgroundColor: 'rgba(201, 168, 106, 0.1)',
              border: '1px solid rgba(201, 168, 106, 0.3)',
              color: '#C9A86A',
              padding: '0.875rem',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
              textAlign: 'center',
            }}>
              {message}
            </div>
          )}

          {step === 'email' ? (
            <form onSubmit={handleRequestOtp}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  color: '#F8F8F8',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                }}>
                  {t('login.email', 'Email')} *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(201, 168, 106, 0.3)',
                    color: '#F8F8F8',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.3s ease',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#C9A86A'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(201, 168, 106, 0.3)'}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  backgroundColor: loading ? 'rgba(201, 168, 106, 0.5)' : '#C9A86A',
                  color: '#0A0A0A',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.5px',
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = '#D4B67A'
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = '#C9A86A'
                }}
              >
                {loading ? t('login.sending', 'Sending...') : t('login.sendCode', 'Send Code')}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  color: '#F8F8F8',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                }}>
                  {t('login.verificationCode', 'Verification Code')}
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  placeholder="000000"
                  maxLength={6}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(201, 168, 106, 0.3)',
                    color: '#F8F8F8',
                    fontSize: '1.5rem',
                    letterSpacing: '0.5rem',
                    textAlign: 'center',
                    outline: 'none',
                    transition: 'border-color 0.3s ease',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#C9A86A'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(201, 168, 106, 0.3)'}
                />
                <p style={{
                  color: '#B8B8B8',
                  fontSize: '0.8rem',
                  marginTop: '0.5rem',
                  textAlign: 'center',
                }}>
                  Code expires in 10 minutes
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  backgroundColor: loading || otp.length !== 6 ? 'rgba(201, 168, 106, 0.5)' : '#C9A86A',
                  color: '#0A0A0A',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: loading || otp.length !== 6 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.5px',
                  marginBottom: '1rem',
                }}
                onMouseEnter={(e) => {
                  if (!loading && otp.length === 6) e.currentTarget.style.backgroundColor = '#D4B67A'
                }}
                onMouseLeave={(e) => {
                  if (!loading && otp.length === 6) e.currentTarget.style.backgroundColor = '#C9A86A'
                }}
              >
                {loading ? t('login.verifying', 'Verifying...') : t('login.verify', 'Verify')}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep('email')
                  setOtp('')
                  setError('')
                  setMessage('')
                }}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  backgroundColor: 'transparent',
                  color: '#B8B8B8',
                  border: '1px solid rgba(201, 168, 106, 0.3)',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#C9A86A'
                  e.currentTarget.style.color = '#C9A86A'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(201, 168, 106, 0.3)'
                  e.currentTarget.style.color = '#B8B8B8'
                }}
              >
                {t('login.useDifferentEmail', 'Use Different Email')}
              </button>
            </form>
          )}

          <p style={{
            color: '#B8B8B8',
            fontSize: '0.8rem',
            textAlign: 'center',
            marginTop: '2rem',
            lineHeight: '1.5',
          }}>
            {step === 'email' 
              ? 'New users will be automatically registered. No password needed.' 
              : 'Didn\'t receive the code? Check your spam folder or try again.'}
          </p>
        </div>

        <p style={{
          color: '#B8B8B8',
          fontSize: '0.8rem',
          textAlign: 'center',
          marginTop: '1.5rem',
        }}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>

      {/* Background decoration */}
      <div style={{
        position: 'fixed',
        width: '400px',
        height: '400px',
        border: '1px solid rgba(201, 168, 106, 0.06)',
        borderRadius: '50%',
        top: '20%',
        right: '-200px',
        pointerEvents: 'none',
        zIndex: 0,
      }} />
      <div style={{
        position: 'fixed',
        width: '350px',
        height: '350px',
        border: '1px solid rgba(201, 168, 106, 0.04)',
        borderRadius: '50%',
        bottom: '30%',
        left: '-175px',
        pointerEvents: 'none',
        zIndex: 0,
      }} />
    </div>
  )
}

