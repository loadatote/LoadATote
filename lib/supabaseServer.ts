import { createClient } from '@supabase/supabase-js';
import { ownerEmailsFromEnv } from './owner';

export function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !service) {
    throw new Error('Missing Supabase server env vars');
  }

  return createClient(url, service, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// Backward-compatible aliases so older imports keep working.
export const getServiceClient = getSupabaseServerClient;
export const ownerEmails = ownerEmailsFromEnv;
