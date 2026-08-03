'use client';

import { AuthPanel } from '@/components/AuthPanel';

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="rounded-3xl border border-white/10 bg-black/70 p-6 shadow-soft">
        <h1 className="text-3xl font-bold">Login or create an account</h1>
        <p className="mt-2 text-white/70">Customers can create an account here. Owners should sign in to access the dashboard.</p>
      </div>
      <AuthPanel />
    </div>
  );
}
