'use client';

import { useEffect, useState } from 'react';
import { OwnerGuard } from '@/components/OwnerGuard';
import { getSupabaseBrowserClient } from '@/lib/supabaseBrowser';
import { OrderRecord, ToteProduct } from '@/lib/types';
import { formatMoney, products } from '@/lib/mockProducts';

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

export default function AdminPage() {
  return (
    <OwnerGuard>
      <AdminDashboard />
    </OwnerGuard>
  );
}

function AdminDashboard() {
  const supabase = getSupabaseBrowserClient();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [catalog, setCatalog] = useState<ToteProduct[]>(products);
  const [message, setMessage] = useState('');

  useEffect(() => {
    Promise.all([
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('products').select('*').order('size', { ascending: true })
    ]).then(([ordersRes, productsRes]) => {
      if (ordersRes.data) setOrders(ordersRes.data as OrderRecord[]);
      if (productsRes.data && productsRes.data.length) {
        const rows = productsRes.data as ProductRow[];
        setCatalog(
          rows.map((row) => ({
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
          }))
        );
      }
    });
  }, [supabase]);

  async function authHeader() {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async function toggleOutOfStock(product: ToteProduct) {
    setMessage('Saving...');
    const headers = {
      'Content-Type': 'application/json',
      ...(await authHeader())
    };

    const res = await fetch('/api/admin/products', {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        id: product.id,
        is_out_of_stock: !product.isOutOfStock
      })
    });

    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || 'Update failed');
      return;
    }

    setCatalog((current) =>
      current.map((item) => (item.id === product.id ? { ...item, isOutOfStock: !product.isOutOfStock } : item))
    );
    setMessage('Updated.');
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-soft">
        <h1 className="text-3xl font-bold">Owner dashboard</h1>
        <p className="mt-2 text-slate-600">
          Adjust pricing, control stock, and work incoming orders from one place.
        </p>
      </div>

      <section className="rounded-3xl border bg-white p-6 shadow-soft">
        <h2 className="text-xl font-semibold">Inventory</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {catalog.map((product) => (
            <div key={product.id} className="rounded-2xl border p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold">{product.size}</div>
                  <div className="text-sm text-slate-500">{formatMoney(product.daily)} / day</div>
                </div>
                <button
                  className="rounded-2xl border px-3 py-2 text-sm font-semibold"
                  onClick={() => toggleOutOfStock(product)}
                  type="button"
                >
                  {product.isOutOfStock ? 'Mark in stock' : 'Mark out of stock'}
                </button>
              </div>
            </div>
          ))}
        </div>
        {message ? <p className="mt-3 text-sm text-slate-600">{message}</p> : null}
      </section>

      <section className="rounded-3xl border bg-white p-6 shadow-soft">
        <h2 className="text-xl font-semibold">Orders</h2>
        <div className="mt-4 space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="font-semibold">{order.customer_name}</div>
                  <div className="text-sm text-slate-500">{order.email}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatMoney(order.total_amount)}</div>
                  <div className="text-sm text-slate-500">{order.status}</div>
                </div>
              </div>
            </div>
          ))}
          {orders.length === 0 ? <p className="text-sm text-slate-500">No orders yet.</p> : null}
        </div>
      </section>
    </div>
  );
}
