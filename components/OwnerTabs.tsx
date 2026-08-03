'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const tabs = [
  { href: '/owner', label: 'Dashboard' },
  { href: '/owner/orders', label: 'Orders' },
  { href: '/owner/products', label: 'Products' },
  { href: '/owner/customers', label: 'Customers' },
  { href: '/owner/reports', label: 'Reports' }
];

export function OwnerTabs() {
  const pathname = usePathname();

  return (
    <nav className="rounded-3xl border border-white/10 bg-black/70 p-3 shadow-soft">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={clsx(
                'rounded-2xl px-6 py-4 text-center text-lg font-semibold transition',
                active ? 'bg-amber-400 text-black' : 'bg-white/5 text-white hover:bg-white/10'
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
