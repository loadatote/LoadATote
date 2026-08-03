'use client';

import Link from 'next/link';
import { products, getPrice, money } from '@/lib/products';
import { useCart } from '@/components/CartProvider';
import { PricingWindow } from '@/lib/types';

export default function CartPage() {
  const { items, setQuantity, removeItem } = useCart();
  const rentalWindow: PricingWindow = '7d';

  const lines = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      const unit = getPrice(product, rentalWindow);
      return { product, unit, quantity: item.quantity, subtotal: unit * item.quantity };
    })
    .filter(Boolean) as Array<{ product: (typeof products)[number]; unit: number; quantity: number; subtotal: number }>;

  const total = lines.reduce((sum, line) => sum + line.subtotal, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Shopping cart</h1>
      {lines.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-black/70 p-6 shadow-soft">
          <p>Your cart is empty.</p>
          <Link href="/" className="mt-4 inline-block rounded-2xl bg-amber-400 px-4 py-3 font-semibold text-black">
            Browse totes
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
          <div className="space-y-4">
            {lines.map((line) => (
              <div key={line.product.id} className="rounded-3xl border border-white/10 bg-black/70 p-5 shadow-soft">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-semibold">{line.product.size}</h2>
                    <p className="text-sm text-white/60">{line.product.description}</p>
                  </div>
                  <button className="text-sm font-semibold text-red-300" onClick={() => removeItem(line.product.id)} type="button">
                    Remove
                  </button>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <button className="rounded-2xl border border-white/10 px-3 py-2" onClick={() => setQuantity(line.product.id, Math.max(1, line.quantity - 1))} type="button">-</button>
                  <div className="min-w-10 text-center font-semibold">{line.quantity}</div>
                  <button className="rounded-2xl border border-white/10 px-3 py-2" onClick={() => setQuantity(line.product.id, line.quantity + 1)} type="button">+</button>
                  <div className="ml-auto font-semibold">{money(line.subtotal)}</div>
                </div>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-3xl border border-white/10 bg-black/70 p-5 shadow-soft">
            <h2 className="text-xl font-semibold">Order summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span>Items</span><span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span></div>
              <div className="flex justify-between font-semibold"><span>Total</span><span>{money(total)}</span></div>
            </div>
            <Link href="/checkout" className="mt-5 block rounded-2xl bg-amber-400 px-4 py-3 text-center font-semibold text-black">
              Checkout
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
