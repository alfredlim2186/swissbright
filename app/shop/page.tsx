import Link from 'next/link'
import ShopClient from './ShopClient'
import styles from './shop.module.css'
import { generatePageMetadata } from '@/lib/seo'
import PageBackground from '@/app/components/PageBackground'
import BackgroundElements from '@/app/components/BackgroundElements'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return generatePageMetadata({
    title: 'Swiss Bright Shop - Premium Mobile Gadgets',
    description:
      'Shop premium mobile gadgets and accessories at Swiss Bright. Quality products, competitive prices, fast shipping.',
    path: '/shop',
    keywords: ['mobile gadgets', 'shop', 'phone accessories', 'chargers', 'cases', 'commerce'],
  })
}

export default async function ShopPage() {
  // Hardcoded - no database required
  const enabled = true
  const promotion = null
  
  // Hardcoded contact links
  const whatsappLink = {
    label: 'WhatsApp',
    url: 'https://wa.me/60123456789',
  }

  // Hardcoded English strings (no translations needed)
  const shopTagline = 'Premium. Quality. Trusted.'
  const shopTitle = 'Shop Premium Mobile Gadgets'
  const shopDescription = 'Discover our curated selection of premium mobile gadgets and accessories. From protective cases to fast chargers, we offer quality products designed to enhance your mobile experience.'
  const comingSoon = 'Coming Soon'
  const offlineTitle = 'Our online store is currently offline'
  const offlineDescription = 'We\'re preparing new products. Tap below to message us on WhatsApp for orders or questions in the meantime.'
  const messageWhatsApp = 'Message us on WhatsApp'
  const contactSweetB = 'Contact Swiss Bright'
  const returnHome = 'Return home'
  const howItWorks = 'How it works'
  const simpleFlow = 'Simple manual flow'
  const addProducts = 'Add products'
  const addProductsDesc = 'Select from the hero card or the catalog grid. The cart persists locally so you can return anytime.'
  const sendPayment = 'Send payment advice'
  const sendPaymentDesc = 'Checkout launches WhatsApp with a pre-filled order summary so you can attach transfer confirmation.'
  const adminConfirm = 'Admin confirmation'
  const adminConfirmDesc = 'Our team moves the order from "Processing" to "Confirmed" and shares courier + tracking details manually.'
  const fastDelivery = 'Fast Delivery'
  const fastDeliveryDesc = 'Processed and shipped within 1 day. Orders are packed and dispatched the same day with tracking provided.'
  const discreetPackaging = 'Discreet Packaging'
  const discreetPackagingDesc = 'Secure packaging to protect your products during shipping.'
  const originalProduct = 'Authentic Products'
  const originalProductDesc = 'Genuine mobile gadgets and accessories from trusted suppliers. Every item is verified for quality and authenticity.'
  const guaranteedSatisfaction = 'Guaranteed Satisfaction'
  const guaranteedSatisfactionDesc = 'We stand behind every purchase. Contact us within 7 days if not completely satisfied.'
  const nowLive = 'Now Live'

  if (!enabled) {
    return (
      <div className={styles.page}>
        <PageBackground />
        <BackgroundElements />
        <section className={styles.offlineHero}>
          <p className={styles.eyebrow}>{comingSoon}</p>
          <h1>{offlineTitle}</h1>
          <p>{offlineDescription}</p>
          <div className={styles.heroActions}>
            {whatsappLink ? (
              <a className={styles.primaryButton} href={whatsappLink.url} target="_blank" rel="noreferrer">
                {messageWhatsApp}
              </a>
            ) : (
              <Link className={styles.primaryButton} href="/contact">
                {contactSweetB}
              </Link>
            )}
            <Link className={styles.secondaryButton} href="/">
              {returnHome}
            </Link>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <PageBackground />
      <BackgroundElements />
      <section className={styles.heroSection}>
        <div className={styles.heroTagline}>{shopTagline}</div>
        <h1>{shopTitle}</h1>
        <p>{shopDescription}</p>
      </section>

      <section className={styles.processSection}>
        <p className={styles.eyebrow}>{howItWorks}</p>
        <h2>{simpleFlow}</h2>
        <div className={styles.processGrid}>
          <div>
            <span>01</span>
            <h3>{addProducts}</h3>
            <p>{addProductsDesc}</p>
          </div>
          <div>
            <span>02</span>
            <h3>{sendPayment}</h3>
            <p>{sendPaymentDesc}</p>
          </div>
          <div>
            <span>03</span>
            <h3>{adminConfirm}</h3>
            <p>{adminConfirmDesc}</p>
          </div>
        </div>
      </section>

      <ShopClient
        promotion={undefined}
        whatsappLink={whatsappLink}
        translations={{
          featured: 'Featured',
          cart: 'Cart',
          manualCheckout: 'Manual Checkout',
          addToCart: 'Add to Cart',
          viewCart: 'View Cart',
          soldOut: 'Sold Out',
          inInventory: 'in inventory',
          outOfStock: 'Out of stock',
          subtotal: 'Subtotal',
          total: 'Total',
          shipping: 'Shipping',
          shippingFee: 'Shipping Fee',
          promoCode: 'Promo code',
          checkout: 'Checkout',
          clearCart: 'Clear Cart',
          checkoutNote: 'Checkout requires a verified Swiss Bright user account. Payments are confirmed manually via WhatsApp, and orders remain in "Processing" until an admin marks them as paid.',
          bankTransferDetails: 'Bank Transfer Details',
          bankName: 'Bank Name:',
          accountNumber: 'Account Number:',
          selectCourier: 'Select courier',
          addProductsFirst: 'Add products first',
          processing: 'Processing...',
          catalog: 'Catalog',
          catalogHint: 'Add a product to begin your order.',
          confirmCheckout: 'Confirm Checkout',
          orderSummary: 'Order Summary:',
          redirectWhatsApp: 'You\'ll be redirected to WhatsApp to send payment advice after placing the order.',
          cancel: 'Cancel',
          placeOrder: 'Place Order',
        }}
      />

      <section className={styles.heroSection}>
        <div className={styles.heroDetails}>
          <div>
            <span className={styles.tileIcon}>🚚</span>
            <span>{fastDelivery}</span>
            <p>{fastDeliveryDesc}</p>
          </div>
          <div>
            <span className={styles.tileIcon}>📦</span>
            <span>{discreetPackaging}</span>
            <p>{discreetPackagingDesc}</p>
          </div>
          <div>
            <span className={styles.tileIcon}>🛡️</span>
            <span>{originalProduct}</span>
            <p>{originalProductDesc}</p>
          </div>
          <div>
            <span className={styles.tileIcon}>✨</span>
            <span>{guaranteedSatisfaction}</span>
            <p>{guaranteedSatisfactionDesc}</p>
          </div>
        </div>
      </section>
    </div>
  )
}


