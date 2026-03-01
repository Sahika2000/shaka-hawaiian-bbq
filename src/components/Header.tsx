'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { useCartDrawer } from './CartDrawer';
import styles from './Header.module.css';

export function Header() {
  const itemCount = useCart((s) => s.itemCount());
  const { openCart } = useCartDrawer();

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoEmoji}>🤙</span>
          <div>
            <span className={styles.logoMain}>Shaka</span>
            <span className={styles.logoSub}>Hawaiian BBQ</span>
          </div>
        </Link>

        <nav className={styles.nav}>
          <Link href="/menu" className={styles.navLink}>Menu</Link>
          <a
            href="https://www.google.com/maps/search/?api=1&query=5733+Texas+Highway+121+%23290+The+Colony+TX+75056"
            target="_blank"
            rel="noreferrer"
            className={styles.navLink}
          >
            Location
          </a>
          <a href="tel:2146182627" className={styles.navLink}>
            Call Us
          </a>
        </nav>

        <button
          className={styles.cartBtn}
          onClick={openCart}
          aria-label={`Cart — ${itemCount} items`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          {itemCount > 0 && (
            <span className={styles.cartBadge}>{itemCount}</span>
          )}
        </button>
      </div>
    </header>
  );
}
