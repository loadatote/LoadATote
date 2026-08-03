'use client';

import { useMemo, useState } from 'react';
import { products } from '@/lib/products';
import { PricingWindow } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';

export default function ProductsPage() {
  const [window, setWindow] = useState<PricingWindow>('7d');
  const available = useMemo(() => products.filter((product) => !product.isOutOfStock), []);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/10 bg-black/70 p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">Moving tote rentals and sales</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">Order totes, manage stock, and keep every sale in one place.</h1>
        <p className="mt-4 max-w-3xl text-white/70">
          Customers can build a cart, enter billing and delivery details, and choose how they want updates. Owners can log in, update inventory and order status, and view bills of sale.
        </p>
      </section>

      <section className="rounded-3xl border border-white/10 bg-black/70 p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Products</h2>
            <p className="text-sm text-white/60">Choose a rental window to update pricing.</p>
          </div>
          <select
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 md:w-56"
            value={window}
            onChange={(e) => setWindow(e.target.value as PricingWindow)}
          >
            <option value="1d">1 Day</option>
            <option value="7d">7 Days</option>
            <option value="14d">14 Days</option>
            <option value="30d">30 Days</option>
            <option value="60d">60 Days</option>
          </select>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {available.map((product) => (
            <ProductCard key={product.id} product={product} window={window} />
          ))}
        </div>
      </section>
    </div>
  );
}
