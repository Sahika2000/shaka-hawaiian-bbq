'use client';

import { useState } from 'react';
import tableStyles from '../admin.module.css';
import styles from './menu.module.css';
import type { MenuCategory, MenuItem } from '@prisma/client';

type CategoryWithItems = MenuCategory & { items: MenuItem[] };

export function AdminMenuClient({ categories: initial }: { categories: CategoryWithItems[] }) {
  const [categories, setCategories] = useState(initial);
  const [saving, setSaving] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, { name: string; basePrice: string; description: string }>>({});

  const startEdit = (item: MenuItem) => {
    setEditing(item.id);
    setEditValues((prev) => ({
      ...prev,
      [item.id]: {
        name: item.name,
        basePrice: String(item.basePrice),
        description: item.description ?? '',
      },
    }));
  };

  const saveEdit = async (itemId: string) => {
    setSaving(itemId);
    const vals = editValues[itemId];
    const res = await fetch('/api/admin/menu', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemId,
        name: vals.name,
        basePrice: parseFloat(vals.basePrice),
        description: vals.description || null,
      }),
    });
    if (res.ok) {
      const updated = await res.json();
      setCategories((prev) =>
        prev.map((cat) => ({
          ...cat,
          items: cat.items.map((item) => (item.id === itemId ? { ...item, ...updated } : item)),
        }))
      );
      setEditing(null);
    }
    setSaving(null);
  };

  const toggleAvailable = async (itemId: string, current: boolean) => {
    setSaving(itemId);
    const res = await fetch('/api/admin/menu', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, available: !current }),
    });
    if (res.ok) {
      setCategories((prev) =>
        prev.map((cat) => ({
          ...cat,
          items: cat.items.map((item) =>
            item.id === itemId ? { ...item, available: !current } : item
          ),
        }))
      );
    }
    setSaving(null);
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Menu Management</h1>

      {categories.map((cat) => (
        <div key={cat.id} className={styles.categorySection}>
          <h2 className={styles.categoryTitle}>{cat.name}</h2>
          <div className={styles.tableWrap}>
            <table className={tableStyles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th>Available</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cat.items.map((item) =>
                  editing === item.id ? (
                    <tr key={item.id} className={styles.editingRow}>
                      <td>
                        <input
                          type="text"
                          value={editValues[item.id]?.name ?? item.name}
                          onChange={(e) =>
                            setEditValues((prev) => ({
                              ...prev,
                              [item.id]: { ...prev[item.id], name: e.target.value },
                            }))
                          }
                          className={styles.editInput}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          value={editValues[item.id]?.basePrice ?? item.basePrice}
                          onChange={(e) =>
                            setEditValues((prev) => ({
                              ...prev,
                              [item.id]: { ...prev[item.id], basePrice: e.target.value },
                            }))
                          }
                          className={styles.editInput}
                          style={{ width: 90 }}
                        />
                      </td>
                      <td>
                        <textarea
                          value={editValues[item.id]?.description ?? item.description ?? ''}
                          onChange={(e) =>
                            setEditValues((prev) => ({
                              ...prev,
                              [item.id]: { ...prev[item.id], description: e.target.value },
                            }))
                          }
                          className={styles.editInput}
                          rows={2}
                        />
                      </td>
                      <td>
                        <span style={{ color: item.available ? 'var(--palm)' : 'var(--coral)', fontWeight: 700 }}>
                          {item.available ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionBtns}>
                          <button
                            className={styles.saveBtn}
                            onClick={() => saveEdit(item.id)}
                            disabled={saving === item.id}
                          >
                            {saving === item.id ? '…' : 'Save'}
                          </button>
                          <button className={styles.cancelBtn} onClick={() => setEditing(null)}>
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr key={item.id} style={{ opacity: item.available ? 1 : 0.5 }}>
                      <td><strong>{item.name}</strong></td>
                      <td>${Number(item.basePrice).toFixed(2)}</td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: 300 }}>
                        {item.description ?? <em>—</em>}
                      </td>
                      <td>
                        <button
                          className={item.available ? styles.availableBtn : styles.unavailableBtn}
                          onClick={() => toggleAvailable(item.id, item.available)}
                          disabled={saving === item.id}
                        >
                          {item.available ? '✓ Available' : '✗ Hidden'}
                        </button>
                      </td>
                      <td>
                        <button className={styles.editBtn} onClick={() => startEdit(item)}>
                          Edit
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
