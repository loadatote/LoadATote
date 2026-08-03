'use client';

import { useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabaseBrowser';
import { ownerEmailsFromEnv } from '@/lib/owner';

export function OwnerGuard({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getSession().then(({ data }) => {
      const email = data.session?.user.email?.toLowerCase() || '';
      setAllowed(ownerEmailsFromEnv().includes(email));
      setReady(true);
    });
  }, []);

  if (!ready) {
    return <div className="rounded-3xl border border-white/10 bg-black/60 p-6 text-white">Loading owner controls...</div>;
  }

  if (!allowed) {
    return (
      <div className="rounded-3xl border border-white/10 bg-black/60 p-6 text-white">
        <h2 className="text-xl font-semibold">Owner access only</h2>
        <p className="mt-2 text-sm text-white/70">Sign in with an email listed in OWNER_EMAILS.</p>
      </div>
    );
  }

  return <>{children}</>;
}
