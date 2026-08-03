'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabaseBrowser';
import { money } from '@/lib/products';
import { OrderStatus } from '@/lib/types';
import { ownerEmailsFromEnv } from '@/lib/owner';

type Order = {
  id: string;
  customer_name: string;
  email: string;
  phone: string | null;
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

type Item = {
  product_name: string;
  product_size: string;
  quantity: number;
  unit_price: number;
};

export default function OrderPage() {
  const params = useParams<{ id: string }>();
  const supabase = getSupabaseBrowserClient();
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [status, setStatus] = useState<OrderStatus>('new');
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: session } = await supabase.auth.getSession();
      const email = session.session?.user.email?.toLowerCase() || '';
      setIsOwner(ownerEmailsFromEnv().includes(email));

      const [orderRes, itemsRes] = await Promise.all([
        supabase.from('orders').select('*').eq('id', params.id).single(),
        supabase.from('order_items').select('*').eq('order_id', params.id).order('created_at', { ascending: true })
      ]);

      if (orderRes.data) {
        setOrder(orderRes.data as Order);
        setStatus((orderRes.data as Order).status);
      }

      if (itemsRes.data) {
        setItems(itemsRes.data as Item[]);
      }

      setLoading(false);
    }

    load();
  }, [params.id]);

  async function updateStatus() {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    const response = await fetch(`/api/orders/${params.id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ status })
    });

    if (response.ok) {
      const { data } = await response.json();
      if (data) setOrder(data);
    }
  }

  const subtotal = items.reduce((sum, item) => sum + Number(item.unit_price) * item.quantity, 0);

  if (loading) {
    return <div className="rounded-3xl border border-white/10 bg-black/70 p-6 shadow-soft">Loading order...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-black/70 p-6 shadow-soft">
        <h1 className="text-3xl font-bold">Bill of Sale</h1>
        <p className="mt-2 text-white/60">Order #{order?.id || params.id}</p>
      </div>

      {order ? (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-4 rounded-3xl border border-white/10 bg-black/70 p-6 shadow-soft">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="font-semibold">Customer Information</div>
              <div className="mt-3 space-y-1 text-sm text-white/70">
                <div><span className="text-white/45">Name:</span> {order.customer_name}</div>
                <div><span className="text-white/45">Email:</span> {order.email}</div>
                <div><span className="text-white/45">Phone:</span> {order.phone || '—'}</div>
                <div><span className="text-white/45">Billing:</span> {order.billing_name}</div>
                <div><span className="text-white/45">Address:</span> {order.billing_address}, {order.billing_city}, {order.billing_state} {order.billing_zip}</div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="font-semibold">Delivery Instructions</div>
              <p className="mt-3 text-sm text-white/70">{order.delivery_instructions || 'None provided'}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="font-semibold">Order Items</div>
              <div className="mt-3 space-y-2">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div>
                      <div className="font-medium">{item.product_size}</div>
                      <div className="text-white/50">{item.product_name}</div>
                    </div>
                    <div className="text-white/75">
                      Qty {item.quantity} • {money(Number(item.unit_price) * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-4 rounded-3xl border border-white/10 bg-black/70 p-6 shadow-soft">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="font-semibold">Totals</div>
              <div className="mt-3 space-y-2 text-sm text-white/70">
                <div className="flex justify-between"><span>Subtotal</span><span>{money(subtotal)}</span></div>
                <div className="flex justify-between"><span>Total</span><span>{money(Number(order.total_amount))}</span></div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="font-semibold">Status</div>
              <p className="mt-2 text-sm text-white/70">{order.status}</p>
            </div>

            {isOwner ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="font-semibold">Update order status</div>
                <select className="mt-3 rounded-2xl border border-white/10 bg-black px-4 py-3" value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)}>
                  <option value="new">new</option>
                  <option value="processing">processing</option>
                  <option value="ready">ready</option>
                  <option value="completed">completed</option>
                  <option value="cancelled">cancelled</option>
                </select>
                <button onClick={updateStatus} type="button" className="mt-3 w-full rounded-2xl bg-amber-400 px-4 py-3 font-semibold text-black">
                  Save status
                </button>
              </div>
            ) : null}
          </aside>
        </div>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-black/70 p-6 shadow-soft">Order not found.</div>
      )}
    </div>
  );
}
