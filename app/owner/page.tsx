'use client';

import { useEffect, useState } from 'react';
import { OwnerGuard } from '@/components/OwnerGuard';
import { getSupabaseBrowserClient } from '@/lib/supabaseBrowser';
import { money } from '@/lib/products';
import { OrderStatus } from '@/lib/types';
import Link from 'next/link';

type OrderRow = {
  id: string;
  customer_name: string;
  email: string;
  phone: string | null;
  notify_method: string | null;
  billing_name: string;
  billing_address: string;
  billing_city: string;
  billing_state: string;
  billing_zip: string;
  delivery_instructions: string | null;
  rental_window: string;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
};

export default function OwnerPage() {
  return (
    <OwnerGuard>
      <OwnerDashboard />
    </OwnerGuard>
  );
}

function OwnerDashboard() {
  const supabase = getSupabaseBrowserClient();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [status, setStatus] = useState<OrderStatus>('new');

  async function loadOrders() {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (data) {
      setOrders(data as OrderRow[]);
      setSelectedId((current) => current || (data[0]?.id ?? ''));
      const selected = (data as OrderRow[]).find((order) => order.id === (selectedId || data[0]?.id));
      if (selected) setStatus(selected.status);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const selected = orders.find((order) => order.id === selectedId) || orders[0];

  async function updateStatus(id: string) {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    await fetch(`/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ status })
    });

    await loadOrders();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-3xl border border-white/10 bg-black/70 p-6 shadow-soft">
        <h1 className="text-3xl font-bold">Owner controls</h1>
        <p className="mt-2 text-white/60">View and update order status from here.</p>

        <div className="mt-5 space-y-3">
          {orders.map((order) => (
            <button
              key={order.id}
              type="button"
              onClick={() => {
                setSelectedId(order.id);
                setStatus(order.status);
              }}
              className={`w-full rounded-2xl border px-4 py-3 text-left ${selected?.id === order.id ? 'border-amber-400 bg-amber-400/10' : 'border-white/10 bg-white/5'}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">{order.customer_name}</span>
                <span>{money(Number(order.total_amount))}</span>
              </div>
              <div className="text-sm text-white/55">{order.status.toUpperCase()}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        {selected ? (
          <div className="rounded-3xl border border-white/10 bg-black/70 p-6 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Bill of Sale</h2>
                <p className="text-white/60">Order ID: {selected.id}</p>
              </div>
              <Link href={`/orders/${selected.id}`} className="rounded-2xl bg-amber-400 px-4 py-3 font-semibold text-black">
                Open order
              </Link>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="font-semibold">Customer Information</div>
                <div className="mt-3 space-y-1 text-sm text-white/70">
                  <div><span className="text-white/45">Name:</span> {selected.customer_name}</div>
                  <div><span className="text-white/45">Email:</span> {selected.email}</div>
                  <div><span className="text-white/45">Phone:</span> {selected.phone || '—'}</div>
                  <div><span className="text-white/45">Billing:</span> {selected.billing_name}</div>
                  <div><span className="text-white/45">Address:</span> {selected.billing_address}, {selected.billing_city}, {selected.billing_state} {selected.billing_zip}</div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="font-semibold">Order Details</div>
                <div className="mt-3 space-y-1 text-sm text-white/70">
                  <div><span className="text-white/45">Rental window:</span> {selected.rental_window}</div>
                  <div><span className="text-white/45">Total:</span> {money(Number(selected.total_amount))}</div>
                  <div><span className="text-white/45">Created:</span> {new Date(selected.created_at).toLocaleString()}</div>
                  <div><span className="text-white/45">Notes:</span> {selected.delivery_instructions || 'None'}</div>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="font-semibold">Update order status</div>
              <select className="mt-3 rounded-2xl border border-white/10 bg-black px-4 py-3" value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)}>
                <option value="new">new</option>
                <option value="processing">processing</option>
                <option value="ready">ready</option>
                <option value="completed">completed</option>
                <option value="cancelled">cancelled</option>
              </select>
              <button onClick={() => updateStatus(selected.id)} type="button" className="mt-3 w-full rounded-2xl bg-amber-400 px-4 py-3 font-semibold text-black">
                Save status
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-black/70 p-6 shadow-soft">No orders yet.</div>
        )}
      </section>
    </div>
  );
}
