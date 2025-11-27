'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import LanguageSwitcher from './LanguageSwitcher'
import styles from './Header.module.css'

const CART_STORAGE_KEY = 'sweetb_shop_cart_v1'

type CartItem = {
  productId: string
  quantity: number
}

interface HeaderProps {
  benefits: string
  ingredients: string
  about: string
  faq: string
  verify: string
  contact: string
  shop: string
  login: string
}

export default function Header({
  benefits,
  ingredients,
  about,
  faq,
  verify,
  contact,
  shop,
  login,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const [user, setUser] = useState<{ id: string; email: string; name?: string | null; aliasName?: string | null } | null>(null)
  const [profile, setProfile] = useState<{
    name?: string | null
    aliasName?: string | null
    addressLine1?: string | null
    addressLine2?: string | null
    city?: string | null
    state?: string | null
    postalCode?: string | null
    country?: string | null
  } | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLLIElement>(null)

  // Only read from localStorage after component mounts (client-side only)
  useEffect(() => {
    setIsMounted(true)
    
    const updateCartCount = () => {
      try {
        const stored = localStorage.getItem(CART_STORAGE_KEY)
        if (stored) {
          const cart: CartItem[] = JSON.parse(stored)
          const total = cart.reduce((sum, item) => sum + item.quantity, 0)
          setCartCount(total)
        } else {
          setCartCount(0)
        }
      } catch {
        setCartCount(0)
      }
    }

    // Initial load
    updateCartCount()

    // Listen for storage changes (when cart is updated in ShopClient)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CART_STORAGE_KEY) {
        updateCartCount()
      }
    }

    // Listen for custom events (for same-tab updates)
    const handleCartUpdate = () => {
      updateCartCount()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('cartUpdated', handleCartUpdate)

    // Poll for changes (fallback for same-tab updates)
    const interval = setInterval(updateCartCount, 500)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('cartUpdated', handleCartUpdate)
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const sessionRes = await fetch('/api/auth/me')
        if (sessionRes.ok) {
          const data = await sessionRes.json()
          setUser(data.user ?? null)
          if (data.user) {
            const profileRes = await fetch('/api/account/profile')
            if (profileRes.ok) {
              const profileData = await profileRes.json()
              setProfile(profileData.profile || null)
            } else {
              setProfile(null)
            }
          } else {
            setProfile(null)
          }
        } else {
          setUser(null)
          setProfile(null)
        }
      } catch (error) {
        console.error('Failed to load user info:', error)
        setUser(null)
        setProfile(null)
      }
    }

    fetchSession()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <a href="/" className={styles.logo}>
          <Image 
            src="/images/logos/sweetb-logo-peru.png" 
            alt="SweetB PERÚ" 
            width={180}
            height={60}
            className={styles.logoImage}
            priority
          />
        </a>

        {/* Desktop Navigation */}
        <ul className={styles.navLinks}>
          <li><a href="/benefits">{benefits}</a></li>
          <li><a href="/#ingredients">{ingredients}</a></li>
          <li><a href="/about">{about}</a></li>
          <li><a href="/#faq">{faq}</a></li>
          <li><a href="/product-verification">{verify}</a></li>
          <li><a href="/contact" className={styles.contactLink}>{contact}</a></li>
          <li><a href="/shop" className={styles.shopLink}>{shop}</a></li>
          <li className={styles.cartIconItem}>
            <Link href="/shop" className={styles.cartIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 18.1 17.9 19 19 19C20.1 19 21 18.1 21 17V13M9 19.5C9.8 19.5 10.5 20.2 10.5 21C10.5 21.8 9.8 22.5 9 22.5C8.2 22.5 7.5 21.8 7.5 21C7.5 20.2 8.2 19.5 9 19.5ZM20 19.5C20.8 19.5 21.5 20.2 21.5 21C21.5 21.8 20.8 22.5 20 22.5C19.2 22.5 18.5 21.8 18.5 21C18.5 20.2 19.2 19.5 20 19.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {isMounted && cartCount > 0 && (
                <span className={styles.cartBadge}>{cartCount > 99 ? '99+' : cartCount}</span>
              )}
            </Link>
          </li>
          <li className={styles.languageSwitcherItem}>
            <LanguageSwitcher />
          </li>
          {user ? (
            <li ref={dropdownRef} className={styles.accountDropdown}>
              <button
                className={styles.accountButton}
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  setDropdownOpen((prev) => !prev)
                }}
                aria-expanded={dropdownOpen}
              >
                <span>{profile?.aliasName || profile?.name || user.aliasName || user.name || 'My Account'}</span>
                <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {dropdownOpen && (
                <div className={styles.accountMenu}>
                  <div className={styles.accountMenuHeader}>
                    <p>Welcome back</p>
                    <strong>{profile?.aliasName || profile?.name || user.aliasName || user.name || 'Account'}</strong>
                  </div>
                  <div className={styles.accountInfo}>
                    <div className={styles.accountField}>
                      <span>Email</span>
                      <strong>{user.email}</strong>
                      <small>View only</small>
                    </div>
                    {(profile?.name || profile?.aliasName) && (
                      <div className={styles.accountField}>
                        <span>Name</span>
                        <strong>{profile?.name || profile?.aliasName}</strong>
                      </div>
                    )}
                    {profile?.addressLine1 && (
                      <div className={styles.accountField}>
                        <span>Address</span>
                        <strong>
                          {profile.addressLine1}
                          {profile.addressLine2 ? `, ${profile.addressLine2}` : ''}
                          {profile.city ? `, ${profile.city}` : ''}
                          {profile.state ? `, ${profile.state}` : ''}
                          {profile.postalCode ? ` ${profile.postalCode}` : ''}
                          {profile.country ? `, ${profile.country}` : ''}
                        </strong>
                      </div>
                    )}
                  </div>
                  <div className={styles.accountMenuFooter}>
                    <Link href="/account" className={styles.accountLink}>Account Home</Link>
                    <Link href="/account/settings" className={styles.accountLink}>Manage account settings</Link>
                    <button type="button" className={styles.signOutButton} onClick={async () => {
                      await fetch('/api/auth/logout', { method: 'POST' })
                      window.location.href = '/'
                    }}>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </li>
          ) : (
            <li><a href="/login" className={styles.loginButton}>{login}</a></li>
          )}
        </ul>

        {/* Mobile Language Switcher, Cart Icon, and Burger Button */}
        <div className={styles.mobileControls}>
          <div className={styles.mobileLanguageSwitcher}>
            <LanguageSwitcher />
          </div>
          <Link href="/shop" className={styles.mobileCartIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 18.1 17.9 19 19 19C20.1 19 21 18.1 21 17V13M9 19.5C9.8 19.5 10.5 20.2 10.5 21C10.5 21.8 9.8 22.5 9 22.5C8.2 22.5 7.5 21.8 7.5 21C7.5 20.2 8.2 19.5 9 19.5ZM20 19.5C20.8 19.5 21.5 20.2 21.5 21C21.5 21.8 20.8 22.5 20 22.5C19.2 22.5 18.5 21.8 18.5 21C18.5 20.2 19.2 19.5 20 19.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {isMounted && cartCount > 0 && (
              <span className={styles.cartBadge}>{cartCount > 99 ? '99+' : cartCount}</span>
            )}
          </Link>
          <button 
            className={`${styles.burgerButton} ${mobileMenuOpen ? styles.burgerOpen : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className={styles.burgerLine}></span>
            <span className={styles.burgerLine}></span>
            <span className={styles.burgerLine}></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className={styles.mobileOverlay} onClick={closeMenu}></div>
      )}

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <div className={styles.mobileMenuHeader}>
          <a href="/" className={styles.mobileLogo} onClick={closeMenu}>
            <Image 
              src="/images/logos/sweetb-logo-peru.png" 
              alt="SweetB PERÚ" 
              width={150}
              height={50}
              className={styles.logoImage}
            />
          </a>
        </div>

        <ul className={styles.mobileNavLinks}>
          <li><a href="/benefits" onClick={closeMenu}>{benefits}</a></li>
          <li><a href="/#ingredients" onClick={closeMenu}>{ingredients}</a></li>
          <li><a href="/about" onClick={closeMenu}>{about}</a></li>
          <li><a href="/#faq" onClick={closeMenu}>{faq}</a></li>
          <li><a href="/product-verification" onClick={closeMenu}>{verify}</a></li>
          <li><a href="/contact" onClick={closeMenu}>{contact}</a></li>
          <li><a href="/shop" onClick={closeMenu}>{shop}</a></li>
          {user ? (
            <li className={styles.mobileAccountSection}>
              <p style={{ color: '#F8F8F8', fontWeight: 600 }}>{profile?.aliasName || profile?.name || user.aliasName || user.name || 'Account'}</p>
              <p style={{ color: '#B8B8B8', fontSize: '0.9rem', marginBottom: '0.2rem' }}>{user.email}</p>
              <Link href="/account" className={styles.mobileAccountLink} onClick={closeMenu}>Account Home</Link>
              <Link href="/account/settings" className={styles.mobileAccountLink} onClick={closeMenu}>Manage account settings</Link>
              <button onClick={async () => {
                await fetch('/api/auth/logout', { method: 'POST' })
                window.location.href = '/'
              }} className={styles.mobileLogoutButton}>Sign out</button>
            </li>
          ) : (
            <li className={styles.mobileLoginItem}>
              <a href="/login" className={styles.mobileLoginButton} onClick={closeMenu}>
                {login}
              </a>
            </li>
          )}
        </ul>

        <div className={styles.mobileMenuFooter}>
          <p>© 2025 SweetB</p>
        </div>
      </div>
    </header>
  )
}

