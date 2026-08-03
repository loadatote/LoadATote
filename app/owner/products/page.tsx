'use client';

import { OwnerGuard } from '@/components/OwnerGuard';
import { OwnerTabs } from '@/components/OwnerTabs';
import { products } from '@/lib/products';

export default function OwnerProductsPage() {
  return (
    <OwnerGuard>
      <section className="space-y-6">
        <OwnerTabs />
        <div className="rounded-3xl border border-white/10 bg-black/70 p-6 shadow-soft">
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="mt-2 text-white/60">Review tote sizes and current stock state.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="rounded-3xl border border-white/10 bg-black/70 p-5 shadow-soft">
              <div className="text-lg font-semibold">{product.size}</div>
              <p className="mt-2 text-sm text-white/60">{product.description}</p>
              <div className="mt-4 text-sm text-white/70">
                {product.isOutOfStock ? 'Out of stock' : 'Available'}
              </div>
            </div>
          ))}
        </div>
      </section>
    </OwnerGuard>
  );
}
