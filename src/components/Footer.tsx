import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <span className={styles.logo}>🤙 Shaka Hawaiian BBQ</span>
          <p>Authentic Hawaiian BBQ in The Colony, TX.</p>
        </div>
        <div className={styles.info}>
          <div className={styles.infoGroup}>
            <h4>Location</h4>
            <address>
              5733 TX-121 #290<br />
              The Colony, TX 75056
            </address>
          </div>
          <div className={styles.infoGroup}>
            <h4>Contact</h4>
            <a href="tel:2146182627">214-618-2627</a>
          </div>
          <div className={styles.infoGroup}>
            <h4>Hours</h4>
            <p>Ask in store</p>
          </div>
        </div>
      </div>
      <div className={styles.copy}>
        <div className="container">
          <p>© {new Date().getFullYear()} Shaka Hawaiian BBQ. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
