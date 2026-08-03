'use client';

import { useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabaseBrowser';
import { ownerEmailList } from '@/lib/owner';

export function OwnerGuard({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    supabase.auth.getUser().then(({ data }) => {
      const email = data.user?.email?.toLowerCase() || '';
      setAllowed(ownerEmailList().includes(email));
      setReady(true);
    });
  }, []);

  if (!ready) {
    return <div className="rounded-3xl border bg-white p-6 shadow-soft">Loading owner panel...</div>;
  }

  if (!allowed) {
    return (
      <div className="rounded-3xl border bg-white p-6 shadow-soft">
        <h2 className="text-xl font-semibold">Owner access only</h2>
        <p className="mt-2 text-sm text-slate-600">
          Sign in with an email listed in OWNER_EMAILS.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
