import Image from 'next/image'
import Link from 'next/link'
import styles from './page.module.css'
import { getContent } from '@/lib/content'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Product Verification | Swiss Bright',
  description: 'Protect your purchase by verifying your Swiss Bright product before use. Follow the three simple steps and access the official verification portal.',
}

export default async function ProductVerificationPage() {
  const eyebrow = await getContent('productVerification.eyebrow', 'Authenticity Matters')
  const heroTitle = await getContent('productVerification.title', 'Protect Your Confidence')
  const heroDescription = await getContent(
    'productVerification.description',
    'Every Swiss Bright product is crafted with quality standards and rigorous testing. Product verification ensures that what you hold is genuine, authentic, and safe to use.'
  )
  const whyTitle = await getContent('productVerification.whyTitle', 'Why Verification Matters')
  const whyDescription = await getContent(
    'productVerification.whyDescription',
    'Counterfeit supplements are difficult to identify and can contain untested fillers. Verifying your product protects your health, ensures quality, and keeps your purchase history intact for loyalty perks.'
  )
  const ctaLabel = await getContent('productVerification.ctaLabel', 'Go to Official Verification Portal')
  const ctaLink = await getContent('productVerification.ctaLink', 'https://verify.swissbright.com')
  const stepsTitle = await getContent('productVerification.steps.title', 'Verify Swiss Bright Products in Three Steps')
  const stepsSubtitle = await getContent(
    'productVerification.steps.subtitle',
    'Use the guide below to locate your verification code and confirm your purchase with our trusted partner.'
  )
  const note = await getContent(
    'productVerification.note',
    'Verification is handled by our certified third-party security partner. You will be redirected to a secure external site.'
  )

  const steps = [
    {
      number: 'Step 01',
      title: await getContent('productVerification.steps.1.title', 'Locate the Security Seal'),
      description: await getContent(
        'productVerification.steps.1.description',
        'Find the tamper-evident Swiss Bright seal on your product. Gently scratch to reveal your unique verification code.'
      ),
      image: await getContent(
        'productVerification.steps.1.image',
        'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80&auto=format&fit=crop'
      ),
      alt: await getContent('productVerification.steps.1.alt', 'Close-up of scratching a product seal'),
    },
    {
      number: 'Step 02',
      title: await getContent('productVerification.steps.2.title', 'Enter the Code Online'),
      description: await getContent(
        'productVerification.steps.2.description',
        'Click the verification button below, enter your code, and confirm the batch details displayed on screen.'
      ),
      image: await getContent(
        'productVerification.steps.2.image',
        'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=800&q=80&auto=format&fit=crop'
      ),
      alt: await getContent('productVerification.steps.2.alt', 'Hands typing a verification code on laptop'),
    },
    {
      number: 'Step 03',
      title: await getContent('productVerification.steps.3.title', 'Record Your Confirmation'),
      description: await getContent(
        'productVerification.steps.3.description',
        'Keep your confirmation ID for warranty coverage and member rewards. Reach out to support if any discrepancy appears.'
      ),
      image: await getContent(
        'productVerification.steps.3.image',
        'https://images.unsplash.com/photo-1503602642458-232111445657?w=800&q=80&auto=format&fit=crop'
      ),
      alt: await getContent('productVerification.steps.3.alt', 'Notebook with verification confirmation'),
    },
  ]

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroBackground} />
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>{eyebrow}</span>
          <h1 className={styles.heroTitle}>{heroTitle}</h1>
          <p className={styles.heroDescription}>{heroDescription}</p>
          <Link href={ctaLink} target="_blank" className={styles.ctaButton} rel="noreferrer">
            {ctaLabel} <span>↗</span>
          </Link>
        </div>
      </section>

      <section className={styles.whySection}>
        <div className={styles.whyContent}>
          <div className={styles.whyCard}>
            <h2 className={styles.whyTitle}>{whyTitle}</h2>
            <p className={styles.whyDescription}>{whyDescription}</p>
          </div>
          <div className={styles.whyCard}>
            <h2 className={styles.whyTitle}>{await getContent('productVerification.protectedTitle', 'Protected Confidence')}</h2>
            <p className={styles.whyDescription}>
              {await getContent(
                'productVerification.protectedDescription',
                'Authentic Swiss Bright products ensure quality manufacturing, consistent performance, and reliable results. Verifying your product shields you from counterfeits that compromise quality and undermine your experience.'
              )}
            </p>
          </div>
        </div>
      </section>

      <section className={styles.stepsSection}>
        <div className={styles.stepsHeader}>
          <h2 className={styles.stepsTitle}>{stepsTitle}</h2>
          <p className={styles.stepsSubtitle}>{stepsSubtitle}</p>
        </div>

        <div className={styles.stepsGrid}>
          {steps.map((step, index) => (
            <div className={styles.stepCard} key={index}>
              <div className={styles.stepImageWrapper}>
                <Image
                  src={step.image}
                  alt={step.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className={styles.stepImage}
                />
              </div>
              <div className={styles.stepContent}>
                <span className={styles.stepNumber}>{step.number}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <p className={styles.note}>{note}</p>
      </section>
    </div>
  )
}


