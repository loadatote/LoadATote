'use client';

import Image from 'next/image';
import { ToteProduct, PricingWindow } from '@/lib/types';
import { formatMoney, getPriceForWindow, pricingLabel } from '@/lib/mockProducts';
import { useCart } from './CartProvider';

export function ProductCard({
  product,
  rentalWindow
}: {
  product: ToteProduct;
  rentalWindow: PricingWindow;
}) {
  const { addItem } = useCart();
  const price = getPriceForWindow(product, rentalWindow);

  return (
    <article className="overflow-hidden rounded-3xl border bg-white shadow-soft">
      <div className="relative h-56 w-full">
        <Image src={product.image} alt={`${product.name} ${product.size}`} fill className="object-cover" />
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-sm text-slate-600">{product.size}</p>
          </div>
          {product.isOutOfStock ? (
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
              Out of stock
            </span>
          ) : (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              Available
            </span>
          )}
        </div>
        <p className="text-sm text-slate-600">{product.description}</p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl bg-slate-50 p-3">
            <div className="text-slate-500">{pricingLabel[rentalWindow]}</div>
            <div className="text-lg font-semibold">{formatMoney(price)}</div>
          </div>
          <button
            className="rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
            onClick={() => addItem(product.id)}
            disabled={product.isOutOfStock}
            type="button"
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
