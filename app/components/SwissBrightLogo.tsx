'use client'

import Link from 'next/link'
import styles from './SwissBrightLogo.module.css'

interface SwissBrightLogoProps {
  className?: string
  size?: 'small' | 'medium' | 'large'
  href?: string
}

export default function SwissBrightLogo({ 
  className = '', 
  size = 'medium',
  href = '/'
}: SwissBrightLogoProps) {
  const sizeClass = styles[size]
  
  const logoContent = (
    <div className={`${styles.logo} ${sizeClass} ${className}`}>
      <span className={styles.swiss}>Swiss</span>
      <span className={styles.bright}>Bright</span>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className={styles.logoLink}>
        {logoContent}
      </Link>
    )
  }

  return logoContent
}



