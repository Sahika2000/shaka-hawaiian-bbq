'use client';

import { create } from 'zustand';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/utils';
import styles from './CartDrawer.module.css';

// Tiny store for open/close state
interface DrawerStore {
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartDrawer = create<DrawerStore>((set) => ({
  isOpen: false,
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
}));

export function CartDrawer() {
  const { isOpen, closeCart } = useCartDrawer();
  const { items, removeItem, updateQuantity, totalCents, itemCount } = useCart();

  return (
    <>
      {isOpen && <div className={styles.backdrop} onClick={closeCart} />}
      <aside className={`${styles.drawer} ${isOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <h2>Your Order</h2>
          <button className={styles.closeBtn} onClick={closeCart} aria-label="Close cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🛒</span>
            <p>Your cart is empty</p>
            <button className="btn-primary" onClick={closeCart} style={{ marginTop: 16 }}>
              Browse Menu
            </button>
          </div>
        ) : (
          <>
            <div className={styles.items}>
              {items.map((item) => (
                <div key={item.id} className={styles.item}>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>{item.name}</span>
                    {item.selectedOption && (
                      <span className={styles.itemOption}>{item.selectedOption}</span>
                    )}
                    <span className={styles.itemPrice}>{formatPrice(item.unitPriceCents)}</span>
                  </div>
                  <div className={styles.itemControls}>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >−</button>
                    <span className={styles.qty}>{item.quantity}</span>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >+</button>
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeItem(item.id)}
                      aria-label="Remove item"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.footer}>
              <div className={styles.total}>
                <span>Total ({itemCount()} items)</span>
                <span className={styles.totalAmount}>{formatPrice(totalCents())}</span>
              </div>
              <Link href="/checkout" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={closeCart}>
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
