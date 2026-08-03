'use client';

import { useState } from 'react';
import { useCart } from '@/components/CartProvider';
import { products, formatMoney, getPriceForWindow } from '@/lib/mockProducts';
import { PricingWindow } from '@/lib/types';

export default function CheckoutPage() {
  const { items, clear } = useCart();
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
  const [status, setStatus] = useState('');

  const lines = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      const unit = getPriceForWindow(product, form.rentalWindow);
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
      setStatus(data.error || 'Order failed');
      return;
    }

    clear();
    setStatus(`Order created. ${data.message || 'Notification stored.'}`);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="space-y-4 rounded-3xl border bg-white p-6 shadow-soft">
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
              className="rounded-2xl border px-4 py-3"
              placeholder={label}
              value={(form as Record<string, string>)[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <select className="rounded-2xl border px-4 py-3" value={form.notifyMethod} onChange={(e) => setForm({ ...form, notifyMethod: e.target.value as 'email' | 'sms' })}>
            <option value="email">Email me when ready</option>
            <option value="sms">Text me when ready</option>
          </select>
          <select className="rounded-2xl border px-4 py-3" value={form.rentalWindow} onChange={(e) => setForm({ ...form, rentalWindow: e.target.value as PricingWindow })}>
            <option value="1d">1 Day</option>
            <option value="3d">3 Days</option>
            <option value="7d">1 Week</option>
            <option value="14d">2 Weeks</option>
            <option value="30d">1 Month</option>
            <option value="60d">2 Months</option>
          </select>
        </div>

        <textarea
          className="min-h-32 rounded-2xl border px-4 py-3"
          placeholder="Delivery instructions"
          value={form.deliveryInstructions}
          onChange={(e) => setForm({ ...form, deliveryInstructions: e.target.value })}
        />

        <button className="rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white" onClick={submit} type="button">
          Place order
        </button>
        {status ? <p className="text-sm text-slate-600">{status}</p> : null}
      </section>

      <aside className="h-fit rounded-3xl border bg-white p-6 shadow-soft">
        <h2 className="text-xl font-semibold">Your order</h2>
        <div className="mt-4 space-y-3">
          {lines.map((line) => (
            <div key={line.product.id} className="flex items-center justify-between text-sm">
              <div>
                <div className="font-medium">{line.product.size}</div>
                <div className="text-slate-500">Qty {line.quantity}</div>
              </div>
              <div>{formatMoney(line.subtotal)}</div>
            </div>
          ))}
          <div className="border-t pt-3 font-semibold">
            <div className="flex items-center justify-between">
              <span>Total</span>
              <span>{formatMoney(total)}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
