import Link from 'next/link'
import styles from './page.module.css'
import PageBackground from '@/app/components/PageBackground'
import BackgroundElements from '@/app/components/BackgroundElements'
import { getContent } from '@/lib/content'
import { generatePageMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return generatePageMetadata({
    title: 'Terms and Conditions - Swiss Bright',
    description: 'Terms and conditions for Swiss Bright. Read our policies on shipping, refunds, trademarks, and more.',
    path: '/terms',
    keywords: ['terms', 'conditions', 'swiss bright', 'policies', 'shipping', 'refund'],
  })
}

export default async function TermsPage() {
  const backLink = await getContent('contact.back', '← Back to Home')
  const currentLanguage = await getContent('terms.language', 'en')
  
  // Fetch all terms content
  const [
    title,
    lastUpdated,
    section1Title,
    section1Content,
    section2Title,
    section2Content1,
    section2Content2,
    section3Title,
    section3Content1,
    section3Content2,
    section4Title,
    section4ProcessingTime,
    section4ShippingMethods,
    section4DeliveryAddress,
    section4ThirdPartyCouriers,
    section4InternationalShipping,
    section5Title,
    section5Eligibility,
    section5NoRefundOpened,
    section5ReportingTimeframe,
    section5RefundProcess,
    section5ReturnShipping,
    section5NonRefundable,
    section5NonRefundableList1,
    section5NonRefundableList2,
    section5NonRefundableList3,
    section5NonRefundableList4,
    section6Title,
    section6Content1,
    section6Content2,
    section7Title,
    section7Content,
    section7List1,
    section7List2,
    section7List3,
    section7List4,
    section7List5,
    section7List6,
    section7List7,
    section8Title,
    section8Content1,
    section8Content2,
    section9Title,
    section9Content1,
    section9Content2,
    section10Title,
    section10Content,
    section10List1,
    section10List2,
    section10List3,
    section10List4,
    section10List5,
    section11Title,
    section11Content1,
    section11Content2,
    section12Title,
    section12Content1,
    section12Content2,
    section13Title,
    section13Content,
    section14Title,
    section14Content,
  ] = await Promise.all([
    getContent('terms.title', 'Terms and Conditions'),
    getContent('terms.lastUpdated', `Last Updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`),
    getContent('terms.section1.title', '1. Acceptance of Terms'),
    getContent('terms.section1.content', 'By accessing and using the Swiss Bright website and purchasing our products, you accept and agree to be bound by the terms and conditions set forth in this agreement. If you do not agree to these terms, please do not use our website or purchase our products.'),
    getContent('terms.section2.title', '2. Trademark and Intellectual Property'),
    getContent('terms.section2.content1', 'All content on this website, including but not limited to text, graphics, logos, images, audio clips, digital downloads, and software, is the property of Swiss Bright or its content suppliers and is protected by international copyright and trademark laws. The "Swiss Bright" name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of Swiss Bright or its affiliates or licensors.'),
    getContent('terms.section2.content2', 'You may not use, reproduce, distribute, modify, or create derivative works of any content from this website without our prior written consent. Unauthorized use of our trademarks or copyrighted material may result in legal action.'),
    getContent('terms.section3.title', '3. Product Information'),
    getContent('terms.section3.content1', 'We strive to provide accurate product descriptions, images, and pricing information. However, we do not warrant that product descriptions or other content on this site is accurate, complete, reliable, current, or error-free. If a product offered by us is not as described, your sole remedy is to return it in unused condition.'),
    getContent('terms.section3.content2', 'We reserve the right to correct any errors, inaccuracies, or omissions and to change or update information at any time without prior notice. We also reserve the right to limit quantities purchased per person, per household, or per order.'),
    getContent('terms.section4.title', '4. Shipping Policy'),
    getContent('terms.section4.processingTime', 'Processing Time: Orders are typically processed and shipped within 1 business day of order confirmation. Processing times may vary during peak seasons or promotional periods.'),
    getContent('terms.section4.shippingMethods', 'Shipping Methods: We use third-party courier services to deliver your orders. Available shipping options and estimated delivery times will be displayed at checkout. Shipping fees are calculated based on the selected courier service and delivery location.'),
    getContent('terms.section4.deliveryAddress', 'Delivery Address: You are responsible for providing accurate delivery information. We are not liable for delays or failed deliveries due to incorrect or incomplete address information provided by you.'),
    getContent('terms.section4.thirdPartyCouriers', 'Third-Party Couriers: Once your order is handed over to the courier service, Swiss Bright is not responsible for any delays, damages, or losses that occur during transit. Any claims regarding shipping delays, damaged packages, or lost items must be directed to the respective courier service. We will assist you in filing claims with the courier, but we are not liable for their service failures.'),
    getContent('terms.section4.internationalShipping', 'International Shipping: Due to international laws and regulations, international delivery is not available through standard checkout. Please contact our customer service through our Contact page to arrange international delivery. Our team will assist you with shipping options, customs requirements, and any applicable fees for your destination country.'),
    getContent('terms.section5.title', '5. Refund and Return Policy'),
    getContent('terms.section5.eligibility', 'Eligibility for Refunds: We offer refunds for products that are defective, damaged during shipping (before delivery), or not as described, subject to the conditions outlined below.'),
    getContent('terms.section5.noRefundOpened', 'No Refund on Opened Packaging: Products with opened, damaged, or tampered packaging are not eligible for refunds. To be eligible for a refund, products must be returned in their original, unopened, and sealed condition.'),
    getContent('terms.section5.reportingTimeframe', 'Reporting Timeframe: You must report any issues with your order within 7 days of receiving the product. Claims submitted after this 7-day period will not be considered for refunds or replacements.'),
    getContent('terms.section5.refundProcess', 'Refund Process: To request a refund, please contact us through our Contact page with your order number, a description of the issue, and photographic evidence if applicable. Once approved, refunds will be processed to the original payment method within 5-10 business days.'),
    getContent('terms.section5.returnShipping', 'Return Shipping: For eligible returns, return shipping costs may be the responsibility of the customer unless the product is defective or incorrectly shipped by us.'),
    getContent('terms.section5.nonRefundable', 'Non-Refundable Items: The following items are not eligible for refunds:'),
    getContent('terms.section5.nonRefundableList1', 'Products with opened or tampered packaging'),
    getContent('terms.section5.nonRefundableList2', 'Products returned after the 7-day reporting period'),
    getContent('terms.section5.nonRefundableList3', 'Products damaged due to misuse or negligence'),
    getContent('terms.section5.nonRefundableList4', 'Digital products or services'),
    getContent('terms.section6.title', '6. Payment Terms'),
    getContent('terms.section6.content1', 'All orders must be paid in full before processing and shipping. We accept bank transfers and other payment methods as displayed at checkout. Payment confirmation may take 1-2 business days to process.'),
    getContent('terms.section6.content2', 'Orders will remain in "Processing" status until payment is confirmed by our team. Once payment is verified, your order will be processed and shipped according to our shipping policy.'),
    getContent('terms.section7.title', '7. Limitation of Liability'),
    getContent('terms.section7.content', 'To the fullest extent permitted by law, Swiss Bright shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:'),
    getContent('terms.section7.list1', 'Your use or inability to use our website or services'),
    getContent('terms.section7.list2', 'Any conduct or content of third parties on our website'),
    getContent('terms.section7.list3', 'Any unauthorized access to or use of our servers and/or any personal information stored therein'),
    getContent('terms.section7.list4', 'Any interruption or cessation of transmission to or from our website'),
    getContent('terms.section7.list5', 'Any bugs, viruses, trojan horses, or the like that may be transmitted to or through our website'),
    getContent('terms.section7.list6', 'Any errors or omissions in any content or for any loss or damage incurred as a result of the use of any content posted, emailed, transmitted, or otherwise made available through our website'),
    getContent('terms.section7.list7', 'Delays, damages, or losses caused by third-party courier services'),
    getContent('terms.section8.title', '8. Third-Party Services'),
    getContent('terms.section8.content1', 'Our website and services may contain links to third-party websites or services that are not owned or controlled by Swiss Bright. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.'),
    getContent('terms.section8.content2', 'Courier Services: We use third-party courier services for order delivery. Swiss Bright is not responsible for the actions, delays, errors, or omissions of these courier services. Any issues with shipping, delivery, or package handling must be addressed directly with the courier service, though we will assist you in resolving such matters.'),
    getContent('terms.section9.title', '9. User Accounts and Registration'),
    getContent('terms.section9.content1', 'To place orders, you must create an account and provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.'),
    getContent('terms.section9.content2', 'You agree to notify us immediately of any unauthorized use of your account or any other breach of security. We reserve the right to suspend or terminate your account at any time for violation of these terms.'),
    getContent('terms.section10.title', '10. Prohibited Uses'),
    getContent('terms.section10.content', 'You may not use our website or products:'),
    getContent('terms.section10.list1', 'In any way that violates any applicable national or international law or regulation'),
    getContent('terms.section10.list2', 'To transmit, or procure the sending of, any advertising or promotional material without our prior written consent'),
    getContent('terms.section10.list3', 'To impersonate or attempt to impersonate the company, a company employee, another user, or any other person or entity'),
    getContent('terms.section10.list4', 'In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful'),
    getContent('terms.section10.list5', 'To engage in any other conduct that restricts or inhibits anyone\'s use or enjoyment of the website'),
    getContent('terms.section11.title', '11. Health and Safety Disclaimer'),
    getContent('terms.section11.content1', 'Our products are dietary supplements and are not intended to diagnose, treat, cure, or prevent any disease. Consult with a healthcare professional before using our products, especially if you have any medical conditions, are taking medications, or are pregnant or nursing.'),
    getContent('terms.section11.content2', 'Do not exceed the recommended dosage. Discontinue use and consult a healthcare professional if you experience any adverse reactions. Keep products out of reach of children.'),
    getContent('terms.section12.title', '12. Changes to Terms'),
    getContent('terms.section12.content1', 'We reserve the right to modify these terms and conditions at any time. Changes will be effective immediately upon posting to this page. Your continued use of our website or services after any changes constitutes acceptance of the new terms.'),
    getContent('terms.section12.content2', 'We encourage you to review these terms periodically to stay informed of any updates.'),
    getContent('terms.section13.title', '13. Governing Law'),
    getContent('terms.section13.content', 'These terms and conditions shall be governed by and construed in accordance with the laws of Malaysia, without regard to its conflict of law provisions. Any disputes arising from these terms or your use of our website shall be subject to the exclusive jurisdiction of the courts of Malaysia.'),
    getContent('terms.section14.title', '14. Contact Information'),
    getContent('terms.section14.content', 'If you have any questions about these Terms and Conditions, please contact us through our Contact page.'),
  ])
  
  return (
    <>
      <PageBackground />
      <BackgroundElements />
      <div className={styles.termsPage}>
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
              <p className={styles.paragraph}>{section2Content1}</p>
              <p className={styles.paragraph}>{section2Content2}</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{section3Title}</h2>
              <p className={styles.paragraph}>{section3Content1}</p>
              <p className={styles.paragraph}>{section3Content2}</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{section4Title}</h2>
              <p className={styles.paragraph}><strong>Processing Time:</strong> {section4ProcessingTime}</p>
              <p className={styles.paragraph}><strong>Shipping Methods:</strong> {section4ShippingMethods}</p>
              <p className={styles.paragraph}><strong>Delivery Address:</strong> {section4DeliveryAddress}</p>
              <p className={styles.paragraph}><strong>Third-Party Couriers:</strong> {section4ThirdPartyCouriers}</p>
              <p className={styles.paragraph}><strong>International Shipping:</strong> {section4InternationalShipping}</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{section5Title}</h2>
              <p className={styles.paragraph}><strong>Eligibility for Refunds:</strong> {section5Eligibility}</p>
              <p className={styles.paragraph}><strong>No Refund on Opened Packaging:</strong> {section5NoRefundOpened}</p>
              <p className={styles.paragraph}><strong>Reporting Timeframe:</strong> {section5ReportingTimeframe}</p>
              <p className={styles.paragraph}><strong>Refund Process:</strong> {section5RefundProcess}</p>
              <p className={styles.paragraph}><strong>Return Shipping:</strong> {section5ReturnShipping}</p>
              <p className={styles.paragraph}><strong>Non-Refundable Items:</strong> {section5NonRefundable}</p>
              <ul className={styles.list}>
                <li>{section5NonRefundableList1}</li>
                <li>{section5NonRefundableList2}</li>
                <li>{section5NonRefundableList3}</li>
                <li>{section5NonRefundableList4}</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{section6Title}</h2>
              <p className={styles.paragraph}>{section6Content1}</p>
              <p className={styles.paragraph}>{section6Content2}</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{section7Title}</h2>
              <p className={styles.paragraph}>{section7Content}</p>
              <ul className={styles.list}>
                <li>{section7List1}</li>
                <li>{section7List2}</li>
                <li>{section7List3}</li>
                <li>{section7List4}</li>
                <li>{section7List5}</li>
                <li>{section7List6}</li>
                <li>{section7List7}</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{section8Title}</h2>
              <p className={styles.paragraph}>{section8Content1}</p>
              <p className={styles.paragraph}><strong>Courier Services:</strong> {section8Content2}</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{section9Title}</h2>
              <p className={styles.paragraph}>{section9Content1}</p>
              <p className={styles.paragraph}>{section9Content2}</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{section10Title}</h2>
              <p className={styles.paragraph}>{section10Content}</p>
              <ul className={styles.list}>
                <li>{section10List1}</li>
                <li>{section10List2}</li>
                <li>{section10List3}</li>
                <li>{section10List4}</li>
                <li>{section10List5}</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{section11Title}</h2>
              <p className={styles.paragraph}>{section11Content1}</p>
              <p className={styles.paragraph}>{section11Content2}</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{section12Title}</h2>
              <p className={styles.paragraph}>{section12Content1}</p>
              <p className={styles.paragraph}>{section12Content2}</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{section13Title}</h2>
              <p className={styles.paragraph}>{section13Content}</p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{section14Title}</h2>
              <p className={styles.paragraph}>
                {section14Content} <Link href="/contact" className={styles.link}>Contact page</Link>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
