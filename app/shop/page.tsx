import Link from 'next/link'
import ShopClient from './ShopClient'
import styles from './shop.module.css'
import { getShopState, mapProductToPayload } from '@/lib/shop'
import { getContactLinks } from '@/lib/contactLinks'
import { generatePageMetadata } from '@/lib/seo'
import { getContent } from '@/lib/content'
import PageBackground from '@/app/components/PageBackground'
import BackgroundElements from '@/app/components/BackgroundElements'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return generatePageMetadata({
    title: 'SweetB Shop',
    description:
      'Shop the SweetB collection. Highlighted hero drops, manual checkout, and concierge confirmation via WhatsApp for registered members.',
    path: '/shop',
    keywords: ['sweetb', 'shop', 'vitality', 'mens health', 'commerce'],
  })
}

export default async function ShopPage() {
  const [{ enabled, products, promotion }, contactLinks] = await Promise.all([getShopState(), getContactLinks()])
  const whatsappLink = contactLinks.find(
    (link) =>
      link.label?.toLowerCase().includes('whatsapp') || link.url.toLowerCase().includes('wa.me') || link.url.toLowerCase().includes('whatsapp.com'),
  )

  const productPayload = products.map(mapProductToPayload)

  // Fetch translations
  const [
    shopTagline,
    shopTitle,
    shopDescription,
    comingSoon,
    offlineTitle,
    offlineDescription,
    messageWhatsApp,
    contactSweetB,
    returnHome,
    howItWorks,
    simpleFlow,
    addProducts,
    addProductsDesc,
    sendPayment,
    sendPaymentDesc,
    adminConfirm,
    adminConfirmDesc,
    fastDelivery,
    fastDeliveryDesc,
    discreetPackaging,
    discreetPackagingDesc,
    originalProduct,
    originalProductDesc,
    guaranteedSatisfaction,
    guaranteedSatisfactionDesc,
    nowLive,
  ] = await Promise.all([
    getContent('shop.tagline', 'Curated. Measured. Member-only.'),
    getContent('shop.title', 'Shop the SweetB Collection'),
    getContent('shop.description', 'Discover premium vitality products crafted with natural botanicals and backed by decades of heritage. Each item in our collection is carefully formulated to support your energy, focus, and confidence—delivered with the discretion and quality you deserve.'),
    getContent('shop.comingSoon', 'Coming Soon'),
    getContent('shop.offlineTitle', 'Our online store is currently offline'),
    getContent('shop.offlineDescription', 'We\'re preparing the next SweetB drop. Tap below to message us on WhatsApp for concierge orders or questions in the meantime.'),
    getContent('shop.messageWhatsApp', 'Message us on WhatsApp'),
    getContent('shop.contactSweetB', 'Contact SweetB'),
    getContent('shop.returnHome', 'Return home'),
    getContent('shop.howItWorks', 'How it works'),
    getContent('shop.simpleFlow', 'Simple manual flow'),
    getContent('shop.addProducts', 'Add products'),
    getContent('shop.addProductsDesc', 'Select from the hero card or the catalog grid. The cart persists locally so you can return anytime.'),
    getContent('shop.sendPayment', 'Send payment advice'),
    getContent('shop.sendPaymentDesc', 'Checkout launches WhatsApp with a pre-filled order summary so you can attach transfer confirmation.'),
    getContent('shop.adminConfirm', 'Admin confirmation'),
    getContent('shop.adminConfirmDesc', 'Our team moves the order from "Processing" to "Confirmed" and shares courier + tracking details manually.'),
    getContent('shop.fastDelivery', 'Fast Delivery'),
    getContent('shop.fastDeliveryDesc', 'Processed and shipped within 1 day. Orders are packed and dispatched the same day with tracking provided.'),
    getContent('shop.discreetPackaging', 'Discreet Packaging'),
    getContent('shop.discreetPackagingDesc', 'Unmarked, privacy-focused packaging with no external branding or product labels visible.'),
    getContent('shop.originalProduct', 'Original Product'),
    getContent('shop.originalProductDesc', 'Authentic SweetB products from our certified facility. Every item is verified and sealed.'),
    getContent('shop.guaranteedSatisfaction', 'Guaranteed Satisfaction'),
    getContent('shop.guaranteedSatisfactionDesc', 'We stand behind every purchase. Contact us within 7 days if not completely satisfied.'),
    getContent('shop.nowLive', 'Now Live'),
  ])

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
        {promotion && (
          <div className={styles.promoBanner}>
            <span>{nowLive}</span>
            <strong>
              {promotion.discountType === 'PERCENTAGE'
                ? `${promotion.discountValue}% off sitewide`
                : `RM ${(promotion.discountValue / 100).toFixed(0)} off every item`}
            </strong>
            <p>{promotion.name}</p>
          </div>
        )}
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
        products={productPayload}
        promotion={promotion ? { name: promotion.name, discountType: promotion.discountType as 'PERCENTAGE' | 'FIXED', discountValue: promotion.discountValue } : undefined}
        whatsappLink={
          whatsappLink
            ? {
                label: whatsappLink.label,
                url: whatsappLink.url,
              }
            : undefined
        }
        translations={{
          featured: await getContent('shop.featured', 'Featured'),
          cart: await getContent('shop.cart', 'Cart'),
          manualCheckout: await getContent('shop.manualCheckout', 'Manual Checkout'),
          addToCart: await getContent('shop.addToCart', 'Add to Cart'),
          viewCart: await getContent('shop.viewCart', 'View Cart'),
          soldOut: await getContent('shop.soldOut', 'Sold Out'),
          inInventory: await getContent('shop.inInventory', 'in inventory'),
          outOfStock: await getContent('shop.outOfStock', 'Out of stock'),
          subtotal: await getContent('shop.subtotal', 'Subtotal'),
          total: await getContent('shop.total', 'Total'),
          shipping: await getContent('shop.shipping', 'Shipping'),
          shippingFee: await getContent('shop.shippingFee', 'Shipping Fee'),
          promoCode: await getContent('shop.promoCode', 'Promo code'),
          checkout: await getContent('shop.checkout', 'Checkout'),
          clearCart: await getContent('shop.clearCart', 'Clear Cart'),
          checkoutNote: await getContent('shop.checkoutNote', 'Checkout requires a verified SweetB user account. Payments are confirmed manually via WhatsApp, and orders remain in "Processing" until an admin marks them as paid.'),
          bankTransferDetails: await getContent('shop.bankTransferDetails', 'Bank Transfer Details'),
          bankName: await getContent('shop.bankName', 'Bank Name:'),
          accountNumber: await getContent('shop.accountNumber', 'Account Number:'),
          selectCourier: await getContent('shop.selectCourier', 'Select courier'),
          addProductsFirst: await getContent('shop.addProductsFirst', 'Add products first'),
          processing: await getContent('shop.processing', 'Processing...'),
          catalog: await getContent('shop.catalog', 'Catalog'),
          catalogHint: await getContent('shop.catalogHint', 'Add a product to begin your order.'),
          confirmCheckout: await getContent('shop.confirmCheckout', 'Confirm Checkout'),
          orderSummary: await getContent('shop.orderSummary', 'Order Summary:'),
          redirectWhatsApp: await getContent('shop.redirectWhatsApp', 'You\'ll be redirected to WhatsApp to send payment advice after placing the order.'),
          cancel: await getContent('shop.cancel', 'Cancel'),
          placeOrder: await getContent('shop.placeOrder', 'Place Order'),
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


