import Link from 'next/link'
import styles from './page.module.css'
import PageBackground from '@/app/components/PageBackground'
import BackgroundElements from '@/app/components/BackgroundElements'
import { getContent } from '@/lib/content'
import { generatePageMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return generatePageMetadata({
    title: 'Privacy Policy - SweetB',
    description: 'Privacy policy for SweetB. Learn how we collect, use, and protect your personal information.',
    path: '/privacy',
    keywords: ['privacy', 'policy', 'sweetb', 'data protection', 'personal information'],
  })
}

export default async function PrivacyPage() {
  const backLink = await getContent('contact.back', '← Back to Home')
  
  // Fetch all privacy content
  const [
    title,
    lastUpdated,
    section1Title,
    section1Content,
    section2Title,
    section2Content,
    section2Sub1Title,
    section2Sub1Intro,
    section2Sub1List1,
    section2Sub1List2,
    section2Sub1List3,
    section2Sub1List4,
    section2Sub1List5,
    section2Sub2Title,
    section2Sub2Intro,
    section2Sub2List1,
    section2Sub2List2,
    section2Sub2List3,
    section3Title,
    section3Intro,
    section3List1,
    section3List2,
    section3List3,
    section3List4,
    section3List5,
    section3List6,
    section3List7,
    section3List8,
    section3List9,
    section4Title,
    section4Intro,
    section4Sub1Title,
    section4Sub1Intro,
    section4Sub1List1,
    section4Sub1List2,
    section4Sub1List3,
    section4Sub1List4,
    section4Sub1List5,
    section4Sub1Closing,
    section4Sub2Title,
    section4Sub2Content,
    section4Sub3Title,
    section4Sub3Content,
    section4Sub4Title,
    section4Sub4Content,
    section5Title,
    section5Intro,
    section5List1,
    section5List2,
    section5List3,
    section5List4,
    section5List5,
    section5Closing,
    section6Title,
    section6Intro,
    section6TypesTitle,
    section6List1,
    section6List2,
    section6List3,
    section6List4,
    section6Closing,
    section7Title,
    section7Intro,
    section7List1,
    section7List2,
    section7List3,
    section7List4,
    section7List5,
    section7List6,
    section7List7,
    section7List8,
    section7Closing,
    section8Title,
    section8Intro,
    section8FactorsIntro,
    section8List1,
    section8List2,
    section8List3,
    section8List4,
    section9Title,
    section9Content,
    section10Title,
    section10Content1,
    section10Content2,
    section11Title,
    section11Content,
    section12Title,
    section12Content1,
    section12Content2,
    section13Title,
    section13Content1,
    section13Content2,
  ] = await Promise.all([
    getContent('privacy.title', 'Privacy Policy'),
    getContent('privacy.lastUpdated', `Last Updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`),
    getContent('privacy.section1.title', '1. Introduction'),
    getContent('privacy.section1.content', 'SweetB ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or make a purchase. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site or use our services.'),
    getContent('privacy.section2.title', '2. Information We Collect'),
    getContent('privacy.section2.intro', 'We collect information that you provide directly to us, as well as information automatically collected when you use our services.'),
    getContent('privacy.section2.sub1.title', '2.1 Information You Provide'),
    getContent('privacy.section2.sub1.intro', 'We may collect the following information when you:'),
    getContent('privacy.section2.sub1.list1', 'Create an Account: Name, email address, phone number, and password'),
    getContent('privacy.section2.sub1.list2', 'Place an Order: Billing address, shipping address, payment information, and order details'),
    getContent('privacy.section2.sub1.list3', 'Contact Us: Name, email address, phone number, and any information you provide in your message'),
    getContent('privacy.section2.sub1.list4', 'Subscribe to Communications: Email address and preferences'),
    getContent('privacy.section2.sub1.list5', 'Participate in Promotions: Information required to participate in contests, surveys, or promotional activities'),
    getContent('privacy.section2.sub2.title', '2.2 Automatically Collected Information'),
    getContent('privacy.section2.sub2.intro', 'When you visit our website, we automatically collect certain information, including:'),
    getContent('privacy.section2.sub2.list1', 'Device Information: IP address, browser type, operating system, device identifiers'),
    getContent('privacy.section2.sub2.list2', 'Usage Data: Pages visited, time spent on pages, click patterns, referring website addresses'),
    getContent('privacy.section2.sub2.list3', 'Cookies and Tracking Technologies: We use cookies and similar tracking technologies to track activity on our website and store certain information'),
    getContent('privacy.section3.title', '3. How We Use Your Information'),
    getContent('privacy.section3.intro', 'We use the information we collect for various purposes, including:'),
    getContent('privacy.section3.list1', 'Processing and fulfilling your orders'),
    getContent('privacy.section3.list2', 'Managing your account and providing customer support'),
    getContent('privacy.section3.list3', 'Sending you order confirmations, shipping updates, and account-related communications'),
    getContent('privacy.section3.list4', 'Responding to your inquiries, comments, or requests'),
    getContent('privacy.section3.list5', 'Sending you marketing communications (with your consent) about products, services, promotions, and events'),
    getContent('privacy.section3.list6', 'Improving our website, products, and services'),
    getContent('privacy.section3.list7', 'Detecting, preventing, and addressing technical issues, fraud, or security threats'),
    getContent('privacy.section3.list8', 'Complying with legal obligations and enforcing our terms and conditions'),
    getContent('privacy.section3.list9', 'Conducting analytics and research to better understand user behavior and preferences'),
    getContent('privacy.section4.title', '4. Information Sharing and Disclosure'),
    getContent('privacy.section4.intro', 'We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:'),
    getContent('privacy.section4.sub1.title', '4.1 Service Providers'),
    getContent('privacy.section4.sub1.intro', 'We may share your information with third-party service providers who perform services on our behalf, such as:'),
    getContent('privacy.section4.sub1.list1', 'Payment processors for transaction processing'),
    getContent('privacy.section4.sub1.list2', 'Shipping and courier services for order fulfillment'),
    getContent('privacy.section4.sub1.list3', 'Email service providers for communications'),
    getContent('privacy.section4.sub1.list4', 'Analytics providers to help us understand website usage'),
    getContent('privacy.section4.sub1.list5', 'Cloud storage and hosting providers'),
    getContent('privacy.section4.sub1.closing', 'These service providers are contractually obligated to protect your information and may only use it for the purposes we specify.'),
    getContent('privacy.section4.sub2.title', '4.2 Legal Requirements'),
    getContent('privacy.section4.sub2.content', 'We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).'),
    getContent('privacy.section4.sub3.title', '4.3 Business Transfers'),
    getContent('privacy.section4.sub3.content', 'In the event of a merger, acquisition, reorganization, or sale of assets, your information may be transferred as part of that transaction. We will notify you of any such change in ownership or control of your personal information.'),
    getContent('privacy.section4.sub4.title', '4.4 With Your Consent'),
    getContent('privacy.section4.sub4.content', 'We may share your information with third parties when you have given us explicit consent to do so.'),
    getContent('privacy.section5.title', '5. Data Security'),
    getContent('privacy.section5.intro', 'We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:'),
    getContent('privacy.section5.list1', 'Encryption of sensitive data in transit and at rest'),
    getContent('privacy.section5.list2', 'Secure servers and databases'),
    getContent('privacy.section5.list3', 'Regular security assessments and updates'),
    getContent('privacy.section5.list4', 'Access controls and authentication procedures'),
    getContent('privacy.section5.list5', 'Employee training on data protection'),
    getContent('privacy.section5.closing', 'However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.'),
    getContent('privacy.section6.title', '6. Cookies and Tracking Technologies'),
    getContent('privacy.section6.intro', 'We use cookies and similar tracking technologies to collect and store information about your preferences and activity on our website. Cookies are small data files stored on your device that help us improve your experience.'),
    getContent('privacy.section6.typesTitle', 'Types of Cookies We Use:'),
    getContent('privacy.section6.list1', 'Essential Cookies: Required for the website to function properly (e.g., authentication, shopping cart)'),
    getContent('privacy.section6.list2', 'Analytics Cookies: Help us understand how visitors interact with our website'),
    getContent('privacy.section6.list3', 'Preference Cookies: Remember your preferences (e.g., language selection)'),
    getContent('privacy.section6.list4', 'Marketing Cookies: Used to deliver relevant advertisements (with your consent)'),
    getContent('privacy.section6.closing', 'You can control cookies through your browser settings. However, disabling certain cookies may limit your ability to use some features of our website.'),
    getContent('privacy.section7.title', '7. Your Rights and Choices'),
    getContent('privacy.section7.intro', 'Depending on your location, you may have certain rights regarding your personal information, including:'),
    getContent('privacy.section7.list1', 'Access: Request access to the personal information we hold about you'),
    getContent('privacy.section7.list2', 'Correction: Request correction of inaccurate or incomplete information'),
    getContent('privacy.section7.list3', 'Deletion: Request deletion of your personal information (subject to legal and contractual obligations)'),
    getContent('privacy.section7.list4', 'Objection: Object to processing of your personal information for certain purposes'),
    getContent('privacy.section7.list5', 'Restriction: Request restriction of processing of your personal information'),
    getContent('privacy.section7.list6', 'Data Portability: Request transfer of your personal information to another service provider'),
    getContent('privacy.section7.list7', 'Withdraw Consent: Withdraw consent for processing where consent is the legal basis'),
    getContent('privacy.section7.list8', 'Opt-Out: Unsubscribe from marketing communications at any time'),
    getContent('privacy.section7.closing', 'To exercise these rights, please contact us through our Contact page. We will respond to your request within a reasonable timeframe and in accordance with applicable laws.'),
    getContent('privacy.section8.title', '8. Data Retention'),
    getContent('privacy.section8.intro', 'We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.'),
    getContent('privacy.section8.factorsIntro', 'Factors that determine retention periods include:'),
    getContent('privacy.section8.list1', 'The nature of the information'),
    getContent('privacy.section8.list2', 'Legal and regulatory requirements'),
    getContent('privacy.section8.list3', 'Business needs and operational requirements'),
    getContent('privacy.section8.list4', 'Your relationship with us (e.g., active account vs. closed account)'),
    getContent('privacy.section9.title', '9. Children\'s Privacy'),
    getContent('privacy.section9.content', 'Our website and services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately. If we become aware that we have collected personal information from a child without parental consent, we will take steps to delete such information.'),
    getContent('privacy.section10.title', '10. International Data Transfers'),
    getContent('privacy.section10.content1', 'Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from those in your country. By using our services, you consent to the transfer of your information to these countries.'),
    getContent('privacy.section10.content2', 'We take appropriate safeguards to ensure that your personal information receives an adequate level of protection in the countries where it is processed.'),
    getContent('privacy.section11.title', '11. Third-Party Links'),
    getContent('privacy.section11.content', 'Our website may contain links to third-party websites, services, or applications that are not operated by us. This Privacy Policy does not apply to third-party websites. We encourage you to review the privacy policies of any third-party sites you visit.'),
    getContent('privacy.section12.title', '12. Changes to This Privacy Policy'),
    getContent('privacy.section12.content1', 'We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.'),
    getContent('privacy.section12.content2', 'We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information. Your continued use of our website or services after any changes constitutes acceptance of the updated Privacy Policy.'),
    getContent('privacy.section13.title', '13. Contact Us'),
    getContent('privacy.section13.content1', 'If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us through our Contact page.'),
    getContent('privacy.section13.content2', 'For privacy-specific inquiries, please include "Privacy Policy" in your message subject line to help us respond more efficiently.'),
  ])
  
  return (
    <>
      <PageBackground />
      <BackgroundElements />
      <div className={styles.privacyPage}>
        <div className={styles.container}>
          <Link href="/" className={styles.backLink}>
            {backLink}
          </Link>
          
          <div className={styles.header}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.lastUpdated}>{lastUpdated}</p>
          </div>

          <div className={styles.content}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{section1Title}</h2>
              <p className={styles.paragraph}>{section1Content}</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{section2Title}</h2>
              <p className={styles.paragraph}>{section2Content}</p>
              
              <h3 className={styles.subsectionTitle}>{section2Sub1Title}</h3>
              <p className={styles.paragraph}>{section2Sub1Intro}</p>
              <ul className={styles.list}>
                <li><strong>{section2Sub1List1}</strong></li>
                <li><strong>{section2Sub1List2}</strong></li>
                <li><strong>{section2Sub1List3}</strong></li>
                <li><strong>{section2Sub1List4}</strong></li>
                <li><strong>{section2Sub1List5}</strong></li>
              </ul>

              <h3 className={styles.subsectionTitle}>{section2Sub2Title}</h3>
              <p className={styles.paragraph}>{section2Sub2Intro}</p>
              <ul className={styles.list}>
                <li><strong>{section2Sub2List1}</strong></li>
                <li><strong>{section2Sub2List2}</strong></li>
                <li><strong>{section2Sub2List3}</strong></li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{section3Title}</h2>
              <p className={styles.paragraph}>{section3Intro}</p>
              <ul className={styles.list}>
                <li>{section3List1}</li>
                <li>{section3List2}</li>
                <li>{section3List3}</li>
                <li>{section3List4}</li>
                <li>{section3List5}</li>
                <li>{section3List6}</li>
                <li>{section3List7}</li>
                <li>{section3List8}</li>
                <li>{section3List9}</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{section4Title}</h2>
              <p className={styles.paragraph}>{section4Intro}</p>
              
              <h3 className={styles.subsectionTitle}>{section4Sub1Title}</h3>
              <p className={styles.paragraph}>{section4Sub1Intro}</p>
              <ul className={styles.list}>
                <li>{section4Sub1List1}</li>
                <li>{section4Sub1List2}</li>
                <li>{section4Sub1List3}</li>
                <li>{section4Sub1List4}</li>
                <li>{section4Sub1List5}</li>
              </ul>
              <p className={styles.paragraph}>{section4Sub1Closing}</p>

              <h3 className={styles.subsectionTitle}>{section4Sub2Title}</h3>
              <p className={styles.paragraph}>{section4Sub2Content}</p>

              <h3 className={styles.subsectionTitle}>{section4Sub3Title}</h3>
              <p className={styles.paragraph}>{section4Sub3Content}</p>

              <h3 className={styles.subsectionTitle}>{section4Sub4Title}</h3>
              <p className={styles.paragraph}>{section4Sub4Content}</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{section5Title}</h2>
              <p className={styles.paragraph}>{section5Intro}</p>
              <ul className={styles.list}>
                <li>{section5List1}</li>
                <li>{section5List2}</li>
                <li>{section5List3}</li>
                <li>{section5List4}</li>
                <li>{section5List5}</li>
              </ul>
              <p className={styles.paragraph}>{section5Closing}</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{section6Title}</h2>
              <p className={styles.paragraph}>{section6Intro}</p>
              <p className={styles.paragraph}>
                <strong>{section6TypesTitle}</strong>
              </p>
              <ul className={styles.list}>
                <li><strong>{section6List1}</strong></li>
                <li><strong>{section6List2}</strong></li>
                <li><strong>{section6List3}</strong></li>
                <li><strong>{section6List4}</strong></li>
              </ul>
              <p className={styles.paragraph}>{section6Closing}</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{section7Title}</h2>
              <p className={styles.paragraph}>{section7Intro}</p>
              <ul className={styles.list}>
                <li><strong>{section7List1}</strong></li>
                <li><strong>{section7List2}</strong></li>
                <li><strong>{section7List3}</strong></li>
                <li><strong>{section7List4}</strong></li>
                <li><strong>{section7List5}</strong></li>
                <li><strong>{section7List6}</strong></li>
                <li><strong>{section7List7}</strong></li>
                <li><strong>{section7List8}</strong></li>
              </ul>
              <p className={styles.paragraph}>
                {section7Closing} <Link href="/contact" className={styles.link}>Contact page</Link>.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{section8Title}</h2>
              <p className={styles.paragraph}>{section8Intro}</p>
              <p className={styles.paragraph}>{section8FactorsIntro}</p>
              <ul className={styles.list}>
                <li>{section8List1}</li>
                <li>{section8List2}</li>
                <li>{section8List3}</li>
                <li>{section8List4}</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{section9Title}</h2>
              <p className={styles.paragraph}>{section9Content}</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{section10Title}</h2>
              <p className={styles.paragraph}>{section10Content1}</p>
              <p className={styles.paragraph}>{section10Content2}</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{section11Title}</h2>
              <p className={styles.paragraph}>{section11Content}</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{section12Title}</h2>
              <p className={styles.paragraph}>{section12Content1}</p>
              <p className={styles.paragraph}>{section12Content2}</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{section13Title}</h2>
              <p className={styles.paragraph}>
                {section13Content1} <Link href="/contact" className={styles.link}>Contact page</Link>.
              </p>
              <p className={styles.paragraph}>{section13Content2}</p>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
