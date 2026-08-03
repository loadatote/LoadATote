'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabaseBrowser';
import { ownerEmailsFromEnv } from '@/lib/owner';
import { useCart } from './CartProvider';

export function TopBar() {
  const { count } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [owner, setOwner] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    supabase.auth.getSession().then(({ data }) => {
      const email = data.session?.user.email?.toLowerCase() || '';
      const isOwner = ownerEmailsFromEnv().includes(email);
      setOwner(isOwner);

      if (isOwner && (pathname === '/' || pathname === '/login')) {
        router.replace('/owner');
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_, session) => {
      const email = session?.user.email?.toLowerCase() || '';
      const isOwner = ownerEmailsFromEnv().includes(email);
      setOwner(isOwner);

      if (isOwner && (pathname === '/' || pathname === '/login')) {
        router.replace('/owner');
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [pathname, router]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between gap-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="Load A Tote logo" width={48} height={48} className="h-12 w-12 rounded-full ring-2 ring-amber-400/70" />
            <div>
              <div className="text-sm font-semibold text-white">Load A Tote</div>
              <div className="text-xs text-amber-300">Moving Solutions</div>
            </div>
          </Link>

          <nav className="flex items-center gap-3 text-sm text-white/90">
            <Link href="/" className="rounded-full px-3 py-2 hover:bg-white/10">Catalog</Link>
            <Link href="/cart" className="rounded-full px-3 py-2 hover:bg-white/10">Cart ({count})</Link>
            {owner ? (
              <Link href="/owner" className="rounded-full bg-amber-400 px-4 py-2 font-semibold text-black">
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
