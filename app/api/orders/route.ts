import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabaseServer';
import { CheckoutPayload } from '@/lib/types';
import { sendNotifications } from '@/lib/notify';

type ProductRow = {
  id: string;
  name: string;
  size: string;
  description: string;
  image_url: string;
  daily: number;
  three_day: number;
  seven_day: number;
  fourteen_day: number;
  thirty_day: number;
  sixty_day: number;
  is_out_of_stock: boolean;
};

function priceForWindow(product: ProductRow, window: CheckoutPayload['rentalWindow']) {
  switch (window) {
    case '1d':
      return Number(product.daily);
    case '3d':
      return Number(product.three_day);
    case '7d':
      return Number(product.seven_day);
    case '14d':
      return Number(product.fourteen_day);
    case '30d':
      return Number(product.thirty_day);
    case '60d':
      return Number(product.sixty_day);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CheckoutPayload;
    const supabase = getServiceClient();

    const { data: rows, error: productError } = await supabase.from('products').select('*');
    if (productError) {
      return NextResponse.json({ error: productError.message }, { status: 400 });
    }

    const catalog = rows as ProductRow[];

    const orderTotal = body.items.reduce((sum, item) => {
      const product = catalog.find((p) => p.id === item.productId);
      if (!product) return sum;
      return sum + priceForWindow(product, body.rentalWindow) * item.quantity;
    }, 0);

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: body.customerName,
        email: body.email,
        phone: body.phone,
        notify_method: body.notifyMethod,
        rental_window: body.rentalWindow,
        billing_name: body.billingName,
        billing_address: body.billingAddress,
        billing_city: body.billingCity,
        billing_state: body.billingState,
        billing_zip: body.billingZip,
        delivery_instructions: body.deliveryInstructions,
        status: 'new',
        total_amount: orderTotal
      })
      .select()
      .single();

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 400 });
    }

    const orderItems = body.items
      .map((item) => {
        const product = catalog.find((p) => p.id === item.productId);
        if (!product) return null;
        return {
          order_id: order.id,
          product_id: product.id,
          product_name: product.name,
          product_size: product.size,
          quantity: item.quantity,
          unit_price: priceForWindow(product, body.rentalWindow)
        };
      })
      .filter(Boolean);

    if (orderItems.length) {
      const { error: itemsError } = await supabase.from('order_items').insert(orderItems as never[]);
      if (itemsError) {
        return NextResponse.json({ error: itemsError.message }, { status: 400 });
      }
    }

    await supabase.from('notifications').insert([
      {
        order_id: order.id,
        channel: 'owner',
        message: `New order from ${body.customerName} for ${orderTotal.toFixed(2)}`
      }
    ]);

    const notifyResults = await sendNotifications({
      ownerEmail: process.env.OWNER_ALERT_EMAIL || body.email,
      customerEmail: body.email,
      customerPhone: body.phone,
      customerName: body.customerName,
      notifyMethod: body.notifyMethod,
      message: `Order #${order.id} total ${orderTotal.toFixed(2)}. Delivery instructions: ${body.deliveryInstructions || 'None'}`
    });

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      total: orderTotal,
      message: notifyResults.map((entry) => entry.message).join(' | ')
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
