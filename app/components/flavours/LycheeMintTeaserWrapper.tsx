import { getContent } from '@/lib/content'
import LycheeMintTeaser from './LycheeMintTeaser'

export default async function LycheeMintTeaserWrapper() {
  const eyebrow = await getContent('lycheemint.eyebrow', 'New Flavour')
  const title = await getContent('lycheemint.title', 'Lychee Mint')
  const subhead = await getContent('lycheemint.subhead', 'A clean surge of clarity meets a cool, tropical finish.\nPrecision-crafted for men who move with intent.')
  const highlight1Title = await getContent('lycheemint.highlight1.title', 'Tropical Lychee')
  const highlight1Desc = await getContent('lycheemint.highlight1.desc', 'Soft, refined sweetness')
  const highlight2Title = await getContent('lycheemint.highlight2.title', 'Cool Mint')
  const highlight2Desc = await getContent('lycheemint.highlight2.desc', 'Crisp, lingering freshness')
  const highlight3Title = await getContent('lycheemint.highlight3.title', 'Smooth Balance')
  const highlight3Desc = await getContent('lycheemint.highlight3.desc', 'Steady, confident lift')
  const cta1 = await getContent('lycheemint.cta1', 'Discover Lychee Mint')
  const cta2 = await getContent('lycheemint.cta2', 'Shop SweetB →')

  return (
    <LycheeMintTeaser
      eyebrow={eyebrow}
      title={title}
      subhead={subhead}
      highlight1Title={highlight1Title}
      highlight1Desc={highlight1Desc}
      highlight2Title={highlight2Title}
      highlight2Desc={highlight2Desc}
      highlight3Title={highlight3Title}
      highlight3Desc={highlight3Desc}
      cta1={cta1}
      cta2={cta2}
    />
  )
}


