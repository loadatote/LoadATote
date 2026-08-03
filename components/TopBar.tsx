'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabaseBrowser';
import { ownerEmailsFromEnv } from '@/lib/owner';
import { useCart } from './CartProvider';

export function TopBar() {
  const { count } = useCart();
  const [owner, setOwner] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    supabase.auth.getSession().then(({ data }) => {
      const email = data.session?.user.email?.toLowerCase() || '';
      const isOwner = ownerEmailsFromEnv().includes(email);
      setOwner(isOwner);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_, session) => {
      const email = session?.user.email?.toLowerCase() || '';
      const isOwner = ownerEmailsFromEnv().includes(email);
      setOwner(isOwner);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between gap-4 py-3">
          <Link href="/products" className="flex items-center gap-3">
            <Image src="/logo.png" alt="Load A Tote logo" width={48} height={48} className="h-12 w-12 rounded-full ring-2 ring-amber-400/70" />
            <div>
              <div className="text-sm font-semibold text-white">Load A Tote</div>
              <div className="text-xs text-amber-300">Moving Solutions</div>
            </div>
          </Link>

          <nav className="flex items-center gap-3 text-sm text-white/90">
            <Link href="/products" className="rounded-full px-4 py-3 text-base font-semibold hover:bg-white/10">
              Products
            </Link>
            <Link href="/cart" className="rounded-full px-4 py-3 text-base font-semibold hover:bg-white/10">
              Cart ({count})
            </Link>
            <Link href="/login" className="rounded-full px-4 py-3 text-base font-semibold hover:bg-white/10">
              Login
            </Link>
            {owner ? (
              <Link href="/owner" className="rounded-full bg-amber-400 px-5 py-3 text-base font-semibold text-black">
                Owner
              </Link>
            ) : null}
          </nav>
        </div>
        <Image
          src="/banner-top.png"
          alt="Load A Tote banner"
          width={1536}
          height={185}
          className="h-[120px] w-full rounded-b-3xl object-cover shadow-soft md:h-[185px]"
          priority
        />
      </div>
    </header>
  );
}
