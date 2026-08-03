'use client';

import { AuthPanel } from '@/components/AuthPanel';
import { OwnerRedirect } from '@/components/OwnerRedirect';

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <OwnerRedirect />
      <div className="rounded-3xl border border-white/10 bg-black/70 p-6 shadow-soft">
        <h1 className="text-3xl font-bold">Login or create an account</h1>
        <p className="mt-2 text-white/70">Customers and owners sign in here.</p>
      </div>
      <AuthPanel />
    </div>
  );
}
