import { createClient } from '@supabase/supabase-js';
import { ownerEmailList } from './owner';

export function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !service) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }

  return createClient(url, service, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export function ownerEmails() {
  return ownerEmailList();
}
