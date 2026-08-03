'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';

export function NavBar() {
  const { count } = useCart();

  return (
    <header className="border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Moving Tote Orders
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/">Catalog</Link>
          <Link href="/cart">Cart ({count})</Link>
          <Link href="/login" className="rounded-xl border px-3 py-2">
            Login
          </Link>
          <Link href="/admin" className="rounded-xl bg-slate-900 px-3 py-2 text-white">
            Owner
          </Link>
        </nav>
      </div>
    </header>
  );
}
