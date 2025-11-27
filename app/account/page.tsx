 'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from '@/lib/useTranslations'
interface User {
  id: string
  email: string
  name: string | null
  aliasName?: string | null
  role: string
  totalPurchases: number
  totalGifts: number
  phoneNumber?: string | null
  addressLine1?: string | null
  addressLine2?: string | null
  city?: string | null
  state?: string | null
  postalCode?: string | null
  country?: string | null
  profileUpdatedAt?: string | null
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

interface LatestShipment {
  courierName: string
  trackingNumber: string
  status: string
  updatedAt: string
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
  country: 'Malaysia', // Default to Malaysia
}

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [redeeming, setRedeeming] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [profile, setProfile] = useState<DeliveryProfile>(emptyProfile)
  const [latestShipment, setLatestShipment] = useState<LatestShipment | null>(null)
  const [redemptions, setRedemptions] = useState<Array<{
    id: string
    status: string
    giftDesc: string | null
    giftImageUrl: string | null
    createdAt: string
    updatedAt: string
    courierName?: string | null
    trackingNumber?: string | null
    shippedAt?: string | null
  }>>([])
  const [availableGifts, setAvailableGifts] = useState<Array<{
    id: string
    name: string
    description: string | null
    imageUrl: string | null
    inventory: number
  }>>([])
  const [showGiftSelection, setShowGiftSelection] = useState(false)
  const [selectedGiftId, setSelectedGiftId] = useState<string | null>(null)
  const [drawInfo, setDrawInfo] = useState<{ enabled: boolean; draws: Array<{ description?: string }> }>({
    enabled: false,
    draws: [],
  })
  const [drawError, setDrawError] = useState('')

  const threshold = 10 // Should match GIFT_THRESHOLD env

  // Fetch translations
  const { t } = useTranslations([
    'account.backToHome',
    'account.signOut',
    'account.welcome',
    'account.verifiedPurchases',
    'account.giftsRedeemed',
    'account.giftEligibilityProgress',
    'account.purchasesToNextGift',
    'account.redeemYourGift',
    'account.processing',
    'account.keepPurchasing',
    'account.yourGiftRedemptions',
    'account.giftRedemption',
    'account.requested',
    'account.courier',
    'account.tracking',
    'account.deliveryDetails',
    'account.saveDeliveryDetails',
    'account.deliveryDetailsUpdated',
    'account.completeDeliveryDetails',
    'account.noGiftsAvailable',
    'account.pleaseSelectGift',
    'account.giftRedemptionSubmitted',
    'account.chooseYourGift',
    'account.selectGiftBelow',
    'account.selected',
    'account.confirmSelection',
    'account.close',
    'account.noDeliveryAddress',
    'account.phoneNumber',
    'account.addressLine1',
    'account.addressLine2',
    'account.city',
    'account.state',
    'account.postalCode',
    'account.country',
    'account.viewOrders',
    'account.loading',
    'account.saving',
    'account.deliveryDetailsDescription',
    'account.selectState',
    'account.name',
    'account.aliasName',
    'account.nameAliasExplanation',
    'account.yourGiftRedemptions',
    'account.statusPending',
    'account.statusApproved',
    'account.statusShipped',
    'account.statusRejected',
    'account.viewOrdersDescription',
    'account.verifyPurchase',
    'account.enterProductCode',
    'account.luckyDraw',
    'account.enterToWinPrizes',
    'account.currentAddress',
    'account.completeRequiredFields',
    'account.latestShipment',
    'account.status',
    'account.updated',
    'account.noCourierUpdates',
    'account.purchaseHistory',
    'account.noVerifiedPurchases',
    'account.verifyFirstPurchase',
    'account.youHave',
    'account.verifiedPurchase',
    'account.purchaseDetailsPending',
    'account.availableGifts',
    'account.giftDisclaimer',
  ])

  const fetchUserData = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me')
      const data = await res.json()

      if (!data.user) {
        router.push('/login')
        return
      }

      setUser(data.user)

      const profileRes = await fetch('/api/account/profile')
      if (profileRes.ok) {
        const profileData = await profileRes.json()
        setProfile({
          name: data.user?.name ?? '',
          aliasName: profileData.profile?.aliasName ?? '',
          phoneNumber: profileData.profile?.phoneNumber ?? '',
          addressLine1: profileData.profile?.addressLine1 ?? '',
          addressLine2: profileData.profile?.addressLine2 ?? '',
          city: profileData.profile?.city ?? '',
          state: profileData.profile?.state ?? '',
          postalCode: profileData.profile?.postalCode ?? '',
          country: profileData.profile?.country ?? 'Malaysia',
        })
        setLatestShipment(profileData.latestShipment || null)
      }

      const redemptionsRes = await fetch('/api/account/redemptions')
      if (redemptionsRes.ok) {
        const redemptionsData = await redemptionsRes.json()
        setRedemptions(redemptionsData.redemptions || [])
      }

      const giftsRes = await fetch('/api/gifts')
      if (giftsRes.ok) {
        const giftsData = await giftsRes.json()
        setAvailableGifts(giftsData.gifts || [])
      }
    } catch (err) {
      console.error('Failed to fetch user:', err)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchUserData()
  }, [fetchUserData])

  useEffect(() => {
    let mounted = true
    const fetchDraws = async () => {
      try {
        const res = await fetch('/api/draws')
        if (!res.ok) {
          const msg = await res.text()
          console.error('Lucky draw load failed', msg)
          if (mounted) setDrawError('Unable to load lucky draw info')
          return
        }
        const json = await res.json()
        if (mounted) {
          setDrawInfo({
            enabled: json.enabled,
            draws: Array.isArray(json.draws) ? json.draws : [],
          })
          setDrawError('')
        }
      } catch (err) {
        console.error('Lucky draw fetch error', err)
        if (mounted) setDrawError('Unable to load lucky draw info')
      }
    }
    fetchDraws()
    return () => {
      mounted = false
    }
  }, [])

  const isDeliveryComplete = useMemo(
    () => REQUIRED_FIELDS.every((field) => profile[field]?.trim()),
    [profile]
  )

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  const handleRedeemClick = () => {
    setError('')
    if (inStockGifts.length === 0) {
      setError(
        t(
          'account.giftsOutOfStock',
          'All gifts are currently out of stock. Please check back soon.',
        ),
      )
      return
    }
    if (!isDeliveryComplete) {
      setError(t('account.completeDeliveryDetails', 'Please complete your delivery details before redeeming a gift.'))
      return
    }
    
    if (availableGifts.length === 0) {
      setError(t('account.noGiftsAvailable', 'No gifts available at the moment. Please contact support.'))
      return
    }

    // Show gift selection if multiple gifts, otherwise auto-select if only one
    if (availableGifts.length === 1) {
      setSelectedGiftId(availableGifts[0].id)
      handleRedeem(availableGifts[0].id)
    } else {
      setShowGiftSelection(true)
    }
  }

  const handleRedeem = async (giftId?: string) => {
    const finalGiftId = giftId || selectedGiftId
    if (!finalGiftId) {
      setError(t('account.pleaseSelectGift', 'Please select a gift'))
      return
    }

    setRedeeming(true)
    setError('')
    setMessage('')
    setShowGiftSelection(false)

    try {
      const res = await fetch('/api/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ giftId: finalGiftId }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Redemption failed')
      }

      setMessage(t('account.giftRedemptionSubmitted', 'Gift redemption request submitted! We\'ll process it shortly.'))
      setSelectedGiftId(null)
      // Refresh user data
      await fetchUserData()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setRedeeming(false)
    }
  }

  // Get all Malaysia states
  // Calculate values that depend on user data (safe with null checks)
  const eligibleGifts = useMemo(() => {
    if (!user) return 0
    return Math.floor(user.totalPurchases / threshold)
  }, [user, threshold])

  const inStockGifts = useMemo(
    () => availableGifts.filter((gift) => gift.inventory > 0),
    [availableGifts],
  )
  const canRedeem = useMemo(() => {
    if (!user) return false
    if (inStockGifts.length === 0) return false
    return eligibleGifts > user.totalGifts
  }, [user, eligibleGifts, inStockGifts])

  const progressToNext = useMemo(() => {
    if (!user) return 0
    return user.totalPurchases % threshold
  }, [user, threshold])
  
  const progressPercent = useMemo(() => {
    return (progressToNext / threshold) * 100
  }, [progressToNext, threshold])

  const renderAddressPreview = () => {
    if (!profile.addressLine1 && !profile.state) {
      return t('account.noDeliveryAddress', 'No delivery address on file')
    }
    return [
      profile.addressLine1,
      profile.addressLine2,
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
      padding: '2rem 1rem 4rem',
      boxSizing: 'border-box',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '3rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <Link href="/" style={{
            color: '#B8B8B8',
            textDecoration: 'none',
            fontSize: '0.95rem',
            transition: 'color 0.3s ease',
          }}>
            {t('account.backToHome', '← Back to Home')}
          </Link>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.625rem 1.5rem',
              backgroundColor: 'transparent',
              border: '1px solid rgba(201, 168, 106, 0.5)',
              color: '#C9A86A',
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            {t('account.signOut', 'Sign Out')}
          </button>
        </div>

        {/* Welcome Section */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '2rem',
            marginBottom: '1rem',
          }}>
            <span style={{ color: '#C9A86A' }}>Sweet</span>
            <span style={{ 
              color: '#F8F8F8',
              textShadow: '0 0 8px rgba(255, 255, 255, 0.6)'
            }}>B</span>
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '2.5rem',
            color: '#F8F8F8',
            marginBottom: '0.5rem',
          }}>
            {t('account.welcome', 'Welcome')}{user.name ? `, ${user.name}` : ''}
          </h1>
          <p style={{ color: '#B8B8B8', fontSize: '0.95rem' }}>
            {user.email}
          </p>
        </div>

        {/* Messages */}
        {message && (
          <div style={{
            backgroundColor: 'rgba(201, 168, 106, 0.1)',
            border: '1px solid rgba(201, 168, 106, 0.3)',
            color: '#C9A86A',
            padding: '1rem',
            marginBottom: '2rem',
            textAlign: 'center',
          }}>
            {message}
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: 'rgba(220, 38, 38, 0.1)',
            border: '1px solid rgba(220, 38, 38, 0.3)',
            color: '#FCA5A5',
            padding: '1rem',
            marginBottom: '2rem',
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        {/* Quick Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          <Link
            href="/account/orders"
            style={{
              display: 'block',
              padding: '1rem',
              background: 'linear-gradient(135deg, rgba(249, 223, 176, 0.3), rgba(249, 223, 176, 0.3))',
              border: '1px solid rgba(201, 168, 106, 0.6)',
              borderRadius: '12px',
              color: '#1c1204',
              textDecoration: 'none',
              boxShadow: '0 8px 20px rgba(0,0,0,0.18)',
            }}
          >
            <div style={{
              fontSize: '2rem',
              marginBottom: '0.5rem',
              textAlign: 'center',
            }}>📦</div>
            <div style={{ fontWeight: 700, textAlign: 'center', color: '#FFFFFF' }}>{t('account.viewOrders', 'View Orders')}</div>
            <div style={{ fontSize: '0.875rem', color: '#B8B8B8', marginTop: '0.25rem', textAlign: 'center' }}>
              {t('account.viewOrdersDescription', 'Status, tracking, and history')}
            </div>
          </Link>
          <Link
            href="/verify"
            style={{
              display: 'block',
              padding: '1rem',
              background: 'linear-gradient(135deg, rgba(249, 223, 176, 0.3), rgba(249, 223, 176, 0.3))',
              border: '1px solid rgba(201, 168, 106, 0.6)',
              borderRadius: '12px',
              color: '#1c1204',
              textDecoration: 'none',
              boxShadow: '0 8px 20px rgba(0,0,0,0.18)',
            }}
          >
            <div style={{
              fontSize: '2rem',
              marginBottom: '0.5rem',
              textAlign: 'center',
            }}>✓</div>
            <div style={{ fontWeight: 700, textAlign: 'center', color: '#FFFFFF' }}>{t('account.verifyPurchase', 'Verify Purchase')}</div>
            <div style={{ fontSize: '0.875rem', color: '#B8B8B8', marginTop: '0.25rem', textAlign: 'center' }}>
              {t('account.enterProductCode', 'Enter product code')}
            </div>
          </Link>
          <Link
            href="/lucky-draw"
            style={{
              display: 'block',
              padding: '1rem',
              background: drawInfo.enabled && drawInfo.draws.length > 0
                ? 'linear-gradient(135deg, rgba(249, 223, 176, 0.3), rgba(249, 223, 176, 0.3))'
                : 'linear-gradient(135deg, rgba(200, 200, 200, 0.3), rgba(200, 200, 200, 0.5))',
              border: '1px solid rgba(201, 168, 106, 0.6)',
              borderRadius: '12px',
              color: '#1c1204',
              textDecoration: 'none',
              opacity: drawInfo.enabled && drawInfo.draws.length > 0 ? 1 : 0.6,
              pointerEvents: drawInfo.enabled && drawInfo.draws.length > 0 ? 'auto' : 'none',
              boxShadow: drawInfo.enabled && drawInfo.draws.length > 0 ? '0 8px 20px rgba(0,0,0,0.18)' : 'none',
            }}
          >
            <div style={{
              fontSize: '2rem',
              marginBottom: '0.5rem',
              textAlign: 'center',
            }}>🎲</div>
            <div style={{ fontWeight: 700, textAlign: 'center', color: '#FFFFFF' }}>{t('account.luckyDraw', 'Lucky Draw')}</div>
            <div style={{ fontSize: '0.875rem', color: '#B8B8B8', marginTop: '0.25rem', textAlign: 'center' }}>
              {drawInfo.enabled && drawInfo.draws.length > 0
                ? drawInfo.draws[0].description || t('account.enterToWinPrizes', 'Enter to win prizes')
                : t('account.luckyDrawClosed', 'No lucky draw is active right now. Check back soon.')}
            </div>
          </Link>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem',
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(201, 168, 106, 0.3)',
            padding: '2rem',
            textAlign: 'center',
          }}>
            <div style={{ 
              fontSize: '3rem', 
              color: '#C9A86A',
              fontWeight: 'bold',
              marginBottom: '0.5rem',
            }}>
              {user.totalPurchases}
            </div>
            <div style={{ color: '#B8B8B8', fontSize: '0.95rem' }}>
              {t('account.verifiedPurchases', 'Verified Purchases')}
            </div>
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(201, 168, 106, 0.3)',
            padding: '2rem',
            textAlign: 'center',
          }}>
            <div style={{ 
              fontSize: '3rem', 
              color: '#C9A86A',
              fontWeight: 'bold',
              marginBottom: '0.5rem',
            }}>
              {user.totalGifts}
            </div>
            <div style={{ color: '#B8B8B8', fontSize: '0.95rem' }}>
              {t('account.giftsRedeemed', 'Gifts Redeemed')}
            </div>
          </div>
        </div>

        <section
          id="manage-account-settings"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(201, 168, 106, 0.3)',
            padding: '2rem',
            marginBottom: '3rem',
            borderRadius: '8px',
          }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.75rem',
              color: '#C9A86A',
              marginBottom: '0.5rem',
            }}
          >
            {t('account.manageAccountSettings', 'Manage Account Settings')}
          </h2>
          <p style={{ color: '#B8B8B8', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            {t(
              'account.deliveryDetailsDescription',
              'These details are required when redeeming gifts. Keep them updated so shipments reach you without delays.',
            )}
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1rem',
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(201, 168, 106, 0.3)',
                padding: '1rem',
                borderRadius: '6px',
              }}
            >
              <div style={{ marginBottom: '0.75rem' }}>
                <strong style={{ color: '#F8F8F8' }}>{t('account.currentAddress', 'Delivery details')}</strong>
                <p style={{ color: '#B8B8B8', fontSize: '0.9rem', marginTop: '0.35rem' }}>
                  {isDeliveryComplete
                    ? t('account.deliveryDetailsUpdated', 'Delivery details updated successfully.')
                    : t('account.completeRequiredFields', 'Please complete all required fields (marked with *) before requesting shipments.')}
                </p>
              </div>
              <pre
                style={{
                  margin: 0,
                  whiteSpace: 'pre-line',
                  fontFamily: 'inherit',
                  color: '#F8F8F8',
                }}
              >
                {renderAddressPreview()}
              </pre>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: '1px dashed rgba(201, 168, 106, 0.4)',
                borderRadius: '6px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem',
              }}
            >
              <div>
                <p style={{ color: '#F8F8F8', fontWeight: 600, marginBottom: '0.5rem' }}>
                  {isDeliveryComplete
                    ? t('account.deliveryDetails', 'Delivery Details')
                    : t('account.completeDeliveryDetails', 'Please complete your delivery details')}
                </p>
                <p style={{ color: '#B8B8B8', marginBottom: '0.25rem' }}>
                  {profile.phoneNumber || t('account.phoneNumber', 'Phone Number')}
                </p>
                <p style={{ color: '#B8B8B8' }}>
                  {profile.aliasName || profile.name || t('account.aliasName', 'Alias Name')}
                </p>
              </div>
              <Link
                href="/account/settings"
                style={{
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.85rem 1.25rem',
                  backgroundColor: '#C9A86A',
                  color: '#0A0A0A',
                  fontWeight: 600,
                  borderRadius: '4px',
                }}
              >
                {t('account.manageAccountSettings', 'Manage Account Settings')}
              </Link>
            </div>
          </div>
        </section>

        <div style={{
          backgroundColor: 'rgba(201, 168, 106, 0.05)',
          border: '1px solid rgba(201, 168, 106, 0.3)',
          padding: '1.5rem',
          marginBottom: '3rem',
          borderRadius: '8px',
        }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.5rem',
            color: '#C9A86A',
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}>
            {t('account.giftEligibilityProgress', 'Gift Eligibility Progress')}
          </h2>

          <style dangerouslySetInnerHTML={{__html: `
            @media (max-width: 480px) {
              .gift-grid-mobile {
                grid-template-columns: 1fr !important;
              }
            }
          `}} />
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
          }}>
            {/* Top - Available Gifts */}
            {availableGifts.length > 0 && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
              }}>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.125rem',
                  color: '#C9A86A',
                  marginBottom: '1rem',
                }}>
                  {t('account.availableGifts', 'Available Gifts')}
                </h3>
                <div className="gift-grid-mobile" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.75rem',
                  marginBottom: '1rem',
                }}>
                  {Array.from({ length: 2 }).map((_, index) => {
                    const gift = availableGifts[index]
                    return (
                      <div
                        key={gift?.id || `empty-${index}`}
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(201, 168, 106, 0.3)',
                          borderRadius: '8px',
                          padding: '0.75rem',
                          textAlign: 'center',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          opacity: 1,
                        }}
                      >
                        {gift ? (
                          <>
                            {gift.imageUrl && (
                              <div style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: '0.75rem',
                                flexShrink: 0,
                              }}>
                                <div style={{
                                  width: '80px',
                                  height: '80px',
                                  position: 'relative',
                                  borderRadius: '8px',
                                  overflow: 'hidden',
                                  border: '1px solid rgba(201, 168, 106, 0.2)',
                                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                                }}>
                                  <img
                                    src={gift.imageUrl}
                                    alt={gift.name}
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover',
                                      transition: 'all 0.3s ease',
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                            <h4 style={{
                              fontFamily: "'Playfair Display', serif",
                              fontSize: '0.85rem',
                              color: '#F8F8F8',
                              marginBottom: '0.25rem',
                              fontWeight: '600',
                              flexShrink: 0,
                            }}>
                              {gift.name}
                            </h4>
                            {gift.description && (
                              <p style={{
                                color: '#B8B8B8',
                                fontSize: '0.7rem',
                                margin: 0,
                                lineHeight: '1.3',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical' as any,
                                flex: 1,
                              }}>
                                {gift.description}
                              </p>
                            )}
                            <p style={{ color: '#C9A86A', fontSize: '0.75rem', marginTop: '0.4rem' }}>
                              {gift.inventory > 0
                                ? t('account.onlyXLeft', `Only ${gift.inventory} left`)
                                : t('account.giftOutOfStock', 'Out of stock')}
                            </p>
                          </>
                        ) : (
                          <>
                            <div style={{
                              width: '100%',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              marginBottom: '0.75rem',
                              flexShrink: 0,
                            }}>
                              <div style={{
                                width: '80px',
                                height: '80px',
                                position: 'relative',
                                borderRadius: '8px',
                                border: '1px dashed rgba(201, 168, 106, 0.5)',
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                                <span style={{
                                  color: 'rgba(201, 168, 106, 0.7)',
                                  fontSize: '1.5rem',
                                }}>
                                  🎁
                                </span>
                              </div>
                            </div>
                            <h4 style={{
                              fontFamily: "'Playfair Display', serif",
                              fontSize: '0.85rem',
                              color: 'rgba(248, 248, 248, 0.7)',
                              marginBottom: '0.25rem',
                              fontWeight: '600',
                              flexShrink: 0,
                            }}>
                              Coming Soon
                            </h4>
                            <p style={{
                              color: 'rgba(184, 184, 184, 0.7)',
                              fontSize: '0.7rem',
                              margin: 0,
                              lineHeight: '1.3',
                            }}>
                              More gifts available soon
                            </p>
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
                {availableGifts.length > 2 && (
                  <p style={{
                    color: '#B8B8B8',
                    fontSize: '0.8rem',
                    textAlign: 'center',
                    fontStyle: 'italic',
                    marginBottom: '1rem',
                  }}>
                    +{availableGifts.length - 2} more {availableGifts.length - 2 === 1 ? 'gift' : 'gifts'} available
                  </p>
                )}
              </div>
            )}

            {/* Middle - Progress Bar */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
              <div style={{
                marginBottom: '1.5rem',
              }}>
                <div style={{
                  width: '100%',
                  height: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(201, 168, 106, 0.3)',
                  overflow: 'hidden',
                  borderRadius: '8px',
                  position: 'relative',
                }}>
                  <div style={{
                    width: `${progressPercent}%`,
                    height: '100%',
                    backgroundColor: '#C9A86A',
                    transition: 'width 0.5s ease',
                    borderRadius: '8px',
                  }} />
                </div>
              </div>

              <p style={{
                color: '#F8F8F8',
                textAlign: 'center',
                marginBottom: '1.5rem',
                fontSize: '1rem',
                fontWeight: '500',
              }}>
                {progressToNext} / {threshold} {t('account.purchasesToNextGift', 'purchases to next gift')}
              </p>

              <button
                onClick={handleRedeemClick}
                disabled={!canRedeem || redeeming}
                style={{
                  width: '100%',
                  padding: '1rem',
                  backgroundColor: !canRedeem
                    ? 'rgba(201, 168, 106, 0.25)'
                    : redeeming
                      ? 'rgba(201, 168, 106, 0.5)'
                      : '#C9A86A',
                  color: '#0A0A0A',
                  border: 'none',
                  fontSize: '1.125rem',
                  fontWeight: '500',
                  cursor: !canRedeem || redeeming ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.5px',
                  borderRadius: '4px',
                  marginBottom: '1.5rem',
                  opacity: (!canRedeem || redeeming) ? 0.6 : 1,
                }}
              >
                {redeeming ? t('account.processing', 'Processing...') : t('account.redeemYourGift', '🎁 Redeem Your Gift')}
              </button>

              {!canRedeem && eligibleGifts === user.totalGifts && (
                <div style={{
                  textAlign: 'center',
                  color: '#B8B8B8',
                  fontSize: '0.95rem',
                  fontStyle: 'italic',
                  marginBottom: '1.5rem',
                }}>
                  {t('account.keepPurchasing', 'Keep purchasing to unlock your next gift! 🌟')}
                </div>
              )}

              {/* Disclaimer - Below Progress Bar */}
              <div style={{
                backgroundColor: 'rgba(201, 168, 106, 0.08)',
                border: '1px solid rgba(201, 168, 106, 0.3)',
                padding: '0.75rem 1rem',
                borderRadius: '4px',
              }}>
                <p style={{
                  color: '#F8F8F8',
                  fontSize: '0.75rem',
                  margin: 0,
                  textAlign: 'center',
                  lineHeight: '1.4',
                }}>
                  ⚠️ {t('account.giftDisclaimer', 'Gifts are available on a first come, first served basis. Gift availability may change at any time without prior notice.')}
                </p>
              </div>
            </div>
          </div>
        </div>

          {/* Redemptions List */}
          {redemptions.length > 0 && (
            <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(201, 168, 106, 0.3)', paddingTop: '2rem' }}>
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.25rem',
                color: '#C9A86A',
                marginBottom: '1.5rem',
                textAlign: 'center',
              }}>
                {t('account.yourGiftRedemptions', 'Your Gift Redemptions')}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {redemptions.map((redemption) => (
                  <div
                    key={redemption.id}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(201, 168, 106, 0.3)',
                      padding: '1.5rem',
                      display: 'flex',
                      gap: '1.5rem',
                      alignItems: 'flex-start',
                    }}
                  >
                    {redemption.giftImageUrl && (
                      <img
                        src={redemption.giftImageUrl}
                        alt="Gift"
                        style={{
                          width: '120px',
                          height: '120px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid rgba(201, 168, 106, 0.3)',
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '0.75rem',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                      }}>
                        <h4 style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: '1.1rem',
                          color: '#F8F8F8',
                          margin: 0,
                        }}>
                          {redemption.giftDesc || t('account.giftRedemption', 'Gift Redemption')}
                        </h4>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          backgroundColor: 
                            redemption.status === 'PENDING' ? 'rgba(234, 179, 8, 0.2)' :
                            redemption.status === 'APPROVED' ? 'rgba(34, 197, 94, 0.2)' :
                            redemption.status === 'SHIPPED' ? 'rgba(59, 130, 246, 0.2)' :
                            'rgba(220, 38, 38, 0.2)',
                          color:
                            redemption.status === 'PENDING' ? '#FDE047' :
                            redemption.status === 'APPROVED' ? '#86EFAC' :
                            redemption.status === 'SHIPPED' ? '#93C5FD' :
                            '#FCA5A5',
                          fontSize: '0.75rem',
                          borderRadius: '4px',
                        }}>
                          {redemption.status === 'PENDING' ? t('account.statusPending', 'PENDING') :
                           redemption.status === 'APPROVED' ? t('account.statusApproved', 'APPROVED') :
                           redemption.status === 'SHIPPED' ? t('account.statusShipped', 'SHIPPED') :
                           redemption.status === 'REJECTED' ? t('account.statusRejected', 'REJECTED') :
                           redemption.status}
                        </span>
                      </div>
                      <p style={{ color: '#B8B8B8', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                        {t('account.requested', 'Requested:')} {new Date(redemption.createdAt).toLocaleDateString()}
                      </p>
                      {redemption.courierName && redemption.trackingNumber && (
                        <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                          <p style={{ color: '#F8F8F8', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                            <strong>{t('account.courier', 'Courier:')}</strong> {redemption.courierName}
                          </p>
                          <p style={{ color: '#F8F8F8', fontSize: '0.9rem' }}>
                            <strong>{t('account.tracking', 'Tracking:')}</strong> {redemption.trackingNumber}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Gift Selection Modal */}
        {showGiftSelection && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 1100,
          }}>
            <div style={{
              backgroundColor: '#0A0A0A',
              border: '1px solid rgba(201, 168, 106, 0.4)',
              padding: '2rem',
              width: '100%',
              maxWidth: '800px',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}>
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.75rem',
                color: '#C9A86A',
                marginBottom: '1.5rem',
                textAlign: 'center',
              }}>
                {t('account.chooseYourGift', 'Choose Your Gift')}
              </h3>
              <p style={{ color: '#B8B8B8', textAlign: 'center', marginBottom: '2rem' }}>
                {t('account.selectGiftBelow', 'Select one of the available gifts below')}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {availableGifts.map((gift) => (
                  <div
                    key={gift.id}
                    onClick={() => setSelectedGiftId(gift.id)}
                    style={{
                      backgroundColor: selectedGiftId === gift.id ? 'rgba(201, 168, 106, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                      border: `2px solid ${selectedGiftId === gift.id ? '#C9A86A' : 'rgba(201, 168, 106, 0.3)'}`,
                      padding: '1.5rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedGiftId !== gift.id) {
                        e.currentTarget.style.borderColor = 'rgba(201, 168, 106, 0.5)'
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedGiftId !== gift.id) {
                        e.currentTarget.style.borderColor = 'rgba(201, 168, 106, 0.3)'
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)'
                      }
                    }}
                  >
                    {gift.imageUrl && (
                      <img
                        src={gift.imageUrl}
                        alt={gift.name}
                        style={{
                          width: '100%',
                          height: '180px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          marginBottom: '1rem',
                          border: '1px solid rgba(201, 168, 106, 0.3)',
                        }}
                      />
                    )}
                    <h4 style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '1.1rem',
                      color: '#F8F8F8',
                      marginBottom: '0.5rem',
                    }}>
                      {gift.name}
                    </h4>
                    {gift.description && (
                      <p style={{ color: '#B8B8B8', fontSize: '0.9rem' }}>
                        {gift.description}
                      </p>
                    )}
                    {selectedGiftId === gift.id && (
                      <div style={{
                        marginTop: '1rem',
                        textAlign: 'center',
                        color: '#C9A86A',
                        fontWeight: '600',
                      }}>
                        {t('account.selected', '✓ Selected')}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => handleRedeem()}
                  disabled={!selectedGiftId || redeeming}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    backgroundColor: (!selectedGiftId || redeeming) ? 'rgba(201, 168, 106, 0.3)' : '#C9A86A',
                    color: '#0A0A0A',
                    border: 'none',
                    fontWeight: 600,
                    cursor: (!selectedGiftId || redeeming) ? 'not-allowed' : 'pointer',
                  }}
                >
                  {redeeming ? t('account.processing', 'Processing...') : t('account.confirmSelection', 'Confirm Selection')}
                </button>
                <button
                  onClick={() => {
                    setShowGiftSelection(false)
                    setSelectedGiftId(null)
                  }}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(201, 168, 106, 0.4)',
                    color: '#C9A86A',
                    cursor: 'pointer',
                  }}
                >
                  {t('account.close', 'Close')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Latest Shipment */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(201, 168, 106, 0.3)',
          padding: '2rem',
          marginBottom: '3rem',
        }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.5rem',
            color: '#C9A86A',
            marginBottom: '1rem',
          }}>
            {t('account.latestShipment', 'Latest Shipment')}
          </h2>
          {latestShipment ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#F8F8F8' }}>
              <div style={{ fontSize: '1.1rem' }}>
                <strong>{t('account.courier', 'Courier:')}</strong> {latestShipment.courierName}
              </div>
              <div>
                <strong>{t('account.tracking', 'Tracking:')}</strong> {latestShipment.trackingNumber}
              </div>
              <div style={{ color: '#B8B8B8', fontSize: '0.9rem' }}>
                {t('account.status', 'Status')}: {latestShipment.status} · {t('account.updated', 'Updated')}{' '}
                {new Date(latestShipment.updatedAt).toLocaleString()}
              </div>
            </div>
          ) : (
            <p style={{ color: '#B8B8B8' }}>{t('account.noCourierUpdates', 'No courier updates yet. Once a gift ships, tracking details will appear here.')}</p>
          )}
        </div>

        {/* Purchase History */}
        <div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.875rem',
            color: '#C9A86A',
            marginBottom: '1.5rem',
          }}>
            {t('account.purchaseHistory', 'Purchase History')}
          </h2>

          {user.totalPurchases === 0 ? (
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(201, 168, 106, 0.3)',
              padding: '3rem 2rem',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
              <p style={{ color: '#B8B8B8', marginBottom: '1.5rem' }}>
                {t('account.noVerifiedPurchases', 'No verified purchases yet')}
              </p>
              <Link
                href="/verify"
                style={{
                  display: 'inline-block',
                  padding: '0.75rem 2rem',
                  backgroundColor: '#C9A86A',
                  color: '#0A0A0A',
                  textDecoration: 'none',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                }}
              >
                {t('account.verifyFirstPurchase', 'Verify Your First Purchase')}
              </Link>
            </div>
          ) : (
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(201, 168, 106, 0.3)',
              padding: '1.5rem',
            }}>
              <p style={{ color: '#B8B8B8', textAlign: 'center' }}>
                {`${t('account.youHave', 'You have')} ${user.totalPurchases} ${user.totalPurchases === 1 ? t('account.verifiedPurchase', 'verified purchase') : t('account.verifiedPurchases', 'verified purchases')}`}
              </p>
              <p style={{ 
                color: '#B8B8B8', 
                fontSize: '0.875rem', 
                textAlign: 'center',
                marginTop: '1rem',
              }}>
                {t('account.purchaseDetailsPending', 'Purchase details will appear here once implemented')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

