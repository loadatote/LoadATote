'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabaseBrowser';
import { ownerEmailsFromEnv } from '@/lib/owner';

export function AuthPanel() {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage(error.message);
      return;
    }

    const isOwner = ownerEmailsFromEnv().includes(email.trim().toLowerCase());
    setMessage(isOwner ? 'Owner signed in.' : 'Signed in.');

    if (isOwner) {
      router.push('/owner');
    }
  }

  async function signUp() {
    const { error } = await supabase.auth.signUp({ email, password });
    setMessage(error ? error.message : 'Account created. Check email if confirmation is on.');
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-black/70 p-6 text-white shadow-soft">
      <div className="grid gap-3 md:grid-cols-2">
        <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button onClick={signIn} type="button" className="rounded-2xl bg-amber-400 px-4 py-3 font-semibold text-black">Sign in</button>
        <button onClick={signUp} type="button" className="rounded-2xl border border-white/10 px-4 py-3 font-semibold text-white">Create account</button>
      </div>
      {message ? <p className="mt-3 text-sm text-white/70">{message}</p> : null}
    </div>
  );
}
