'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './AdminShell.module.css'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '🏠' },
  { href: '/admin/orders', label: 'Orders', icon: '📦' },
  { href: '/admin/shop', label: 'Shop', icon: '🛍️' },
  { href: '/admin/promotions', label: 'Promotions', icon: '🎉' },
  { href: '/admin/couriers', label: 'Couriers', icon: '🚚' },
  { href: '/admin/users', label: 'Users', icon: '👥' },
  { href: '/admin/redemptions', label: 'Redemptions', icon: '🎁' },
  { href: '/admin/gifts', label: 'Gift Catalog', icon: '🎁' },
  { href: '/admin/verification-codes', label: 'Verification Codes', icon: '🛡️' },
  { href: '/admin/flags', label: 'Feature Flags', icon: '⚙️' },
  { href: '/admin/draws', label: 'Draws', icon: '🎲' },
  { href: '/admin/content', label: 'Content', icon: '✏️' },
  { href: '/admin/media', label: 'Media Library', icon: '🖼️' },
  { href: '/admin/contact-links', label: 'Contact Links', icon: '☎️' },
  { href: '/admin/exports', label: 'Exports', icon: '📤' },
  { href: '/admin/settings', label: 'Settings', icon: '🌐' },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          SweetB
          <span>Admin</span>
        </div>
        <ul className={styles.navList}>
          {navItems.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname?.startsWith(item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
        <p className={styles.mobileNote}>All tools live here now. Add new modules by extending the navigation.</p>
      </aside>
      <main className={styles.content}>{children}</main>
    </div>
  )
}


