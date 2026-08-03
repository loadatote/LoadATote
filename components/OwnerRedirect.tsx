'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabaseBrowser';
import { ownerEmailsFromEnv } from '@/lib/owner';

export function OwnerRedirect() {
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getSession().then(({ data }) => {
      const email = data.session?.user.email?.toLowerCase() || '';
      if (ownerEmailsFromEnv().includes(email)) {
        router.replace('/owner');
      }
    });
  }, [router]);

  return null;
}
