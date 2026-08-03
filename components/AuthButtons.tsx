'use client';

import { useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabaseBrowser';

export function AuthButtons() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const supabase = getSupabaseBrowserClient();

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setMessage(error ? error.message : 'Signed in');
  }

  async function signUp() {
    const { error } = await supabase.auth.signUp({ email, password });
    setMessage(error ? error.message : 'Account created. Check your email to confirm.');
  }

  return (
    <div className="space-y-4 rounded-3xl border bg-white p-6 shadow-soft">
      <div className="grid gap-3 md:grid-cols-2">
        <input className="rounded-2xl border px-4 py-3" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="rounded-2xl border px-4 py-3" placeholder="Password" value={password} type="password" onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className="flex flex-wrap gap-3">
        <button className="rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white" onClick={signIn} type="button">
          Sign in
        </button>
        <button className="rounded-2xl border px-4 py-3 font-semibold" onClick={signUp} type="button">
          Create account
        </button>
      </div>
      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
    </div>
  );
}
