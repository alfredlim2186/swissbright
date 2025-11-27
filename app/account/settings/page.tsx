'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from '@/lib/useTranslations'
import { getMalaysiaStates } from '@/lib/malaysia-locations'

interface User {
  id: string
  email: string
  name: string | null
  aliasName?: string | null
  role: string
}

interface DeliveryProfile {
  name: string
  aliasName: string
  phoneNumber: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  postalCode: string
  country: string
}

const REQUIRED_FIELDS: (keyof DeliveryProfile)[] = [
  'name',
  'aliasName',
  'phoneNumber',
  'addressLine1',
  'state',
  'postalCode',
]

const emptyProfile: DeliveryProfile = {
  name: '',
  aliasName: '',
  phoneNumber: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'Malaysia',
}

export default function ManageAccountSettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<DeliveryProfile>(emptyProfile)
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileMessage, setProfileMessage] = useState('')
  const [profileError, setProfileError] = useState('')

  const { t } = useTranslations([
    'account.backToHome',
    'account.deliveryDetails',
    'account.deliveryDetailsDescription',
    'account.saveDeliveryDetails',
    'account.completeDeliveryDetails',
    'account.deliveryDetailsUpdated',
    'account.completeRequiredFields',
    'account.name',
    'account.aliasName',
    'account.nameAliasExplanation',
    'account.phoneNumber',
    'account.addressLine1',
    'account.addressLine2',
    'account.state',
    'account.postalCode',
    'account.selectState',
    'account.currentAddress',
    'account.saving',
    'account.noDeliveryAddress',
    'account.manageAccountSettings',
    'account.loading',
  ])

  const fetchProfile = useCallback(async () => {
    setLoading(true)
    try {
      const sessionRes = await fetch('/api/auth/me')
      const sessionData = await sessionRes.json()
      if (!sessionData.user) {
        router.push('/login')
        return
      }
      setUser(sessionData.user)

      const profileRes = await fetch('/api/account/profile')
      if (profileRes.ok) {
        const profileData = await profileRes.json()
        setProfile({
          name: sessionData.user.name ?? '',
          aliasName: profileData.profile?.aliasName ?? '',
          phoneNumber: profileData.profile?.phoneNumber ?? '',
          addressLine1: profileData.profile?.addressLine1 ?? '',
          addressLine2: profileData.profile?.addressLine2 ?? '',
          city: profileData.profile?.city ?? '',
          state: profileData.profile?.state ?? '',
          postalCode: profileData.profile?.postalCode ?? '',
          country: profileData.profile?.country ?? 'Malaysia',
        })
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const malaysiaStates = useMemo(() => getMalaysiaStates(), [])

  const isDeliveryComplete = useMemo(
    () => REQUIRED_FIELDS.every((field) => profile[field]?.trim()),
    [profile],
  )

  const handleProfileChange = (field: keyof DeliveryProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = async (event: React.FormEvent) => {
    event.preventDefault()
    setSavingProfile(true)
    setProfileError('')
    setProfileMessage('')

    try {
      const profileToSave = {
        name: profile.name,
        aliasName: profile.aliasName,
        phoneNumber: profile.phoneNumber,
        addressLine1: profile.addressLine1,
        addressLine2: profile.addressLine2,
        state: profile.state,
        postalCode: profile.postalCode,
        country: 'Malaysia',
      }

      const res = await fetch('/api/account/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileToSave),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save delivery details')
      }

      setProfileMessage(t('account.deliveryDetailsUpdated', 'Delivery details updated successfully.'))
      await fetchProfile()
      setTimeout(() => setProfileMessage(''), 3000)
    } catch (err: any) {
      setProfileError(err.message || 'Unable to save delivery details')
    } finally {
      setSavingProfile(false)
    }
  }

  const renderAddressPreview = () => {
    if (!profile.addressLine1 && !profile.state) {
      return t('account.noDeliveryAddress', 'No delivery address on file')
    }
    return [
      profile.addressLine1,
      profile.addressLine2,
      profile.city,
      profile.state,
      profile.postalCode,
      profile.country || 'Malaysia',
    ]
      .filter(Boolean)
      .join('\n')
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0A0A0A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#F8F8F8',
      }}>
        {t('account.loading', 'Loading...')}
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0A0A0A',
      padding: '2rem 1rem',
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Link
          href="/account"
          style={{
            color: '#B8B8B8',
            textDecoration: 'none',
            fontSize: '0.95rem',
            transition: 'color 0.3s ease',
            display: 'inline-block',
            marginBottom: '2rem',
          }}
        >
          {t('account.backToHome', '← Back to Home')}
        </Link>

        <section
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(201, 168, 106, 0.3)',
            padding: '2rem',
            borderRadius: '8px',
          }}
        >
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '2rem',
            color: '#C9A86A',
            marginBottom: '0.5rem',
          }}>
            {t('account.manageAccountSettings', 'Manage Account Settings')}
          </h1>
          <p style={{ color: '#B8B8B8', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            {t(
              'account.deliveryDetailsDescription',
              'These details are required when redeeming gifts. Keep them updated so shipments reach you without delays.',
            )}
          </p>

          {profileMessage && (
            <div
              style={{
                backgroundColor: 'rgba(201, 168, 106, 0.12)',
                border: '1px solid rgba(201, 168, 106, 0.35)',
                color: '#C9A86A',
                padding: '0.85rem 1rem',
                marginBottom: '1.25rem',
              }}
            >
              {profileMessage}
            </div>
          )}
          {profileError && (
            <div
              style={{
                backgroundColor: 'rgba(220, 38, 38, 0.12)',
                border: '1px solid rgba(220, 38, 38, 0.35)',
                color: '#FCA5A5',
                padding: '0.85rem 1rem',
                marginBottom: '1.25rem',
              }}
            >
              {profileError}
            </div>
          )}

          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div
              style={{
                backgroundColor: 'rgba(201, 168, 106, 0.05)',
                border: '1px solid rgba(201, 168, 106, 0.3)',
                padding: '1.25rem',
                borderRadius: '4px',
                marginBottom: '0.5rem',
              }}
            >
              <p
                style={{
                  color: '#B8B8B8',
                  fontSize: '0.85rem',
                  marginBottom: '1rem',
                  lineHeight: '1.5',
                }}
              >
                {t(
                  'account.nameAliasExplanation',
                  'Name is used for record purposes and to match winners for promotions and gifts. Alias Name will be used for all communication including package delivery.',
                )}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', color: '#F8F8F8', marginBottom: '0.35rem', fontSize: '0.85rem' }}>
                    {t('account.name', 'Name')} *
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleProfileChange('name', e.target.value)}
                    placeholder="Full Name"
                    style={{
                      width: '100%',
                      padding: '0.85rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(201, 168, 106, 0.25)',
                      color: '#F8F8F8',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#F8F8F8', marginBottom: '0.35rem', fontSize: '0.85rem' }}>
                    {t('account.aliasName', 'Alias Name')} *
                  </label>
                  <input
                    type="text"
                    value={profile.aliasName}
                    onChange={(e) => handleProfileChange('aliasName', e.target.value)}
                    placeholder="Name for delivery & communication"
                    style={{
                      width: '100%',
                      padding: '0.85rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(201, 168, 106, 0.25)',
                      color: '#F8F8F8',
                    }}
                  />
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', color: '#F8F8F8', marginBottom: '0.35rem', fontSize: '0.85rem' }}>
                {t('account.phoneNumber', 'Phone Number')} *
              </label>
              <input
                type="tel"
                value={profile.phoneNumber}
                onChange={(e) => handleProfileChange('phoneNumber', e.target.value)}
                placeholder="+60 12 345 6789"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(201, 168, 106, 0.25)',
                  color: '#F8F8F8',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#F8F8F8', marginBottom: '0.35rem', fontSize: '0.85rem' }}>
                {t('account.addressLine1', 'Address Line 1')} *
              </label>
              <input
                type="text"
                value={profile.addressLine1}
                onChange={(e) => handleProfileChange('addressLine1', e.target.value)}
                placeholder="House / Street"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(201, 168, 106, 0.25)',
                  color: '#F8F8F8',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#F8F8F8', marginBottom: '0.35rem', fontSize: '0.85rem' }}>
                {t('account.addressLine2', 'Address Line 2 (Optional)')}
              </label>
              <input
                type="text"
                value={profile.addressLine2}
                onChange={(e) => handleProfileChange('addressLine2', e.target.value)}
                placeholder="Apartment, Suite, etc."
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(201, 168, 106, 0.25)',
                  color: '#F8F8F8',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', color: '#F8F8F8', marginBottom: '0.35rem', fontSize: '0.85rem' }}>
                  {t('account.state', 'State')} *
                </label>
                <select
                  value={profile.state}
                  onChange={(e) => handleProfileChange('state', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(201, 168, 106, 0.25)',
                    color: '#F8F8F8',
                    cursor: 'pointer',
                  }}
                >
                  <option value="">{t('account.selectState', 'Select State')}</option>
                  {malaysiaStates.map((state) => (
                    <option key={state} value={state} style={{ backgroundColor: '#1a1a1a', color: '#F8F8F8' }}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', color: '#F8F8F8', marginBottom: '0.35rem', fontSize: '0.85rem' }}>
                  {t('account.postalCode', 'Postal Code')} *
                </label>
                <input
                  type="text"
                  value={profile.postalCode}
                  onChange={(e) => handleProfileChange('postalCode', e.target.value)}
                  placeholder="50000"
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(201, 168, 106, 0.25)',
                    color: '#F8F8F8',
                  }}
                />
              </div>
            </div>

            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              border: '1px dashed rgba(201, 168, 106, 0.4)',
              padding: '1rem',
              color: '#B8B8B8',
              fontSize: '0.9rem',
            }}>
              <strong style={{ color: '#C9A86A' }}>{t('account.currentAddress', 'Current address:')}</strong>
              <pre style={{ marginTop: '0.5rem', fontFamily: 'inherit', whiteSpace: 'pre-line' }}>
                {renderAddressPreview()}
              </pre>
            </div>

            {!isDeliveryComplete && (
              <div
                style={{
                  backgroundColor: 'rgba(250, 204, 21, 0.1)',
                  border: '1px solid rgba(250, 204, 21, 0.4)',
                  color: '#FDE047',
                  padding: '0.85rem',
                }}
              >
                {t('account.completeRequiredFields', 'Please complete all required fields (marked with *) before requesting shipments.')}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={savingProfile}
                style={{
                  padding: '0.9rem 1.5rem',
                  backgroundColor: savingProfile ? 'rgba(201, 168, 106, 0.4)' : '#C9A86A',
                  border: 'none',
                  color: '#0A0A0A',
                  fontWeight: 600,
                  letterSpacing: '0.2rem',
                  cursor: savingProfile ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                {savingProfile ? t('account.saving', 'Saving...') : t('account.saveDeliveryDetails', 'Save Delivery Details')}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  )
}

