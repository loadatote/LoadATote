'use client';

import { OwnerGuard } from '@/components/OwnerGuard';
import { OwnerTabs } from '@/components/OwnerTabs';
import { useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabaseBrowser';

type CustomerRow = {
  customer_name: string;
  email: string;
};

export default function OwnerCustomersPage() {
  return (
    <OwnerGuard>
      <OwnerCustomers />
    </OwnerGuard>
  );
}

function OwnerCustomers() {
  const supabase = getSupabaseBrowserClient();
  const [customers, setCustomers] = useState<CustomerRow[]>([]);

  useEffect(() => {
    supabase.from('orders').select('customer_name,email').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setCustomers(data as CustomerRow[]);
    });
  }, [supabase]);

  return (
    <div className="space-y-6">
      <OwnerTabs />
      <div className="rounded-3xl border border-white/10 bg-black/70 p-6 shadow-soft">
        <h1 className="text-3xl font-bold">Customers</h1>
        <p className="mt-2 text-white/60">People who have placed orders.</p>
      </div>

      <div className="space-y-3">
        {customers.map((customer, index) => (
          <div key={`${customer.email}-${index}`} className="rounded-3xl border border-white/10 bg-black/70 p-5 shadow-soft">
            <div className="font-semibold">{customer.customer_name}</div>
            <div className="text-sm text-white/60">{customer.email}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
