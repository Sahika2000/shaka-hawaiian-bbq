'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // unique cart line id
  menuItemId: string;
  name: string;
  unitPriceCents: number;
  quantity: number;
  selectedOption?: string;
  notes?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalCents: () => number;
  itemCount: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const id = `${item.menuItemId}-${item.selectedOption ?? ''}-${Date.now()}`;
        set((s) => ({ items: [...s.items, { ...item, id }] }));
      },
      removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
        } else {
          set((s) => ({
            items: s.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
          }));
        }
      },
      clearCart: () => set({ items: [] }),
      totalCents: () => get().items.reduce((sum, i) => sum + i.unitPriceCents * i.quantity, 0),
      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'shaka-cart' }
  )
);
