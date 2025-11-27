import { getContent } from '@/lib/content'
import MemberBanner from './MemberBanner'

export default async function MemberBannerWrapper() {
  const message = await getContent('memberbanner.message', 'Unlock Member Perks — Free gifts with every 10-box purchase')
  const buttonText = await getContent('memberbanner.button', 'Create Account')

  return <MemberBanner message={message} buttonText={buttonText} />
}


