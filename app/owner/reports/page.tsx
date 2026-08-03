'use client';

import { OwnerGuard } from '@/components/OwnerGuard';
import { OwnerTabs } from '@/components/OwnerTabs';
import { useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabaseBrowser';
import { money } from '@/lib/products';
import { OrderStatus } from '@/lib/types';

type OrderRow = {
  status: OrderStatus;
  total_amount: number;
};

export default function OwnerReportsPage() {
  return (
    <OwnerGuard>
      <OwnerReports />
    </OwnerGuard>
  );
}

function OwnerReports() {
  const supabase = getSupabaseBrowserClient();
  const [orders, setOrders] = useState<OrderRow[]>([]);

  useEffect(() => {
    supabase.from('orders').select('status,total_amount').then(({ data }) => {
      if (data) setOrders(data as OrderRow[]);
    });
  }, [supabase]);

  const revenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
  const readyCount = orders.filter((o) => o.status === 'ready').length;
  const openCount = orders.filter((o) => o.status === 'new' || o.status === 'processing').length;

  return (
    <div className="space-y-6">
      <OwnerTabs />
      <div className="rounded-3xl border border-white/10 bg-black/70 p-6 shadow-soft">
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="mt-2 text-white/60">Quick totals for the current order flow.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-black/70 p-5 shadow-soft">
          <div className="text-sm text-white/60">Revenue</div>
          <div className="mt-2 text-2xl font-bold">{money(revenue)}</div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-black/70 p-5 shadow-soft">
          <div className="text-sm text-white/60">Ready</div>
          <div className="mt-2 text-2xl font-bold">{readyCount}</div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-black/70 p-5 shadow-soft">
          <div className="text-sm text-white/60">Open</div>
          <div className="mt-2 text-2xl font-bold">{openCount}</div>
        </div>
      </div>
    </div>
  );
}
