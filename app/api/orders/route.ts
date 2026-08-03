import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabaseServer';
import { products, getPrice } from '@/lib/products';
import { CartItem, PricingWindow } from '@/lib/types';

type CheckoutPayload = {
  customerName: string;
  email: string;
  phone: string;
  notifyMethod: 'email' | 'sms';
  billingName: string;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingZip: string;
  deliveryInstructions: string;
  rentalWindow: PricingWindow;
  items: CartItem[];
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CheckoutPayload;
    const supabase = getSupabaseServerClient();

    const total_amount = body.items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return sum;
      return sum + getPrice(product, body.rentalWindow) * item.quantity;
    }, 0);

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: body.customerName,
        email: body.email,
        phone: body.phone,
        notify_method: body.notifyMethod,
        billing_name: body.billingName,
        billing_address: body.billingAddress,
        billing_city: body.billingCity,
        billing_state: body.billingState,
        billing_zip: body.billingZip,
        delivery_instructions: body.deliveryInstructions,
        rental_window: body.rentalWindow,
        status: 'new',
        total_amount
      })
      .select()
      .single();

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 400 });
    }

    const rows = body.items
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null;
        return {
          order_id: order.id,
          product_name: product.name,
          product_size: product.size,
          quantity: item.quantity,
          unit_price: getPrice(product, body.rentalWindow)
        };
      })
      .filter((row): row is {
        order_id: string;
        product_name: string;
        product_size: string;
        quantity: number;
        unit_price: number;
      } => Boolean(row));

    if (rows.length) {
      const { error: itemsError } = await supabase.from('order_items').insert(rows);
      if (itemsError) {
        return NextResponse.json({ error: itemsError.message }, { status: 400 });
      }
    }

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      order
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
