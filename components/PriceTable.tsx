'use client';

import { ToteProduct, PricingWindow } from '@/lib/types';
import { formatMoney, getPriceForWindow, pricingLabel } from '@/lib/mockProducts';

export function PriceTable({
  product,
  rentalWindow,
  onChange
}: {
  product: ToteProduct;
  rentalWindow: PricingWindow;
  onChange: (window: PricingWindow) => void;
}) {
  const options: PricingWindow[] = ['1d', '7d', '14d', '30d', '60d'];

  return (
    <div className="rounded-3xl border bg-white p-4 shadow-soft">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Rental pricing</p>
          <p className="font-semibold">{product.size}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500">Selected</p>
          <p className="font-semibold">{pricingLabel[rentalWindow]}</p>
        </div>
      </div>
      <div className="grid gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left ${
              rentalWindow === option ? 'border-slate-900 bg-slate-100' : 'border-slate-200'
            }`}
          >
            <span>{pricingLabel[option]}</span>
            <span className="font-semibold">{formatMoney(getPriceForWindow(product, option))}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
