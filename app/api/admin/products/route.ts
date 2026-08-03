import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient, ownerEmails } from '@/lib/supabaseServer';

export async function PATCH(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization');
    const token = auth?.startsWith('Bearer ') ? auth.slice(7) : '';
    if (!token) {
      return NextResponse.json({ error: 'Missing bearer token' }, { status: 401 });
    }

    const supabase = getServiceClient();
    const { data: userData, error: userError } = await supabase.auth.getUser(token);

    if (userError || !userData.user?.email) {
      return NextResponse.json({ error: 'Unable to verify user' }, { status: 401 });
    }

    const email = userData.user.email.toLowerCase();
    if (!ownerEmails().includes(email)) {
      return NextResponse.json({ error: 'Owner access only' }, { status: 403 });
    }

    const body = await req.json();
    const { data, error } = await supabase
      .from('products')
      .update({
        is_out_of_stock: Boolean(body.is_out_of_stock)
      })
      .eq('id', body.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, product: data });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
