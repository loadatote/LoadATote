import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabaseServer';
import { ownerEmailsFromEnv } from '@/lib/owner';
import { OrderStatus } from '@/lib/types';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '') || '';
    const supabase = getSupabaseServerClient();

    if (!token) {
      return NextResponse.json({ error: 'Missing auth token' }, { status: 401 });
    }

    const { data: userData, error: userError } = await supabase.auth.getUser(token);

    if (userError || !userData.user?.email) {
      return NextResponse.json({ error: 'Unable to verify user' }, { status: 401 });
    }

    const email = userData.user.email.toLowerCase();
    if (!ownerEmailsFromEnv().includes(email)) {
      return NextResponse.json({ error: 'Owner access only' }, { status: 403 });
    }

    const body = await req.json() as { status: OrderStatus };
    const { id } = params;

    const { data, error } = await supabase
      .from('orders')
      .update({ status: body.status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
