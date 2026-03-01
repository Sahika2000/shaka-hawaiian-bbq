'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/utils';
import styles from './checkout.module.css';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalCents, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    phone: '',
    pickupTimeNote: '',
    specialInstructions: '',
  });

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>🛒</span>
        <h2>Your cart is empty</h2>
        <p>Add some items from our menu first!</p>
        <button className="btn-primary" onClick={() => router.push('/menu')}>
          Browse Menu
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({
            menuItemId: i.menuItemId,
            name: i.name,
            quantity: i.quantity,
            unitPriceCents: i.unitPriceCents,
            selectedOption: i.selectedOption,
            notes: i.notes,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong');

      // Redirect to Stripe Checkout
      clearCart();
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.inner}>
          {/* Form */}
          <div className={styles.formSection}>
            <h1>Checkout</h1>
            <p className={styles.subtitle}>Fill in your details, then proceed to secure payment.</p>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  id="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Jane Doe"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="214-555-0100"
                />
              </div>

              <div className="form-group">
                <label htmlFor="pickup">Pickup Time Note</label>
                <input
                  id="pickup"
                  type="text"
                  value={form.pickupTimeNote}
                  onChange={(e) => setForm({ ...form, pickupTimeNote: e.target.value })}
                  placeholder="e.g. ASAP, 12:30 PM, etc."
                />
              </div>

              <div className="form-group">
                <label htmlFor="instructions">Special Instructions (optional)</label>
                <textarea
                  id="instructions"
                  rows={3}
                  value={form.specialInstructions}
                  onChange={(e) => setForm({ ...form, specialInstructions: e.target.value })}
                  placeholder="Allergies, modifications, etc."
                />
              </div>

              {error && <div className={styles.error}>{error}</div>}

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? (
                  <><span className="spinner" /> Processing…</>
                ) : (
                  <>Pay {formatPrice(totalCents())} →</>
                )}
              </button>
            </form>
          </div>

          {/* Order summary */}
          <div className={styles.summary}>
            <h2>Order Summary</h2>
            <div className={styles.summaryItems}>
              {items.map((item) => (
                <div key={item.id} className={styles.summaryItem}>
                  <div className={styles.summaryItemLeft}>
                    <span className={styles.summaryQty}>{item.quantity}×</span>
                    <div>
                      <span className={styles.summaryName}>{item.name}</span>
                      {item.selectedOption && (
                        <span className={styles.summaryOption}>{item.selectedOption}</span>
                      )}
                    </div>
                  </div>
                  <span className={styles.summaryPrice}>
                    {formatPrice(item.unitPriceCents * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span className={styles.totalAmt}>{formatPrice(totalCents())}</span>
            </div>
            <p className={styles.pickupNote}>
              📍 Pickup: 5733 TX-121 #290, The Colony, TX
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
