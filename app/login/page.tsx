'use client';

import { AuthButtons } from '@/components/AuthButtons';

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Login or create an account</h1>
        <p className="mt-2 text-slate-600">Customers and owners can both sign in through Supabase Auth.</p>
      </div>
      <AuthButtons />
    </div>
  );
}
