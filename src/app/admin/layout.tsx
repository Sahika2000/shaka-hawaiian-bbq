import { AdminNav } from './AdminNav';
import styles from './admin.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Checked inside each page too, but this guards the layout
  return (
    <div className={styles.layout}>
      <AdminNav />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
