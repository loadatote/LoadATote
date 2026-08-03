'use client';

import Image from 'next/image';
import { ToteProduct, PricingWindow } from '@/lib/types';
import { getPrice, money, pricingLabels } from '@/lib/products';
import { useCart } from './CartProvider';

export function ProductCard({ product, window }: { product: ToteProduct; window: PricingWindow }) {
  const { addItem } = useCart();
  const price = getPrice(product, window);

  return (
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-black/70 shadow-soft">
      <div className="relative h-56">
        <Image src={product.image} alt={`${product.name} ${product.size}`} fill className="object-cover" />
      </div>
      <div className="space-y-4 p-5 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">{product.size}</h3>
            <p className="text-sm text-white/65">{product.description}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${product.isOutOfStock ? 'bg-red-500/20 text-red-200' : 'bg-emerald-500/20 text-emerald-200'}`}>
            {product.isOutOfStock ? 'Out of stock' : 'Available'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/5 p-3">
            <div className="text-xs uppercase tracking-wide text-white/50">{pricingLabels[window]}</div>
            <div className="text-xl font-bold">{money(price)}</div>
          </div>
          <button
            onClick={() => addItem(product.id)}
            type="button"
            disabled={product.isOutOfStock}
            className="rounded-2xl bg-amber-400 px-4 py-3 font-semibold text-black disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/40"
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
