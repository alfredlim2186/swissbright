'use client'

import { useEffect, useMemo, useState } from 'react'
import styles from './shop.module.css'

export type ShopProduct = {
  id: string
  name: string
  slug: string
  description: string
  longDescription: string
  heroImageUrl: string
  price: number
  inventory: number
  isActive: boolean
  isFeatured: boolean
  images: Array<{
    id?: string
    url: string
    altText?: string
    sortOrder: number
  }>
}

type CartItem = {
  productId: string
  quantity: number
}

const CART_STORAGE_KEY = 'sweetb_shop_cart_v1'
const currency = new Intl.NumberFormat('en-MY', {
  style: 'currency',
  currency: 'MYR',
})

type ShopPromotion = {
  name: string
  discountType: 'PERCENTAGE' | 'FIXED'
  discountValue: number
}

const applyPromotion = (price: number, promotion?: ShopPromotion | null) => {
  const cents = Math.round(price * 100)
  if (!promotion) {
    return { sale: price, cents, original: null }
  }

  const discount =
    promotion.discountType === 'PERCENTAGE'
      ? Math.min(cents, Math.floor((cents * promotion.discountValue) / 100))
      : Math.min(cents, promotion.discountValue)

  const finalCents = cents - discount
  return {
    sale: finalCents / 100,
    cents: finalCents,
    original: price,
  }
}

export default function ShopClient({
  products,
  promotion,
  whatsappLink,
  translations,
}: {
  products: ShopProduct[]
  promotion?: ShopPromotion | null
  whatsappLink?: { label: string; url: string }
  translations?: {
    featured?: string
    cart?: string
    manualCheckout?: string
    addToCart?: string
    viewCart?: string
    soldOut?: string
    inInventory?: string
    outOfStock?: string
    subtotal?: string
    total?: string
    shipping?: string
    shippingFee?: string
    promoCode?: string
    checkout?: string
    clearCart?: string
    checkoutNote?: string
    bankTransferDetails?: string
    bankName?: string
    accountNumber?: string
    selectCourier?: string
    addProductsFirst?: string
    processing?: string
    catalog?: string
    catalogHint?: string
    confirmCheckout?: string
    orderSummary?: string
    redirectWhatsApp?: string
    cancel?: string
    placeOrder?: string
  }
}) {
  const t = translations || {}
  const activeProducts = products.filter((product) => product.isActive)
  const featuredProducts = activeProducts.filter((product) => product.isFeatured)
  const standardProducts = activeProducts.filter((product) => !product.isFeatured)

  // Initialize cart from localStorage to prevent race condition
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(CART_STORAGE_KEY)
        if (stored) {
          return JSON.parse(stored)
        }
      } catch {
        // ignore
      }
    }
    return []
  })
  const [drawerOpen, setDrawerOpen] = useState(true)
  const [activeFeaturedId, setActiveFeaturedId] = useState<string | null>(featuredProducts[0]?.id ?? null)
  const [placingOrder, setPlacingOrder] = useState(false)
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null)
  const [promoCode, setPromoCode] = useState('')
  const [couriers, setCouriers] = useState<Array<{ id: string; name: string; fee: number; description?: string | null }>>([])
  const [selectedCourierId, setSelectedCourierId] = useState<string>('')
  const [showCheckoutConfirm, setShowCheckoutConfirm] = useState(false)
  const [bankingDetails, setBankingDetails] = useState<{ bankName: string; accountNumber: string } | null>(null)
  const [featuredImageIndex, setFeaturedImageIndex] = useState(0)
  const [isCartLoaded, setIsCartLoaded] = useState(false)

  // Mark cart as loaded after initial render
  useEffect(() => {
    setIsCartLoaded(true)
  }, [])

  // Save cart to localStorage only after initial load to prevent overwriting
  useEffect(() => {
    if (!isCartLoaded) return // Don't save until we've confirmed initial load
    
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
      // Dispatch custom event for header cart icon to update
      window.dispatchEvent(new Event('cartUpdated'))
    } catch {
      // ignore
    }
  }, [cart, isCartLoaded])

  useEffect(() => {
    if (featuredProducts.length > 0 && !featuredProducts.find((product) => product.id === activeFeaturedId)) {
      setActiveFeaturedId(featuredProducts[0].id)
    }
  }, [featuredProducts, activeFeaturedId])

  useEffect(() => {
    // Reset image index when featured product changes
    setFeaturedImageIndex(0)
  }, [activeFeaturedId])

  useEffect(() => {
    fetch('/api/couriers')
      .then((res) => res.json())
      .then((data) => {
        if (data.couriers) {
          setCouriers(data.couriers)
        }
      })
      .catch((err) => console.error('Failed to load couriers', err))
  }, [])

  useEffect(() => {
    fetch('/api/banking-details')
      .then((res) => res.json())
      .then((data) => {
        if (data.bankName && data.accountNumber) {
          setBankingDetails({ bankName: data.bankName, accountNumber: data.accountNumber })
        }
      })
      .catch((err) => console.error('Failed to load banking details', err))
  }, [])

  const cartDetails = useMemo(() => {
    return cart
      .map((item) => {
        const product = products.find((prod) => prod.id === item.productId)
        if (!product) return null
        const quantity = Math.min(item.quantity, product.inventory)
        if (quantity <= 0) return null
        const priceInfo = applyPromotion(product.price, promotion)
        return { product, quantity, unitPrice: priceInfo.sale, originalPrice: priceInfo.original }
      })
      .filter(Boolean) as Array<{ product: ShopProduct; quantity: number; unitPrice: number; originalPrice: number | null }>
  }, [cart, products, promotion])

  const subtotal = cartDetails.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)

  const shippingFee = useMemo(() => {
    if (selectedCourierId) {
      const courier = couriers.find((c) => c.id === selectedCourierId)
      return courier ? courier.fee : 0
    }
    return 0
  }, [selectedCourierId, couriers])

  const total = subtotal + shippingFee

  const activeFeatured =
    featuredProducts.find((product) => product.id === activeFeaturedId) ||
    featuredProducts[0] ||
    standardProducts[0] ||
    null
  const activeFeaturedPrice = activeFeatured ? applyPromotion(activeFeatured.price, promotion) : null

  const handleAddToCart = (productId: string) => {
    const product = products.find((item) => item.id === productId)
    if (!product || product.inventory <= 0) return

    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId)
      if (!existing) {
        return [...prev, { productId, quantity: 1 }]
      }
      const nextQuantity = Math.min(existing.quantity + 1, product.inventory)
      return prev.map((item) => (item.productId === productId ? { ...item, quantity: nextQuantity } : item))
    })
    setDrawerOpen(true)
  }

  const handleQuantityChange = (productId: string, quantity: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.productId === productId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0),
    )
  }

  const handleClearCart = () => setCart([])

  const handleCheckoutClick = async () => {
    if (cartDetails.length === 0) return
    
    // Check authentication before showing confirmation
    try {
      const authRes = await fetch('/api/auth/me')
      if (!authRes.ok || authRes.status === 401) {
        // Not authenticated, redirect to login
        window.location.href = '/login?redirect=/shop'
        return
      }
      
      const authData = await authRes.json()
      if (!authData.user) {
        // No user data, redirect to login
        window.location.href = '/login?redirect=/shop'
        return
      }
      
      // User is authenticated, show confirmation modal
      setShowCheckoutConfirm(true)
    } catch (error) {
      console.error('Auth check failed:', error)
      // On error, redirect to login to be safe
      window.location.href = '/login?redirect=/shop'
    }
  }

  const handleCheckout = async () => {
    if (cartDetails.length === 0 || placingOrder) return
    setCheckoutMessage(null)
    setShowCheckoutConfirm(false)

    try {
      setPlacingOrder(true)
      const payload: Record<string, unknown> = {
        items: cartDetails.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      }

      if (promoCode.trim()) {
        payload.promoCode = promoCode.trim()
      }

      if (selectedCourierId) {
        payload.courierId = selectedCourierId
      }

      if (shippingFee > 0) {
        payload.shippingFeeCents = Math.round(shippingFee * 100)
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.status === 401) {
        setCheckoutMessage('Please sign up or log in to your SweetB account before placing an order.')
        window.location.href = '/login?redirect=/shop'
        return
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to create order. Try again.')
      }

      const data = await res.json()
      const orderId: string | undefined = data.order?.id

      const summaryLines = cartDetails.map(
        (item) => `${item.quantity} × ${item.product.name} (${currency.format(item.unitPrice)})`,
      )
      const messageBody = [
        'Hi SweetB team, I\'d like to place an order:',
        '',
        orderId ? `Order ID: ${orderId}` : '',
        ...summaryLines,
        '',
        `Subtotal: ${currency.format(subtotal)}`,
        shippingFee > 0 ? `Shipping: ${currency.format(shippingFee)}` : '',
        `Total: ${currency.format(total)}`,
        '',
        'I am a registered member and will send payment advice shortly.',
      ]
        .filter(Boolean)
        .join('\n')

      const promoApplied = data.order?.promoCode?.code
      setCheckoutMessage(
        `${orderId ? `Order ${orderId.slice(-6).toUpperCase()}` : 'Order'} saved. ${
          promoApplied ? `Promo ${promoApplied} applied. ` : ''
        }Send payment advice via WhatsApp so we can confirm it.`,
      )
      setCart([])
      setPromoCode('')
      setSelectedCourierId('')
      setShowCheckoutConfirm(false)

      if (whatsappLink) {
        const encoded = encodeURIComponent(messageBody)
        const separator = whatsappLink.url.includes('?') ? '&' : '?'
        const target = whatsappLink.url.includes('wa.me') || whatsappLink.url.includes('whatsapp')
          ? `${whatsappLink.url}${separator}text=${encoded}`
          : whatsappLink.url
        window.open(target, '_blank')
      } else {
        alert('Order captured. Contact us via the Contact page to share your payment proof.')
      }
    } catch (error: any) {
      setCheckoutMessage(error.message || 'Checkout failed. Please try again.')
    } finally {
      setPlacingOrder(false)
    }
  }

  return (
    <div className={styles.shopClient}>
      <div className={styles.shopLayout}>
        <div className={styles.productsColumn}>
          {activeFeatured && (
            <section className={styles.featuredSection}>
              <div className={styles.featuredCard}>
                <div className={styles.featuredCopy}>
                  <p className={styles.eyebrow}>{t.featured || 'Featured'}</p>
                  <h3>{activeFeatured.name}</h3>
                  <p className={styles.featuredDescription}>
                    {activeFeatured.longDescription || activeFeatured.description || 'A limited run crafted for modern stamina.'}
                  </p>
                  <div className={styles.featuredMeta}>
                    <div className={styles.priceWrap}>
                      <span className={styles.priceValue}>
                        {currency.format(activeFeaturedPrice?.sale ?? activeFeatured.price)}
                      </span>
                      {activeFeaturedPrice?.original && (
                        <span className={styles.originalPrice}>{currency.format(activeFeaturedPrice.original)}</span>
                      )}
                      {promotion && <span className={styles.saleBadge}>Sale</span>}
                    </div>
                    {activeFeatured.inventory === 0 && <span>{t.outOfStock || 'Out of stock'}</span>}
                  </div>
                  <div className={styles.featuredActions}>
                    <button
                      className={styles.primaryButton}
                      onClick={() => handleAddToCart(activeFeatured.id)}
                      disabled={activeFeatured.inventory === 0}
                    >
                      {activeFeatured.inventory === 0 ? (t.soldOut || 'Sold Out') : (t.addToCart || 'Add to Cart')}
                    </button>
                    <button className={styles.secondaryButton} onClick={() => setDrawerOpen(true)}>
                      {t.viewCart || 'View Cart'}
                    </button>
                  </div>
                </div>
                <div className={styles.featuredMedia}>
                  {(() => {
                    const allImages = [
                      ...(activeFeatured.heroImageUrl ? [{ url: activeFeatured.heroImageUrl, id: 'hero' }] : []),
                      ...activeFeatured.images.slice(0, 3),
                    ].slice(0, 3)
                    
                    if (allImages.length === 0) {
                      return (
                        <img
                          src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1200&q=80"
                          alt={activeFeatured.name}
                        />
                      )
                    }
                    
                    return (
                      <div className={styles.imageCarousel}>
                        <div className={styles.carouselContainer}>
                          {allImages.map((img, idx) => (
                            <img
                              key={img.id || idx}
                              src={img.url}
                              alt={activeFeatured.name}
                              className={idx === featuredImageIndex ? styles.carouselImageActive : styles.carouselImage}
                              style={{ display: idx === featuredImageIndex ? 'block' : 'none' }}
                            />
                          ))}
                        </div>
                        {allImages.length > 1 && (
                          <div className={styles.carouselControls}>
                            <button
                              className={styles.carouselButton}
                              onClick={() => setFeaturedImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                              aria-label="Previous image"
                            >
                              ‹
                            </button>
                            <div className={styles.carouselDots}>
                              {allImages.map((_, idx) => (
                                <button
                                  key={idx}
                                  className={`${styles.carouselDot} ${idx === featuredImageIndex ? styles.carouselDotActive : ''}`}
                                  onClick={() => setFeaturedImageIndex(idx)}
                                  aria-label={`Go to image ${idx + 1}`}
                                />
                              ))}
                            </div>
                            <button
                              className={styles.carouselButton}
                              onClick={() => setFeaturedImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
                              aria-label="Next image"
                            >
                              ›
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </div>
              </div>
              {featuredProducts.length > 1 && (
                <div className={styles.featuredNav}>
                  {featuredProducts.map((product) => (
                    <button
                      key={product.id}
                      className={`${styles.featuredPill} ${
                        product.id === activeFeatured.id ? styles.featuredPillActive : ''
                      }`}
                      onClick={() => setActiveFeaturedId(product.id)}
                    >
                      {product.name}
                    </button>
                  ))}
                </div>
              )}
            </section>
          )}

        </div>

        <aside className={styles.cartColumn}>
          <CartPanel
            open={drawerOpen}
            onToggle={() => setDrawerOpen((prev) => !prev)}
            items={cartDetails}
            subtotal={subtotal}
            shippingFee={shippingFee}
            total={total}
            couriers={couriers}
            selectedCourierId={selectedCourierId}
            onCourierChange={setSelectedCourierId}
            onClear={handleClearCart}
            onQuantityChange={handleQuantityChange}
            onCheckout={handleCheckoutClick}
            whatsappLabel={whatsappLink?.label}
            placingOrder={placingOrder}
            statusMessage={checkoutMessage}
            promoCode={promoCode}
            onPromoCodeChange={setPromoCode}
            bankingDetails={bankingDetails}
            translations={t}
          />
        </aside>
      </div>

      {/* Checkout Confirmation Modal */}
      {showCheckoutConfirm && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(8px)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowCheckoutConfirm(false)
              }
            }}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.98) 0%, rgba(201, 168, 106, 0.08) 50%, rgba(10, 10, 10, 0.98) 100%)',
                border: '2px solid rgba(201, 168, 106, 0.4)',
                borderRadius: '12px',
                maxWidth: '500px',
                width: '100%',
                padding: '2rem',
                position: 'relative',
              }}
            >
              <button
                onClick={() => setShowCheckoutConfirm(false)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'none',
                  border: 'none',
                  color: '#B8B8B8',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', color: '#F8F8F8', marginBottom: '1rem' }}>
                {t.confirmCheckout || 'Confirm Checkout'}
              </h3>
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ color: '#B8B8B8', marginBottom: '0.75rem' }}>{t.orderSummary || 'Order Summary:'}</p>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', marginBottom: '0.75rem' }}>
                  {cartDetails.map((item) => (
                    <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      <span style={{ color: '#F8F8F8' }}>{item.quantity} × {item.product.name}</span>
                      <span style={{ color: '#C9A86A' }}>{currency.format(item.unitPrice * item.quantity)}</span>
                    </div>
                  ))}
                  {shippingFee > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(201,168,106,0.2)' }}>
                      <span style={{ color: '#B8B8B8' }}>{t.shipping || 'Shipping'}</span>
                      <span style={{ color: '#C9A86A' }}>{currency.format(shippingFee)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(201,168,106,0.3)', fontWeight: 600 }}>
                    <span style={{ color: '#F8F8F8' }}>{t.total || 'Total'}</span>
                    <span style={{ color: '#C9A86A' }}>{currency.format(total)}</span>
                  </div>
                </div>
                <p style={{ color: '#B8B8B8', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  {t.redirectWhatsApp || 'You\'ll be redirected to WhatsApp to send payment advice after placing the order.'}
                </p>
                {bankingDetails && bankingDetails.bankName && bankingDetails.accountNumber && (
                  <div style={{
                    marginTop: '1.5rem',
                    padding: '1.25rem',
                    background: 'rgba(201, 168, 106, 0.1)',
                    border: '2px solid rgba(201, 168, 106, 0.4)',
                    borderRadius: '8px',
                  }}>
                    <p style={{
                      color: '#C9A86A',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      margin: '0 0 1rem 0',
                      textAlign: 'center',
                    }}>
                      {t.bankTransferDetails || 'Bank Transfer Details'}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.5rem 0',
                        borderBottom: '1px solid rgba(201, 168, 106, 0.2)',
                      }}>
                        <span style={{ color: '#B8B8B8', fontSize: '0.9rem', fontWeight: 500 }}>
                          Bank Name:
                        </span>
                        <span style={{ color: '#F8F8F8', fontSize: '1rem', fontWeight: 600, letterSpacing: '0.5px' }}>
                          {bankingDetails.bankName}
                        </span>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.5rem 0',
                      }}>
                        <span style={{ color: '#B8B8B8', fontSize: '0.9rem', fontWeight: 500 }}>
                          {t.accountNumber || 'Account Number:'}
                        </span>
                        <span style={{ color: '#F8F8F8', fontSize: '1rem', fontWeight: 600, letterSpacing: '0.5px' }}>
                          {bankingDetails.accountNumber}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => setShowCheckoutConfirm(false)}
                  style={{
                    flex: 1,
                    padding: '0.85rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(201,168,106,0.3)',
                    backgroundColor: 'transparent',
                    color: '#C9A86A',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  {t.cancel || 'Cancel'}
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={placingOrder}
                  style={{
                    flex: 1,
                    padding: '0.85rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#C9A86A',
                    color: '#050505',
                    cursor: placingOrder ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    opacity: placingOrder ? 0.6 : 1,
                  }}
                >
                  {placingOrder ? (t.processing || 'Processing...') : (t.placeOrder || 'Place Order')}
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}

function CartPanel({
  open,
  onToggle,
  items,
  subtotal,
  shippingFee,
  total,
  couriers,
  selectedCourierId,
  onCourierChange,
  onQuantityChange,
  onClear,
  onCheckout,
  whatsappLabel,
  placingOrder,
  statusMessage,
  promoCode,
  onPromoCodeChange,
  bankingDetails,
  translations,
}: {
  open: boolean
  onToggle: () => void
  items: Array<{ product: ShopProduct; quantity: number; unitPrice: number; originalPrice: number | null }>
  subtotal: number
  shippingFee: number
  total: number
  couriers: Array<{ id: string; name: string; fee: number; description?: string | null }>
  selectedCourierId: string
  onCourierChange: (id: string) => void
  onQuantityChange: (productId: string, quantity: number) => void
  onClear: () => void
  onCheckout: () => void
  whatsappLabel?: string
  placingOrder: boolean
  statusMessage: string | null
  promoCode: string
  onPromoCodeChange: (value: string) => void
  bankingDetails: { bankName: string; accountNumber: string } | null
  translations?: {
    cart?: string
    manualCheckout?: string
    subtotal?: string
    shipping?: string
    shippingFee?: string
    total?: string
    promoCode?: string
    checkoutNote?: string
    bankTransferDetails?: string
    bankName?: string
    accountNumber?: string
    selectCourier?: string
    checkout?: string
    clearCart?: string
    processing?: string
    addProductsFirst?: string
    catalogHint?: string
  }
}) {
  const t = translations || {}
  return (
    <div className={styles.cartPanel}>
      <div className={styles.cartHeader}>
        <div>
          <p className={styles.eyebrow}>{t.cart || 'Cart'}</p>
          <h4>{t.manualCheckout || 'Manual Checkout'}</h4>
        </div>
        <button className={styles.secondaryButton} onClick={onToggle}>
          {open ? 'Hide' : 'Open'}
        </button>
      </div>

      {open && (
        <>
          <div className={styles.cartBody}>
            {items.length === 0 ? (
              <p className={styles.catalogHint}>{t.catalogHint || 'Add a product to begin your order.'}</p>
            ) : (
              items.map((item) => (
                <div key={item.product.id} className={styles.cartLine}>
                  <div>
                    <p className={styles.cartLineTitle}>{item.product.name}</p>
                    <p className={styles.cartLineMeta}>
                      {currency.format(item.unitPrice)}
                      {item.originalPrice && (
                        <span className={styles.originalPrice}>{currency.format(item.originalPrice)}</span>
                      )}
                    </p>
                  </div>
                  <div className={styles.cartActions}>
                    <button onClick={() => onQuantityChange(item.product.id, Math.max(0, item.quantity - 1))}>−</button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        onQuantityChange(
                          item.product.id,
                          Math.min(item.quantity + 1, item.product.inventory),
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className={styles.cartSummary}>
            <div className={styles.cartSubtotal}>
              <span>{t.subtotal || 'Subtotal'}</span>
              <span>{currency.format(subtotal)}</span>
            </div>
            <div className={styles.shippingRow}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                <span style={{ color: '#B8B8B8' }}>Shipping</span>
                {couriers.length > 0 && (
                  <select
                    value={selectedCourierId}
                    onChange={(e) => onCourierChange(e.target.value)}
                    style={{
                      padding: '0.65rem',
                      backgroundColor: 'rgba(0,0,0,0.4)',
                      border: '1px solid rgba(201,168,106,0.25)',
                      borderRadius: '6px',
                      color: '#F8F8F8',
                      fontSize: '0.9rem',
                    }}
                  >
                    <option value="">{t.selectCourier || 'Select courier'}</option>
                    {couriers.map((courier) => (
                      <option key={courier.id} value={courier.id}>
                        {courier.name} - {currency.format(courier.fee)}
                      </option>
                    ))}
                  </select>
                )}
              </label>
            </div>
            {shippingFee > 0 && (
              <div className={styles.cartSubtotal} style={{ fontSize: '0.9rem', color: '#B8B8B8' }}>
                <span>{t.shippingFee || 'Shipping Fee'}</span>
                <span>{currency.format(shippingFee)}</span>
              </div>
            )}
            <div className={styles.cartSubtotal} style={{ marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(201,168,106,0.2)' }}>
              <span style={{ fontWeight: 600 }}>{t.total || 'Total'}</span>
              <span style={{ fontWeight: 600 }}>{currency.format(total)}</span>
            </div>
            <div className={styles.promoRow}>
              <input
                type="text"
                placeholder={t.promoCode || 'Promo code'}
                value={promoCode}
                onChange={(event) => onPromoCodeChange(event.target.value.toUpperCase())}
              />
            </div>
            <p className={styles.checkoutNote}>
              {t.checkoutNote || 'Checkout requires a verified SweetB user account. Payments are confirmed manually via WhatsApp, and orders remain in "Processing" until an admin marks them as paid.'}
            </p>
            {bankingDetails && bankingDetails.bankName && bankingDetails.accountNumber && (
              <div className={styles.bankingDetails}>
                <p className={styles.bankingTitle}>{t.bankTransferDetails || 'Bank Transfer Details'}</p>
                <div className={styles.bankingInfo}>
                  <div className={styles.bankingRow}>
                    <span className={styles.bankingLabel}>{t.bankName || 'Bank Name:'}</span>
                    <span className={styles.bankingValue}>{bankingDetails.bankName}</span>
                  </div>
                  <div className={styles.bankingRow}>
                    <span className={styles.bankingLabel}>{t.accountNumber || 'Account Number:'}</span>
                    <span className={styles.bankingValue}>{bankingDetails.accountNumber}</span>
                  </div>
                </div>
              </div>
            )}
            {statusMessage && <p className={styles.checkoutStatus}>{statusMessage}</p>}
            {items.length > 0 && (
              <button
                className={styles.primaryButton}
                onClick={onCheckout}
                disabled={placingOrder}
              >
                {placingOrder ? 'Processing...' : 'Checkout'}
              </button>
            )}
            {items.length > 0 && (
              <button className={styles.secondaryButton} onClick={onClear}>
                {t.clearCart || 'Clear Cart'}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}


