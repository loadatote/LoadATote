'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/CartProvider';
import { products, getPrice, money } from '@/lib/products';
import { PricingWindow } from '@/lib/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clear } = useCart();
  const [status, setStatus] = useState('');
  const [orderId, setOrderId] = useState('');

  const [form, setForm] = useState({
    customerName: '',
    email: '',
    phone: '',
    notifyMethod: 'email' as 'email' | 'sms',
    billingName: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    deliveryInstructions: '',
    rentalWindow: '7d' as PricingWindow
  });

  const lines = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      const unit = getPrice(product, form.rentalWindow);
      return { product, unit, quantity: item.quantity, subtotal: unit * item.quantity };
    })
    .filter(Boolean) as Array<{ product: (typeof products)[number]; unit: number; quantity: number; subtotal: number }>;

  const total = lines.reduce((sum, line) => sum + line.subtotal, 0);

  async function submit() {
    setStatus('Submitting order...');
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, items })
    });

    const data = await response.json();

    if (!response.ok) {
      setStatus(data.error || 'Order failed.');
      return;
    }

    clear();
    setOrderId(data.orderId);
    setStatus('Order created.');
    router.push(`/orders/${data.orderId}`);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="space-y-4 rounded-3xl border border-white/10 bg-black/70 p-6 shadow-soft">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            ['customerName', 'Customer name'],
            ['email', 'Email'],
            ['phone', 'Phone'],
            ['billingName', 'Billing name'],
            ['billingAddress', 'Billing address'],
            ['billingCity', 'City'],
            ['billingState', 'State'],
            ['billingZip', 'Zip']
          ].map(([key, label]) => (
            <input
              key={key}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
              placeholder={label}
              value={(form as Record<string, string>)[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <select className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" value={form.notifyMethod} onChange={(e) => setForm({ ...form, notifyMethod: e.target.value as 'email' | 'sms' })}>
            <option value="email">Email me when ready</option>
            <option value="sms">Text me when ready</option>
          </select>
          <select className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" value={form.rentalWindow} onChange={(e) => setForm({ ...form, rentalWindow: e.target.value as PricingWindow })}>
            <option value="1d">1 Day</option>
            <option value="7d">7 Days</option>
            <option value="14d">14 Days</option>
            <option value="30d">30 Days</option>
            <option value="60d">60 Days</option>
          </select>
        </div>

        <textarea
          className="min-h-32 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
          placeholder="Delivery instructions"
          value={form.deliveryInstructions}
          onChange={(e) => setForm({ ...form, deliveryInstructions: e.target.value })}
        />

        <button className="rounded-2xl bg-amber-400 px-4 py-3 font-semibold text-black" onClick={submit} type="button">
          Place order
        </button>
        {status ? <p className="text-sm text-white/70">{status}</p> : null}
        {orderId ? <p className="text-sm text-white/50">Order ID: {orderId}</p> : null}
      </section>

      <aside className="h-fit rounded-3xl border border-white/10 bg-black/70 p-6 shadow-soft">
        <h2 className="text-xl font-semibold">Your order</h2>
        <div className="mt-4 space-y-3">
          {lines.map((line) => (
            <div key={line.product.id} className="flex items-center justify-between text-sm">
              <div>
                <div className="font-medium">{line.product.size}</div>
                <div className="text-white/50">Qty {line.quantity}</div>
              </div>
              <div>{money(line.subtotal)}</div>
            </div>
          ))}
          <div className="border-t border-white/10 pt-3 font-semibold">
            <div className="flex items-center justify-between">
              <span>Total</span>
              <span>{money(total)}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
