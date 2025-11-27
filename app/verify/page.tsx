'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from '@/lib/useTranslations'

interface VerifyResult {
  valid: boolean
  message: string
  alreadyValidated?: boolean
  firstTime?: boolean
  batch?: string
  productId?: string
}

export default function VerifyPage() {
  const [code, setCode] = useState('')
  const [securityCode, setSecurityCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<VerifyResult | null>(null)

  // Fetch translations
  const { t } = useTranslations([
    'verify.title',
    'verify.description',
    'verify.code',
    'verify.securityCode',
    'verify.securityCodePlaceholder',
    'verify.securityCodeDescription',
    'verify.verify',
    'verify.verificationFailed',
    'verify.valid',
    'verify.invalid',
    'verify.verifying',
    'verify.reset',
  ])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/verify/forward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, securityCode }),
      })

      const data = await res.json()

      if (res.status === 401) {
        // Not logged in
        window.location.href = '/login'
        return
      }

      setResult(data)
    } catch (err) {
      setResult({
        valid: false,
        message: t('verify.verificationFailed', 'Verification failed. Please try again.'),
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setCode('')
    setResult(null)
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0A0A0A',
      padding: '2rem 1rem',
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Link href="/account" style={{
          display: 'inline-block',
          color: '#B8B8B8',
          textDecoration: 'none',
          fontSize: '0.95rem',
          marginBottom: '2rem',
        }}>
          ← Back to Account
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
            {t('verify.title', 'Product Verification')}
          </h1>

          <p style={{
            color: '#B8B8B8',
            textAlign: 'center',
            marginBottom: '2rem',
            fontSize: '0.95rem',
          }}>
            {t('verify.description', 'Enter your verification code to confirm your purchase')}
          </p>

          {!result ? (
            <form onSubmit={handleVerify}>
              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  color: '#F8F8F8',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                }}>
                  {t('verify.code', 'Verification Code')}
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.trim().toUpperCase())}
                  required
                  placeholder="Enter code from package"
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(201, 168, 106, 0.3)',
                    color: '#F8F8F8',
                    fontSize: '1.125rem',
                    letterSpacing: '2px',
                    textAlign: 'center',
                    outline: 'none',
                    textTransform: 'uppercase',
                  }}
                />
              </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                color: '#F8F8F8',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
              }}>
                {t('verify.securityCode', 'Security Code')}
              </label>
              <input
                type="text"
                value={securityCode}
                onChange={(e) => setSecurityCode(e.target.value.trim().toUpperCase())}
                required
                placeholder={t('verify.securityCodePlaceholder', 'Security code from seal')}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(201, 168, 106, 0.3)',
                  color: '#F8F8F8',
                  fontSize: '1.125rem',
                  letterSpacing: '0.2rem',
                  textAlign: 'center',
                  outline: 'none',
                  textTransform: 'uppercase',
                }}
              />
              <p style={{ color: '#B8B8B8', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                {t(
                  'verify.securityCodeDescription',
                  'Enter the secondary security code that accompanies the verification seal.',
                )}
              </p>
            </div>

              <button
                type="submit"
                disabled={loading || !code || !securityCode}
                style={{
                  width: '100%',
                  padding: '1rem',
                  backgroundColor: loading || !code || !securityCode ? 'rgba(201, 168, 106, 0.5)' : '#C9A86A',
                  color: '#0A0A0A',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: loading || !code || !securityCode ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.5px',
                }}
              >
                {loading ? t('verify.verifying', 'Verifying...') : t('verify.verify', 'Verify')}
              </button>
            </form>
          ) : (
            <div>
              {/* Result Card */}
              <div style={{
                backgroundColor: result.valid 
                  ? 'rgba(34, 197, 94, 0.1)' 
                  : result.alreadyValidated
                  ? 'rgba(234, 179, 8, 0.1)'
                  : 'rgba(220, 38, 38, 0.1)',
                border: `1px solid ${
                  result.valid 
                    ? 'rgba(34, 197, 94, 0.3)' 
                    : result.alreadyValidated
                    ? 'rgba(234, 179, 8, 0.3)'
                    : 'rgba(220, 38, 38, 0.3)'
                }`,
                padding: '2rem',
                marginBottom: '2rem',
                textAlign: 'center',
              }}>
                <div style={{ 
                  fontSize: '4rem', 
                  marginBottom: '1rem',
                }}>
                  {result.valid ? '✅' : result.alreadyValidated ? '⚠️' : '❌'}
                </div>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: '500',
                  color: result.valid 
                    ? '#86EFAC' 
                    : result.alreadyValidated
                    ? '#FDE047'
                    : '#FCA5A5',
                  marginBottom: '1rem',
                }}>
                  {result.valid ? t('verify.valid', 'Valid') : result.alreadyValidated ? t('verify.alreadyValidated', 'Already Validated') : t('verify.invalid', 'Invalid')}
                </div>
                <p style={{ 
                  color: '#B8B8B8',
                  fontSize: '0.95rem',
                  marginBottom: '1rem',
                }}>
                  {result.message}
                </p>
                
                {result.valid && (
                  <div style={{ 
                    borderTop: '1px solid rgba(34, 197, 94, 0.3)',
                    paddingTop: '1rem',
                    marginTop: '1rem',
                  }}>
                    {result.batch && (
                      <p style={{ color: '#B8B8B8', fontSize: '0.875rem' }}>
                        Batch: <span style={{ color: '#86EFAC' }}>{result.batch}</span>
                      </p>
                    )}
                    {result.productId && (
                      <p style={{ color: '#B8B8B8', fontSize: '0.875rem' }}>
                        Product ID: <span style={{ color: '#86EFAC' }}>{result.productId}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={handleReset}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  backgroundColor: '#C9A86A',
                  color: '#0A0A0A',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.5px',
                }}
              >
                {t('verify.reset', 'Reset')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

