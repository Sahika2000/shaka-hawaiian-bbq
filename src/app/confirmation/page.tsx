import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import styles from './confirmation.module.css';

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id;

  if (!sessionId) {
    return (
      <div className={styles.error}>
        <h2>No order found</h2>
        <Link href="/" className="btn-primary">Go Home</Link>
      </div>
    );
  }

  const order = await prisma.order.findUnique({
    where: { stripeSessionId: sessionId },
    include: {
      customer: true,
      items: true,
    },
  });

  if (!order) {
    return (
      <div className={styles.error}>
        <h2>Order not found</h2>
        <p>Your payment may still be processing. Please call us if you have questions.</p>
        <a href="tel:2146182627" className="btn-primary">Call 214-618-2627</a>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.successIcon}>✅</div>
          <h1>Order Confirmed!</h1>
          <p className={styles.subtitle}>
            Thank you, <strong>{order.customer.name}</strong>! We&apos;ve received your order.
          </p>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span>Order #{order.id.split('-')[0].toUpperCase()}</span>
              <span className={`${styles.status} ${styles[order.status]}`}>
                {order.status.toUpperCase()}
              </span>
            </div>

            <div className={styles.orderItems}>
              {order.items.map((item) => (
                <div key={item.id} className={styles.orderItem}>
                  <div>
                    <span className={styles.itemQty}>{item.quantity}×</span>
                    <span className={styles.itemName}>{item.name}</span>
                    {item.selectedOption && (
                      <span className={styles.itemOption}> — {item.selectedOption}</span>
                    )}
                  </div>
                  <span>{formatPrice(item.unitPriceCents * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className={styles.total}>
              <span>Total Paid</span>
              <span className={styles.totalAmt}>{formatPrice(order.totalCents)}</span>
            </div>

            {order.pickupTimeNote && (
              <div className={styles.pickup}>
                <strong>Pickup Time:</strong> {order.pickupTimeNote}
              </div>
            )}
          </div>

          <div className={styles.location}>
            <p>📍 Pick up at: <strong>5733 TX-121 #290, The Colony, TX 75056</strong></p>
            <p>📞 Questions? Call <a href="tel:2146182627">214-618-2627</a></p>
          </div>

          <div className={styles.actions}>
            <Link href="/menu" className="btn-primary">Order Again</Link>
            <Link href="/" className="btn-secondary">Go Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
