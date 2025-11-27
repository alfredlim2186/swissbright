import Image from 'next/image'
import styles from './page.module.css'
import Link from 'next/link'
import PageBackground from '@/app/components/PageBackground'
import BackgroundElements from '@/app/components/BackgroundElements'
import { getContent } from '@/lib/content'
import { getContactLinks } from '@/lib/contactLinks'

export default async function ContactPage() {
  const backLink = await getContent('contact.back', '← Back to Home')
  const title = await getContent('contact.title', 'Get In Touch')
  const subtitle = await getContent('contact.subtitle', 'Connect with us through your preferred channel')
  const contactLinks = await getContactLinks()

  return (
    <>
      <PageBackground />
      <BackgroundElements />
      <div className={styles.contactPage}>
        <div className={styles.container}>
          <Link href="/" className={styles.backLink}>
            {backLink}
          </Link>
          
          <div className={styles.header}>
            <Link href="/" className={styles.logo}>
              <Image 
                src="/images/logos/sweetb-logo-peru.png" 
                alt="SweetB PERÚ" 
                width={200}
                height={66}
                className={styles.logoImage}
              />
            </Link>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.subtitle}>
              {subtitle}
            </p>
            <div className={styles.divider}></div>
          </div>

          <div className={styles.linksContainer}>
            {contactLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkButton}
              >
                <div className={styles.iconWrapper}>
                  {link.logoUrl ? (
                    <Image 
                      src={link.logoUrl}
                      alt={`${link.label} logo`}
                      width={32}
                      height={32}
                      className={styles.logoIcon}
                    />
                  ) : (
                    <span className={styles.fallbackInitial}>
                      {link.label.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className={styles.linkText}>
                  <span className={styles.linkLabel}>{link.label}</span>
                  {link.description && (
                    <span className={styles.linkDescription}>{link.description}</span>
                  )}
                </div>
                <span className={styles.arrow}>→</span>
              </a>
            ))}
            {contactLinks.length === 0 && (
              <div className={styles.emptyState}>
                No contact methods configured. Please check back later.
              </div>
            )}
          </div>

          <div className={styles.footer}>
            <p>© 2025 SweetB. Vitality Reborn.</p>
          </div>
        </div>
      </div>
    </>
  )
}

