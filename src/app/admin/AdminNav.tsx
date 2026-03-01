'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './admin.module.css';

export function AdminNav() {
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' });
    router.push('/admin/login');
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarLogo}>
        <span>🤙</span>
        <div>
          <strong>Shaka Admin</strong>
          <span>Dashboard</span>
        </div>
      </div>
      <nav className={styles.sidebarNav}>
        <Link href="/admin/orders" className={styles.sidebarLink}>
          📋 Orders
        </Link>
        <Link href="/admin/menu" className={styles.sidebarLink}>
          🍽️ Menu
        </Link>
      </nav>
      <div className={styles.sidebarFooter}>
        <Link href="/" className={styles.sidebarLink} style={{ color: 'rgba(255,255,255,0.6)' }}>
          ← Back to Site
        </Link>
        <button className={styles.logoutBtn} onClick={logout}>
          Logout
        </button>
      </div>
    </aside>
  );
}
