'use client';

import { useEffect, useMemo, useState } from 'react';
import { products as fallbackProducts, formatMoney } from '@/lib/mockProducts';
import { PricingWindow, ToteProduct } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';
import { getSupabaseBrowserClient } from '@/lib/supabaseBrowser';

type ProductRow = {
  id: string;
  name: string;
  size: string;
  description: string;
  image_url: string;
  daily: number;
  three_day: number;
  seven_day: number;
  fourteen_day: number;
  thirty_day: number;
  sixty_day: number;
  is_out_of_stock: boolean;
};

const toProduct = (row: ProductRow): ToteProduct => ({
  id: row.id,
  name: row.name,
  size: row.size,
  description: row.description,
  image: row.image_url,
  daily: Number(row.daily),
  threeDay: Number(row.three_day),
  sevenDay: Number(row.seven_day),
  fourteenDay: Number(row.fourteen_day),
  thirtyDay: Number(row.thirty_day),
  sixtyDay: Number(row.sixty_day),
  isOutOfStock: row.is_out_of_stock
});

export default function HomePage() {
  const [window, setWindow] = useState<PricingWindow>('7d');
  const [catalog, setCatalog] = useState<ToteProduct[]>(fallbackProducts);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const supabase = getSupabaseBrowserClient();
  let cancelled = false;

  async function loadCatalog() {
    try {
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('size', { ascending: true });

      if (!cancelled && data && data.length) {
        setCatalog((data as ProductRow[]).map(toProduct));
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  }

  loadCatalog();

  return () => {
    cancelled = true;
  };
}, []);

  const available = useMemo(() => catalog.filter((product) => !product.isOutOfStock), [catalog]);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Moving tote rentals and sales</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Order totes, track fulfillment, and notify customers from one dashboard.</h1>
        <p className="mt-4 max-w-3xl text-slate-600">
          Customers can build a cart, choose email or SMS order updates, and enter billing and delivery details. Owners can adjust pricing, mark inventory out of stock, and manage live order status.
        </p>
      </section>

      <section className="rounded-3xl border bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Catalog</h2>
            <p className="text-sm text-slate-600">Choose a rental window to update all product pricing.</p>
          </div>
          <select className="w-full rounded-2xl border px-4 py-3 md:w-56" value={window} onChange={(e) => setWindow(e.target.value as PricingWindow)}>
            <option value="1d">1 Day</option>
            <option value="3d">3 Days</option>
            <option value="7d">1 Week</option>
            <option value="14d">2 Weeks</option>
            <option value="30d">1 Month</option>
            <option value="60d">2 Months</option>
          </select>
        </div>

        {loading ? <p className="mt-4 text-sm text-slate-500">Loading catalog...</p> : null}

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {available.map((product) => (
            <ProductCard key={product.id} product={product} rentalWindow={window} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border bg-white p-6 shadow-soft">
          <h3 className="font-semibold">Owner controls</h3>
          <p className="mt-2 text-sm text-slate-600">Change pricing, toggle stock status, and update order stages.</p>
        </div>
        <div className="rounded-3xl border bg-white p-6 shadow-soft">
          <h3 className="font-semibold">Checkout flow</h3>
          <p className="mt-2 text-sm text-slate-600">Collect billing details, delivery instructions, and message preference.</p>
        </div>
        <div className="rounded-3xl border bg-white p-6 shadow-soft">
          <h3 className="font-semibold">Notifications</h3>
          <p className="mt-2 text-sm text-slate-600">Store notifications in-app and optionally enable SMTP or Twilio later.</p>
        </div>
      </section>
    </div>
  );
}
