'use client';

import { OwnerGuard } from '@/components/OwnerGuard';
import { OwnerTabs } from '@/components/OwnerTabs';
import { useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabaseBrowser';
import { money } from '@/lib/products';
import { OrderStatus } from '@/lib/types';

type OrderRow = {
  id: string;
  customer_name: string;
  email: string;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
};

export default function OwnerOrdersPage() {
  return (
    <OwnerGuard>
      <OwnerOrders />
    </OwnerGuard>
  );
}

function OwnerOrders() {
  const supabase = getSupabaseBrowserClient();
  const [orders, setOrders] = useState<OrderRow[]>([]);

  useEffect(() => {
    supabase.from('orders').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setOrders(data as OrderRow[]);
    });
  }, [supabase]);

  return (
    <div className="space-y-6">
      <OwnerTabs />
      <section className="rounded-3xl border border-white/10 bg-black/70 p-6 shadow-soft">
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="mt-2 text-white/60">All orders and their current status.</p>
      </section>
      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="rounded-3xl border border-white/10 bg-black/70 p-5 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-lg font-semibold">{order.customer_name}</div>
                <div className="text-sm text-white/60">{order.email}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{money(Number(order.total_amount))}</div>
                <div className="text-sm text-white/60">{order.status.toUpperCase()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
