import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import styles from './page.module.css';

export const revalidate = 60;

export default async function HomePage() {
  const categories = await prisma.menuCategory.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { items: { where: { available: true }, take: 1, orderBy: { sortOrder: 'asc' } } },
  });

  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>🤙 The Colony, TX</span>
          <h1 className={styles.heroTitle}>
            Taste the<br />
            <em>Aloha Spirit</em>
          </h1>
          <p className={styles.heroSubtitle}>
            Authentic Hawaiian BBQ — bold flavors, island vibes, right here in North Texas.
          </p>
          <div className={styles.heroActions}>
            <Link href="/menu" className="btn-primary">
              Order Now
            </Link>
            <a
              href="https://www.google.com/maps/search/?api=1&query=5733+Texas+Highway+121+%23290+The+Colony+TX+75056"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
            >
              Get Directions
            </a>
          </div>
          <div className={styles.heroInfo}>
            <div className={styles.heroInfoItem}>
              <span className={styles.heroInfoIcon}>📍</span>
              <span>5733 TX-121 #290, The Colony, TX 75056</span>
            </div>
            <div className={styles.heroInfoItem}>
              <span className={styles.heroInfoIcon}>📞</span>
              <a href="tel:2146182627">214-618-2627</a>
            </div>
            <div className={styles.heroInfoItem}>
              <span className={styles.heroInfoIcon}>🕐</span>
              <span>Hours: Ask in store</span>
            </div>
          </div>
        </div>
        <div className={styles.waveBottom} />
      </section>

      {/* Featured Categories */}
      <section className={styles.categories}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Explore Our Menu</h2>
          <p className={styles.sectionSubtitle}>From island classics to BBQ favorites — something for everyone</p>
          <div className={styles.categoryGrid}>
            {categories.map((cat) => (
              <Link key={cat.id} href={`/menu#${encodeURIComponent(cat.name)}`} className={styles.categoryCard}>
                <div className={styles.categoryIcon}>{getCategoryEmoji(cat.name)}</div>
                <h3>{cat.name}</h3>
                <span className={styles.categoryCount}>
                  {cat.items.length > 0 ? 'View items →' : 'View →'}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaInner}>
            <div className={styles.ctaText}>
              <h2>Ready to Order?</h2>
              <p>Pick up fresh Hawaiian BBQ at our location in The Colony.</p>
            </div>
            <div className={styles.ctaActions}>
              <Link href="/menu" className="btn-primary">
                Browse Full Menu
              </Link>
              <a href="tel:2146182627" className="btn-secondary">
                Call 214-618-2627
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function getCategoryEmoji(name: string): string {
  const map: Record<string, string> = {
    'Appetizers & Sides': '🍤',
    'Gourmet Salads': '🥗',
    'Aloha Plate': '🍽️',
    'Family Meal': '👨‍👩‍👧‍👦',
    'Mini Meals': '🍱',
    'Shaka Favorites': '🤙',
    'Chicken': '🍗',
    'Beef & Pork': '🥩',
    'Seafood': '🍤',
    'Beverages': '🥤',
  };
  return map[name] ?? '🍴';
}
