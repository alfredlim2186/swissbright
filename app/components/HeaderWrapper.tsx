import { getContent } from '@/lib/content'
import Header from './Header'

export default async function HeaderWrapper() {
  const benefits = await getContent('header.benefits', 'Benefits')
  const ingredients = await getContent('header.ingredients', 'Ingredients')
  const about = await getContent('header.about', 'About')
  const faq = await getContent('header.faq', 'FAQ')
  const verify = await getContent('header.verify', 'Verify')
  const contact = await getContent('header.contact', 'Contact')
  const shop = await getContent('header.shop', 'Shop')
  const login = await getContent('header.login', 'Log In/Sign Up')

  return (
    <Header
      benefits={benefits}
      ingredients={ingredients}
      about={about}
      faq={faq}
      verify={verify}
      contact={contact}
      shop={shop}
      login={login}
    />
  )
}

