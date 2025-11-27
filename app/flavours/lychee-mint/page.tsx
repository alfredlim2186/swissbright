import Footer from '@/app/components/Footer'
import FlavourHeader from '@/app/components/flavours/FlavourHeader'
import FlavourProfileCards from '@/app/components/flavours/FlavourProfileCards'
import FlavourGraph from '@/app/components/flavours/FlavourGraph'
import TastingNotes from '@/app/components/flavours/TastingNotes'
import SafetyBadges from '@/app/components/flavours/SafetyBadges'
import PageBackground from '@/app/components/PageBackground'
import BackgroundElements from '@/app/components/BackgroundElements'
import ProductJsonLd from '@/app/components/seo/ProductJsonLd'
import Image from 'next/image'
import styles from './page.module.css'
import { getContent } from '@/lib/content'

const profileCards = [
  {
    title: 'Lychee',
    subtitle: 'Tropical Sweetness',
    description: 'Soft, elegant fruit with a modern, clean finish.',
    icon: '🌺',
  },
  {
    title: 'Mint',
    subtitle: 'Cool Revival',
    description: 'Refreshing clarity that sharpens the moment.',
    icon: '🌿',
  },
  {
    title: 'Balance',
    subtitle: 'Smooth Vitality',
    description: 'No harsh edges. Just steady, masculine poise.',
    icon: '⚖',
  },
]

const tastingNotes = [
  {
    label: 'First Impression',
    description: 'chilled lychee, bright and light',
  },
  {
    label: 'Mid-Palate',
    description: 'mint clarity, steadying and clean',
  },
  {
    label: 'Finish',
    description: 'cool, refined, quietly persistent',
  },
]

const flavourAttributes = [
  {
    name: 'Sweetness',
    value: 75,
    color: 'rgba(201, 168, 106, 1)', // Gold
  },
  {
    name: 'Mint Intensity',
    value: 85,
    color: 'rgba(201, 168, 106, 0.9)',
  },
  {
    name: 'Tropical Notes',
    value: 70,
    color: 'rgba(201, 168, 106, 0.8)',
  },
  {
    name: 'Cooling Effect',
    value: 90,
    color: 'rgba(201, 168, 106, 0.95)',
  },
  {
    name: 'Smoothness',
    value: 95,
    color: 'rgba(201, 168, 106, 1)',
  },
]

export default async function LycheeMintPage() {
  const title = await getContent('lycheemintpage.title', 'Lychee Mint')
  const tagline = await getContent('lycheemintpage.tagline', 'Vitality Reborn, with a cool precision.')
  const description = await getContent('lycheemintpage.description', 'A refined union of tropical lychee and clean mint for focus, clarity, and lasting poise.')
  const intro = await getContent('lycheemintpage.intro', 'Born from the SweetB philosophy of discreet power, Lychee Mint brings a crisp edge to your routine. The first note is tropical and rounded. The finish is cool, confident, and unmistakably composed.')
  const howToEnjoyTitle = await getContent('lycheemintpage.howtoenjoy.title', 'How to Enjoy')
  const instruction1 = await getContent('lycheemintpage.howtoenjoy.instruction1', 'Take only one (1) SweetB per day.')
  const instruction2 = await getContent('lycheemintpage.howtoenjoy.instruction2', 'Onset: typically 1–3 hours after consumption.')
  const instruction3 = await getContent('lycheemintpage.howtoenjoy.instruction3', 'Duration: up to 3 days (varies by individual).')
  const instruction4 = await getContent('lycheemintpage.howtoenjoy.instruction4', 'Dissolve slowly in the mouth, or swallow whole if preferred.')
  const instruction5 = await getContent('lycheemintpage.howtoenjoy.instruction5', 'Best on an empty stomach or ≥ 2 hours after a meal.')
  const provenanceTitle = await getContent('lycheemintpage.provenance.title', 'Provenance & Story')
  const provenanceText = await getContent('lycheemintpage.provenance.text', 'Inspired by a guarded Peruvian-derived formula, SweetB marries tradition with modern extraction to deliver discreet power in every piece.')

  const instructions = [
    { icon: '①', text: instruction1 },
    { icon: '②', text: instruction2 },
    { icon: '③', text: instruction3 },
    { icon: '④', text: instruction4 },
    { icon: '⑤', text: instruction5 },
  ]

  return (
    <>
      <ProductJsonLd 
        name="SweetB – Lychee Mint"
        description={description}
      />
      <PageBackground />
      <BackgroundElements />
      <div className={styles.page}>
        <FlavourHeader
        title={title}
        tagline={tagline}
        description={description}
      />

      <section className={styles.intro}>
        <div className={styles.introContainer}>
          <p className={styles.introText}>
            {intro}
          </p>
        </div>
      </section>

      <FlavourProfileCards cards={profileCards} />

      <FlavourGraph attributes={flavourAttributes} />

      <TastingNotes
        notes={tastingNotes}
        aroma="subtle lychee peel with a breath of mint."
        mouthfeel="silky, cooling, impeccably smooth."
      />

      <section className={styles.howToEnjoy}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{howToEnjoyTitle}</h2>
          <ul className={styles.instructionsList}>
            {instructions.map((instruction, index) => (
              <li key={index} className={styles.instruction}>
                <span className={styles.instructionIcon}>{instruction.icon}</span>
                <span className={styles.instructionText}>{instruction.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <SafetyBadges />

      <section className={styles.provenance}>
        <div className={styles.provenanceContainer}>
          <div className={styles.provenanceContent}>
            <h2 className={styles.sectionTitle}>{provenanceTitle}</h2>
            <p className={styles.provenanceText}>
              {provenanceText}
            </p>
          </div>
          <div className={styles.provenanceImageWrapper}>
            <Image
              src="https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600&q=80"
              alt="Natural herbs and botanicals"
              width={600}
              height={400}
              className={styles.provenanceImage}
            />
            <div className={styles.imageOverlay}></div>
          </div>
        </div>
      </section>
      </div>
      <Footer />
    </>
  )
}

