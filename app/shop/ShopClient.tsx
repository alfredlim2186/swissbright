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

const CART_STORAGE_KEY = 'swissbright_shop_cart_v1'
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

// Hardcoded products - no database required
const HARDCODED_PRODUCTS: ShopProduct[] = [
  {
    id: '1',
    name: 'Premium Clear Phone Case - iPhone 15 Pro',
    slug: 'premium-clear-phone-case-iphone-15-pro',
    description: 'Crystal clear protective case with anti-yellowing technology. Perfect fit for iPhone 15 Pro.',
    longDescription: 'Made from premium TPU material with anti-yellowing technology to keep your case crystal clear. Features raised edges to protect your screen and camera.',
    heroImageUrl: '/images/product/iphone15promax.jpg',
    price: 45.00,
    inventory: 50,
    isActive: true,
    isFeatured: true,
    images: [{ url: '/images/product/iphone15promax.jpg', altText: 'Clear phone case', sortOrder: 0 }],
  },
  {
    id: '2',
    name: 'Fast Wireless Charging Pad',
    slug: 'fast-wireless-charging-pad',
    description: '15W fast wireless charger with LED indicator. Compatible with all Qi-enabled devices.',
    longDescription: 'Charge your phone wirelessly at up to 15W speed. Features LED charging indicator, overheat protection, and foreign object detection.',
    heroImageUrl: '/images/product/wirelesscharger.jpg',
    price: 89.00,
    inventory: 30,
    isActive: true,
    isFeatured: true,
    images: [{ url: '/images/product/wirelesscharger.jpg', altText: 'Wireless charging pad', sortOrder: 0 }],
  },
  {
    id: '3',
    name: 'MagSafe-Compatible Phone Stand',
    slug: 'magsafe-compatible-phone-stand',
    description: 'Premium aluminum stand with MagSafe compatibility. Perfect for desk use.',
    longDescription: 'Sturdy aluminum construction with built-in MagSafe magnets. Adjustable viewing angles and foldable design.',
    heroImageUrl: '/images/product/magsafestand.jpg',
    price: 65.00,
    inventory: 25,
    isActive: true,
    isFeatured: true,
    images: [{ url: '/images/product/magsafestand.jpg', altText: 'MagSafe phone stand', sortOrder: 0 }],
  },
  {
    id: '4',
    name: 'USB-C Fast Charging Cable (2m)',
    slug: 'usb-c-fast-charging-cable-2m',
    description: 'Durable 2-meter USB-C cable with fast charging support. Nylon braided for extra durability.',
    longDescription: 'Premium USB-C to USB-C cable supporting fast charging up to 100W. Reinforced nylon braiding prevents tangling.',
    heroImageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c8?w=800&q=80',
    price: 35.00,
    inventory: 100,
    isActive: true,
    isFeatured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c8?w=800&q=80', altText: 'USB-C charging cable', sortOrder: 0 }],
  },
  {
    id: '5',
    name: 'Tempered Glass Screen Protector - Universal',
    slug: 'tempered-glass-screen-protector-universal',
    description: '9H hardness tempered glass screen protector. Bubble-free installation with crystal clear clarity.',
    longDescription: 'Premium tempered glass with 9H hardness rating provides excellent scratch and impact protection.',
    heroImageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
    price: 25.00,
    inventory: 150,
    isActive: true,
    isFeatured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80', altText: 'Tempered glass screen protector', sortOrder: 0 }],
  },
  {
    id: '6',
    name: 'Adjustable Phone Stand - Aluminum',
    slug: 'adjustable-phone-stand-aluminum',
    description: 'Premium aluminum phone stand with adjustable viewing angles. Holds phones in portrait or landscape.',
    longDescription: 'Sturdy aluminum construction supports phones up to 7 inches. Adjustable viewing angles from 30° to 90°.',
    heroImageUrl: '/images/product/aluminiumstand.jpg',
    price: 42.00,
    inventory: 40,
    isActive: true,
    isFeatured: false,
    images: [{ url: '/images/product/aluminiumstand.jpg', altText: 'Aluminum phone stand', sortOrder: 0 }],
  },
  {
    id: '7',
    name: 'Car Phone Mount - Magnetic',
    slug: 'car-phone-mount-magnetic',
    description: 'Strong magnetic car mount with 360° rotation. Easy one-handed operation.',
    longDescription: 'Powerful neodymium magnets securely hold your phone while driving. 360° rotation allows perfect viewing angle.',
    heroImageUrl: '/images/product/carstand.jpg',
    price: 55.00,
    inventory: 35,
    isActive: true,
    isFeatured: false,
    images: [{ url: '/images/product/carstand.jpg', altText: 'Car phone mount', sortOrder: 0 }],
  },
  {
    id: '8',
    name: 'Portable Power Bank 20000mAh',
    slug: 'portable-power-bank-20000mah',
    description: 'High-capacity 20000mAh power bank with fast charging. USB-C and USB-A ports.',
    longDescription: 'Massive 20000mAh capacity charges your phone multiple times. Features fast charging support, dual USB ports.',
    heroImageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c8?w=800&q=80',
    price: 129.00,
    inventory: 20,
    isActive: true,
    isFeatured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c8?w=800&q=80', altText: 'Power bank', sortOrder: 0 }],
  },
  {
    id: '9',
    name: 'Bluetooth Earbuds - True Wireless',
    slug: 'bluetooth-earbuds-true-wireless',
    description: 'Premium true wireless earbuds with noise cancellation. 30-hour battery life.',
    longDescription: 'Crystal clear audio with active noise cancellation. Comfortable fit with multiple ear tip sizes.',
    heroImageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
    price: 189.00,
    inventory: 15,
    isActive: true,
    isFeatured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80', altText: 'Wireless earbuds', sortOrder: 0 }],
  },
  {
    id: '10',
    name: 'Phone Camera Lens Kit',
    slug: 'phone-camera-lens-kit',
    description: 'Professional camera lens kit with wide-angle, macro, and fisheye lenses.',
    longDescription: 'Transform your phone camera into a professional setup. Includes wide-angle, macro, and fisheye lenses.',
    heroImageUrl: '/images/product/phonelens.jpg',
    price: 75.00,
    inventory: 28,
    isActive: true,
    isFeatured: false,
    images: [{ url: '/images/product/phonelens.jpg', altText: 'Camera lens kit', sortOrder: 0 }],
  },
  {
    id: '11',
    name: 'Phone Grip Ring - Pop Socket Style',
    slug: 'phone-grip-ring-pop-socket-style',
    description: 'Adjustable phone grip ring for secure one-handed use. Multiple colors available.',
    longDescription: 'Comfortable grip ring that extends and retracts. Prevents phone drops and makes one-handed use easy.',
    heroImageUrl: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800&q=80',
    price: 18.00,
    inventory: 80,
    isActive: true,
    isFeatured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800&q=80', altText: 'Phone grip ring', sortOrder: 0 }],
  },
  {
    id: '12',
    name: 'Phone Wallet Case - Leather',
    slug: 'phone-wallet-case-leather',
    description: 'Premium leather wallet case with card slots. Holds 3 cards and cash.',
    longDescription: 'Genuine leather wallet case combines protection with convenience. Holds up to 3 cards and cash.',
    heroImageUrl: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800&q=80',
    price: 68.00,
    inventory: 22,
    isActive: true,
    isFeatured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800&q=80', altText: 'Leather wallet case', sortOrder: 0 }],
  },
  {
    id: '13',
    name: 'USB-C Hub - 7-in-1',
    slug: 'usb-c-hub-7-in-1',
    description: 'Multi-port USB-C hub with HDMI, USB 3.0, SD card reader, and more.',
    longDescription: 'Expand your device connectivity with 7 ports: HDMI 4K, 3x USB 3.0, SD/TF card readers, USB-C PD charging.',
    heroImageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c8?w=800&q=80',
    price: 119.00,
    inventory: 18,
    isActive: true,
    isFeatured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c8?w=800&q=80', altText: 'USB-C hub', sortOrder: 0 }],
  },
  {
    id: '14',
    name: 'Phone Cooling Fan',
    slug: 'phone-cooling-fan',
    description: 'Portable phone cooling fan with RGB lighting. Prevents overheating during gaming.',
    longDescription: 'Keep your phone cool during intensive gaming or charging. Adjustable fan speed with RGB lighting.',
    heroImageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c8?w=800&q=80',
    price: 48.00,
    inventory: 32,
    isActive: true,
    isFeatured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c8?w=800&q=80', altText: 'Phone cooling fan', sortOrder: 0 }],
  },
  {
    id: '15',
    name: 'Phone Selfie Ring Light',
    slug: 'phone-selfie-ring-light',
    description: 'LED ring light with adjustable brightness. Perfect for video calls and selfies.',
    longDescription: 'Professional LED ring light with 3 brightness levels. Universal phone clip. USB rechargeable.',
    heroImageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
    price: 32.00,
    inventory: 45,
    isActive: true,
    isFeatured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80', altText: 'Ring light', sortOrder: 0 }],
  },
  {
    id: '16',
    name: 'Phone Tripod with Remote',
    slug: 'phone-tripod-with-remote',
    description: 'Adjustable tripod with Bluetooth remote shutter. Extends up to 1.5m.',
    longDescription: 'Sturdy tripod with adjustable height from 30cm to 1.5m. Includes Bluetooth remote for hands-free photos.',
    heroImageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    price: 55.00,
    inventory: 30,
    isActive: true,
    isFeatured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', altText: 'Phone tripod', sortOrder: 0 }],
  },
  {
    id: '17',
    name: 'Phone Stylus Pen',
    slug: 'phone-stylus-pen',
    description: 'Precision stylus pen with palm rejection. Works with all touch screens.',
    longDescription: 'Fine-tip stylus for precise drawing and note-taking. Palm rejection technology. Works with all capacitive touch screens.',
    heroImageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80',
    price: 28.00,
    inventory: 55,
    isActive: true,
    isFeatured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80', altText: 'Stylus pen', sortOrder: 0 }],
  },
  {
    id: '18',
    name: 'Phone Car Mount - Vent Clip',
    slug: 'phone-car-mount-vent-clip',
    description: 'Secure vent clip mount with one-touch release. 360° rotation.',
    longDescription: 'Strong grip vent clip mount holds phones securely. One-touch release button. 360° rotation for perfect viewing angle.',
    heroImageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80',
    price: 38.00,
    inventory: 42,
    isActive: true,
    isFeatured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80', altText: 'Vent clip mount', sortOrder: 0 }],
  },
  {
    id: '19',
    name: 'Phone Cleaning Kit',
    slug: 'phone-cleaning-kit',
    description: 'Complete cleaning kit with microfiber cloth, cleaning solution, and tools.',
    longDescription: 'Professional cleaning kit includes microfiber cloth, screen cleaning solution, brush, and cleaning tools.',
    heroImageUrl: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800&q=80',
    price: 22.00,
    inventory: 60,
    isActive: true,
    isFeatured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800&q=80', altText: 'Cleaning kit', sortOrder: 0 }],
  },
  {
    id: '20',
    name: 'Phone Fingerprint Stickers',
    slug: 'phone-fingerprint-stickers',
    description: 'Decorative fingerprint-resistant stickers. Multiple designs available.',
    longDescription: 'Fun and functional stickers that reduce fingerprints on your phone. Multiple designs and patterns.',
    heroImageUrl: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800&q=80',
    price: 12.00,
    inventory: 90,
    isActive: true,
    isFeatured: false,
    images: [{ url: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800&q=80', altText: 'Fingerprint stickers', sortOrder: 0 }],
  },
]

export default function ShopClient({
  products: _products,
  promotion,
  whatsappLink,
  translations,
}: {
  products?: ShopProduct[]
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
  // Use hardcoded products, ignore database products
  const products = HARDCODED_PRODUCTS
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
  const [bankingDetails] = useState<{ 
    accountHolderName: string
    bankName: string
    accountNumber: string
    accountType: string
  }>({
    accountHolderName: 'FOVS Distribution (M) Sdn Bhd',
    bankName: 'Public Bank',
    accountNumber: '3821799222',
    accountType: 'Savings'
  })
  const [featuredImageIndex, setFeaturedImageIndex] = useState(0)
  const [isCartLoaded, setIsCartLoaded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc'>('name')
  const [priceFilter, setPriceFilter] = useState<{ min: number; max: number }>({ min: 0, max: 1000 })

  // Filter and sort all products for catalog
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = activeProducts

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.longDescription.toLowerCase().includes(query)
      )
    }

    // Price filter
    filtered = filtered.filter(
      (product) => product.price >= priceFilter.min && product.price <= priceFilter.max
    )

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return sorted
  }, [activeProducts, searchQuery, sortBy, priceFilter])

  // Persist cart to localStorage
  useEffect(() => {
    if (isCartLoaded) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    }
  }, [cart, isCartLoaded])

  useEffect(() => {
    setIsCartLoaded(true)
  }, [])

  const addToCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId)
      if (existing) {
        return prev.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { productId, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const cartItems = cart.map((item) => {
    const product = products.find((p) => p.id === item.productId)
    if (!product) return null
    const pricing = applyPromotion(product.price, promotion)
    return {
      ...item,
      product,
      pricing,
      total: pricing.sale * item.quantity,
    }
  }).filter((item): item is NonNullable<typeof item> => item !== null)

  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0)
  const selectedCourier = couriers.find((c) => c.id === selectedCourierId)
  const shippingFee = selectedCourier?.fee || 0
  const total = subtotal + shippingFee

  const handleCheckout = () => {
    if (cartItems.length === 0) return
    setShowCheckoutConfirm(true)
  }

  const confirmPlaceOrder = () => {
    if (!whatsappLink) return
    setPlacingOrder(true)

    const orderLines = cartItems
      .map((item) => `• ${item.product.name} x${item.quantity} - ${currency.format(item.total)}`)
      .join('\n')

    const message = `Hi! I'd like to place an order:\n\n${t.orderSummary || 'Order Summary:'}\n${orderLines}\n\n${t.subtotal || 'Subtotal'}: ${currency.format(subtotal)}${selectedCourier ? `\n${t.shippingFee || 'Shipping Fee'}: ${currency.format(shippingFee)}` : ''}\n${t.total || 'Total'}: ${currency.format(total)}\n\n${t.bankTransferDetails || 'Bank Transfer Details'}:\nAccount Holder Name: ${bankingDetails.accountHolderName}\n${t.bankName || 'Bank'}: ${bankingDetails.bankName}\n${t.accountNumber || 'Account Number'}: ${bankingDetails.accountNumber}\nAccount Type: ${bankingDetails.accountType}${checkoutMessage ? `\n\n${checkoutMessage}` : ''}`

    const whatsappUrl = `${whatsappLink.url}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    setPlacingOrder(false)
    setShowCheckoutConfirm(false)
    clearCart()
  }

  return (
    <>
      <div className={styles.shopContainer}>
      {/* Filters Bar */}
      <div className={styles.filtersBar}>
        <div className={styles.filtersContent}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'price-asc' | 'price-desc')}
            className={styles.sortSelect}
          >
            <option value="name">Sort by Name</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
          <div className={styles.priceFilter}>
            <input
              type="number"
              placeholder="Min"
              value={priceFilter.min}
              onChange={(e) =>
                setPriceFilter({ ...priceFilter, min: Number(e.target.value) || 0 })
              }
              className={styles.priceInput}
            />
            <span className={styles.priceSeparator}>-</span>
            <input
              type="number"
              placeholder="Max"
              value={priceFilter.max}
              onChange={(e) =>
                setPriceFilter({ ...priceFilter, max: Number(e.target.value) || 1000 })
              }
              className={styles.priceInput}
            />
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className={styles.featuredSection}>
          <h2 className={styles.sectionTitle}>{t.featured || 'Featured Products'}</h2>
          <div className={styles.featuredGrid}>
            {featuredProducts.map((product) => {
              const pricing = applyPromotion(product.price, promotion)
              const isOutOfStock = product.inventory <= 0
              return (
                <div key={product.id} className={styles.featuredCard}>
                  <div className={styles.productImageContainer}>
                    <img src={product.heroImageUrl} alt={product.name} className={styles.productImage} />
                    {isOutOfStock && <div className={styles.outOfStockBadge}>{t.outOfStock || 'Out of stock'}</div>}
                  </div>
                  <div className={styles.productDetails}>
                    <h3 className={styles.productName}>{product.name}</h3>
                    <p className={styles.productDescription}>{product.description}</p>
                    <div className={styles.priceContainer}>
                      {pricing.original ? (
                        <>
                          <span className={styles.originalPrice}>{currency.format(pricing.original)}</span>
                          <span className={styles.salePrice}>{currency.format(pricing.sale)}</span>
                        </>
                      ) : (
                        <span className={styles.price}>{currency.format(pricing.sale)}</span>
                      )}
                    </div>
                    <div className={styles.inventoryInfo}>
                      {isOutOfStock ? (
                        <span className={styles.outOfStockText}>{t.outOfStock || 'Out of stock'}</span>
                      ) : (
                        <span className={styles.inStockText}>
                          {product.inventory} {t.inInventory || 'in inventory'}
                        </span>
                      )}
                    </div>
                    <button
                      className={styles.addToCartButton}
                      onClick={() => {
                        if (!isOutOfStock) addToCart(product.id)
                      }}
                      disabled={isOutOfStock}
                    >
                      {t.addToCart || 'Add to Cart'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* All Products Section */}
      <section className={styles.productsSection}>
        <h2 className={styles.sectionTitle}>{t.catalog || 'All Products'}</h2>
        {filteredAndSortedProducts.length === 0 ? (
          <div className={styles.emptyState}>
            <p>{t.catalogHint || 'No products found. Try adjusting your filters.'}</p>
          </div>
        ) : (
          <div className={styles.productsGrid}>
            {filteredAndSortedProducts.map((product) => {
              const pricing = applyPromotion(product.price, promotion)
              const isOutOfStock = product.inventory <= 0
              return (
                <div key={product.id} className={styles.productCard}>
                  <div className={styles.productImageContainer}>
                    <img src={product.heroImageUrl} alt={product.name} className={styles.productImage} />
                    {isOutOfStock && <div className={styles.outOfStockBadge}>{t.outOfStock || 'Out of stock'}</div>}
                    {product.isFeatured && <div className={styles.featuredBadge}>{t.featured || 'Featured'}</div>}
                  </div>
                  <div className={styles.productDetails}>
                    <h3 className={styles.productName}>{product.name}</h3>
                    <p className={styles.productDescription}>{product.description}</p>
                    <div className={styles.priceContainer}>
                      {pricing.original ? (
                        <>
                          <span className={styles.originalPrice}>{currency.format(pricing.original)}</span>
                          <span className={styles.salePrice}>{currency.format(pricing.sale)}</span>
                        </>
                      ) : (
                        <span className={styles.price}>{currency.format(pricing.sale)}</span>
                      )}
                    </div>
                    <div className={styles.inventoryInfo}>
                      {isOutOfStock ? (
                        <span className={styles.outOfStockText}>{t.outOfStock || 'Out of stock'}</span>
                      ) : (
                        <span className={styles.inStockText}>
                          {product.inventory} {t.inInventory || 'in inventory'}
                        </span>
                      )}
                    </div>
                    <button
                      className={styles.addToCartButton}
                      onClick={() => {
                        if (!isOutOfStock) addToCart(product.id)
                      }}
                      disabled={isOutOfStock}
                    >
                      {t.addToCart || 'Add to Cart'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
      </div>

      {/* Cart Drawer */}
      <div className={`${styles.cartDrawer} ${drawerOpen ? styles.cartDrawerOpen : ''}`}>
        <div className={styles.cartDrawerContent}>
          <div className={styles.cartHeader}>
            <h3>{t.cart || 'Shopping Cart'}</h3>
            <button onClick={() => setDrawerOpen(false)} className={styles.cartCloseBtn} aria-label="Close cart">
              ×
            </button>
          </div>
          {cartItems.length === 0 ? (
            <div className={styles.emptyCart}>
              <p>{t.catalogHint || 'Your cart is empty. Add products to get started.'}</p>
            </div>
          ) : (
            <>
              <div className={styles.cartItems}>
                {cartItems.map((item) => (
                  <div key={item.productId} className={styles.cartItem}>
                    <div className={styles.cartItemImage}>
                      <img src={item.product.heroImageUrl} alt={item.product.name} />
                    </div>
                    <div className={styles.cartItemDetails}>
                      <h4 className={styles.cartItemName}>{item.product.name}</h4>
                      <p className={styles.cartItemPrice}>{currency.format(item.pricing.sale)} each</p>
                      <div className={styles.quantityControls}>
                        <button 
                          className={styles.quantityBtn}
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className={styles.quantityValue}>{item.quantity}</span>
                        <button
                          className={styles.quantityBtn}
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.product.inventory}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className={styles.cartItemActions}>
                      <div className={styles.cartItemTotal}>{currency.format(item.total)}</div>
                      <button 
                        onClick={() => removeFromCart(item.productId)} 
                        className={styles.removeBtn}
                        aria-label="Remove item"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.cartFooter}>
                <div className={styles.cartSummary}>
                  <div className={styles.cartSummaryRow}>
                    <span>{t.subtotal || 'Subtotal'}</span>
                    <span>{currency.format(subtotal)}</span>
                  </div>
                  {selectedCourier && (
                    <div className={styles.cartSummaryRow}>
                      <span>{t.shippingFee || 'Shipping Fee'}</span>
                      <span>{currency.format(shippingFee)}</span>
                    </div>
                  )}
                  <div className={styles.cartTotalRow}>
                    <span>{t.total || 'Total'}</span>
                    <span>{currency.format(total)}</span>
                  </div>
                </div>
                
                {/* Bank Account Details */}
                <div className={styles.bankingDetails}>
                  <h4 className={styles.bankingTitle}>{t.bankTransferDetails || 'Bank Account Details'}</h4>
                  <div className={styles.bankingInfo}>
                    <div className={styles.bankingRow}>
                      <span className={styles.bankingLabel}>Account Holder Name</span>
                      <span className={styles.bankingValue}>{bankingDetails.accountHolderName}</span>
                    </div>
                    <div className={styles.bankingRow}>
                      <span className={styles.bankingLabel}>{t.bankName || 'Bank'}</span>
                      <span className={styles.bankingValue}>{bankingDetails.bankName}</span>
                    </div>
                    <div className={styles.bankingRow}>
                      <span className={styles.bankingLabel}>{t.accountNumber || 'Account Number'}</span>
                      <span className={styles.bankingValue}>{bankingDetails.accountNumber}</span>
                    </div>
                    <div className={styles.bankingRow}>
                      <span className={styles.bankingLabel}>Account Type</span>
                      <span className={styles.bankingValue}>{bankingDetails.accountType}</span>
                    </div>
                  </div>
                </div>
                
                <button onClick={handleCheckout} className={styles.checkoutButton}>
                  {t.checkout || 'Checkout'}
                </button>
                <button onClick={clearCart} className={styles.clearCartButton}>
                  {t.clearCart || 'Clear Cart'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Cart Toggle Button */}
      <button
        onClick={() => setDrawerOpen(true)}
        className={styles.cartToggle}
        aria-label={t.viewCart || 'View Cart'}
      >
        <span className={styles.cartIcon}>🛒</span>
        {cartItems.length > 0 && (
          <span className={styles.cartBadge}>{cartItems.length}</span>
        )}
      </button>

      {/* Checkout Confirmation Modal */}
      {showCheckoutConfirm && (
        <div className={styles.modalOverlay} onClick={() => setShowCheckoutConfirm(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>{t.confirmCheckout || 'Confirm Checkout'}</h3>
            <p>{t.redirectWhatsApp || "You'll be redirected to WhatsApp to send payment advice after placing the order."}</p>
            <div className={styles.modalActions}>
              <button onClick={() => setShowCheckoutConfirm(false)} className={styles.cancelBtn}>
                {t.cancel || 'Cancel'}
              </button>
              <button onClick={confirmPlaceOrder} className={styles.placeOrderBtn} disabled={placingOrder}>
                {placingOrder ? t.processing || 'Processing...' : t.placeOrder || 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}