import { getContent } from '@/lib/content'
import PromotionalModal from './PromotionalModal'

export default async function PromotionalModalWrapper() {
  const message = await getContent('promotionalmodal.message', 'Join SweetB Members and unlock exclusive perks — receive free gifts with every 10-box purchase.')
  const ctaText = await getContent('promotionalmodal.cta', 'Sign Up')

  return (
    <PromotionalModal 
      message={message}
      ctaText={ctaText}
    />
  )
}

