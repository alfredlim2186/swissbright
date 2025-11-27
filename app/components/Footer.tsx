import Image from 'next/image'
import styles from './Footer.module.css'
import { getContent } from '@/lib/content'
import { getContactLinks } from '@/lib/contactLinks'

export default async function Footer() {
  const about = await getContent('footer.about', 'About')
  const account = await getContent('footer.account', 'Account')
  const terms = await getContent('footer.terms', 'Terms')
  const privacy = await getContent('footer.privacy', 'Privacy')
  const contact = await getContent('footer.contact', 'Contact')
  const copyright = await getContent('footer.copyright', '© 2025 SweetB. Vitality Reborn.')
  const contactLinks = await getContactLinks()
  
  // Filter for social media links (Instagram, Facebook, TikTok, WhatsApp, Telegram)
  const socialMediaLinks = contactLinks.filter((link) => {
    const label = link.label.toLowerCase()
    return (
      label.includes('instagram') ||
      label.includes('facebook') ||
      label.includes('tiktok') ||
      label.includes('whatsapp') ||
      label.includes('telegram') ||
      label.includes('twitter') ||
      label.includes('x.com')
    )
  })

  return (
    <footer id="shop" className={styles.footer}>
      <div className={styles.emblem}>✦</div>
      <a href="/" className={styles.logo}>
        <Image 
          src="/images/logos/sweetb-logo-peru.png" 
          alt="SweetB PERÚ" 
          width={180}
          height={60}
          className={styles.logoImage}
        />
      </a>
      <nav className={styles.links}>
        <a href="/about">{about}</a>
        <span className={styles.separator}>•</span>
        <a href="/login">{account}</a>
        <span className={styles.separator}>•</span>
        <a href="/terms">{terms}</a>
        <span className={styles.separator}>•</span>
        <a href="/privacy">{privacy}</a>
        <span className={styles.separator}>•</span>
        <a href="/contact">{contact}</a>
      </nav>
      {socialMediaLinks.length > 0 && (
        <div className={styles.socialLinks}>
          {socialMediaLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
              aria-label={link.label}
            >
              {link.logoUrl ? (
                <Image
                  src={link.logoUrl}
                  alt={link.label}
                  width={24}
                  height={24}
                  className={styles.socialIconImage}
                />
              ) : (
                <span className={styles.socialIconFallback}>
                  {link.label.charAt(0).toUpperCase()}
                </span>
              )}
            </a>
          ))}
        </div>
      )}
      <p className={styles.copyright}>{copyright}</p>
    </footer>
  )
}

