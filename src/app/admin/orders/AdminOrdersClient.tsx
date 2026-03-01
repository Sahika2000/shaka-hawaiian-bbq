'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import tableStyles from '../admin.module.css';
import styles from './orders.module.css';

type Order = {
  id: string;
  status: string;
  totalCents: number;
  pickupTimeNote: string | null;
  specialInstructions: string | null;
  createdAt: string | Date;
  customer: { name: string; phone: string };
  items: Array<{ id: string; name: string; quantity: number; unitPriceCents: number; selectedOption: string | null }>;
};

const STATUSES = ['pending', 'paid', 'ready', 'completed', 'cancelled'];

export function AdminOrdersClient({ orders: initial }: { orders: Order[] }) {
  const router = useRouter();
  const [orders, setOrders] = useState(initial);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const updateStatus = async (orderId: string, status: string) => {
    setUpdating(orderId);
    const res = await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status }),
    });
    if (res.ok) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
    }
    setUpdating(null);
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1>Orders</h1>
        <button className="btn-secondary" onClick={() => router.refresh()} style={{ fontSize: '0.9rem', padding: '8px 16px' }}>
          🔄 Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', marginTop: 24 }}>No orders yet.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Pickup Note</th>
                <th>Status</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr
                    style={{ cursor: 'pointer' }}
                    onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                  >
                    <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      {order.id.split('-')[0].toUpperCase()}
                    </td>
                    <td style={{ whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td>
                      <strong>{order.customer.name}</strong>
                      <br />
                      <a href={`tel:${order.customer.phone}`} style={{ color: 'var(--ocean)', fontSize: '0.85rem' }}>
                        {order.customer.phone}
                      </a>
                    </td>
                    <td><strong>{formatPrice(order.totalCents)}</strong></td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {order.pickupTimeNote ?? '—'}
                    </td>
                    <td>
                      <span className={`${tableStyles.statusBadge} ${tableStyles[order.status as keyof typeof tableStyles]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <select
                        value={order.status}
                        disabled={updating === order.id}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={styles.statusSelect}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                  {expanded === order.id && (
                    <tr className={styles.expandedRow}>
                      <td colSpan={7}>
                        <div className={styles.orderDetails}>
                          <strong>Items:</strong>
                          <ul>
                            {order.items.map((item) => (
                              <li key={item.id}>
                                {item.quantity}× {item.name}
                                {item.selectedOption ? ` (${item.selectedOption})` : ''}
                                {' — '}{formatPrice(item.unitPriceCents * item.quantity)}
                              </li>
                            ))}
                          </ul>
                          {order.specialInstructions && (
                            <p><strong>Special Instructions:</strong> {order.specialInstructions}</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
