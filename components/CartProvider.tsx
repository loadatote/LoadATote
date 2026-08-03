'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { clearCart, loadCart, saveCart } from '@/lib/cart';
import { CartItem } from '@/lib/types';

type CartCtx = {
  items: CartItem[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  count: number;
};

const CartContext = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveCart(items);
  }, [items, hydrated]);

  const value = useMemo<CartCtx>(() => ({
    items,
    addItem(productId) {
      setItems((current) => {
        const existing = current.find((item) => item.productId === productId);
        if (existing) {
          return current.map((item) => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item);
        }
        return [...current, { productId, quantity: 1 }];
      });
    },
    removeItem(productId) {
      setItems((current) => current.filter((item) => item.productId !== productId));
    },
    setQuantity(productId, quantity) {
      setItems((current) =>
        current
          .map((item) => item.productId === productId ? { ...item, quantity } : item)
          .filter((item) => item.quantity > 0)
      );
    },
    clear() {
      setItems([]);
      clearCart();
    },
    count: items.reduce((sum, item) => sum + item.quantity, 0)
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
