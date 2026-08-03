'use client';

import Link from 'next/link';
import { products, formatMoney, getPriceForWindow } from '@/lib/mockProducts';
import { useCart } from '@/components/CartProvider';
import { PricingWindow } from '@/lib/types';

export default function CartPage() {
  const { items, setQuantity, removeItem } = useCart();
  const rentalWindow: PricingWindow = '7d';

  const lines = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      const unit = getPriceForWindow(product, rentalWindow);
      return { product, unit, subtotal: unit * item.quantity };
    })
    .filter(Boolean) as Array<{ product: (typeof products)[number]; unit: number; subtotal: number }>;

  const total = lines.reduce((sum, line) => sum + line.subtotal, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Shopping cart</h1>
      {lines.length === 0 ? (
        <div className="rounded-3xl border bg-white p-6 shadow-soft">
          <p>Your cart is empty.</p>
          <Link href="/" className="mt-4 inline-block rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white">
            Browse totes
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
          <div className="space-y-4">
            {lines.map((line) => (
              <div key={line.product.id} className="rounded-3xl border bg-white p-5 shadow-soft">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-semibold">{line.product.name}</h2>
                    <p className="text-sm text-slate-500">{line.product.size}</p>
                    <p className="mt-1 text-sm">{formatMoney(line.unit)} each</p>
                  </div>
                  <button className="text-sm font-semibold text-red-600" onClick={() => removeItem(line.product.id)} type="button">
                    Remove
                  </button>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <button className="rounded-2xl border px-3 py-2" onClick={() => setQuantity(line.product.id, Math.max(1, items.find((i) => i.productId === line.product.id)!.quantity - 1))} type="button">
                    -
                  </button>
                  <div className="min-w-10 text-center font-semibold">{items.find((i) => i.productId === line.product.id)?.quantity}</div>
                  <button className="rounded-2xl border px-3 py-2" onClick={() => setQuantity(line.product.id, (items.find((i) => i.productId === line.product.id)?.quantity || 1) + 1)} type="button">
                    +
                  </button>
                  <div className="ml-auto font-semibold">{formatMoney(line.subtotal)}</div>
                </div>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-3xl border bg-white p-5 shadow-soft">
            <h2 className="text-xl font-semibold">Order summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span>Items</span><span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span></div>
              <div className="flex justify-between font-semibold"><span>Total</span><span>{formatMoney(total)}</span></div>
            </div>
            <Link href="/checkout" className="mt-5 block rounded-2xl bg-slate-900 px-4 py-3 text-center font-semibold text-white">
              Continue to checkout
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
