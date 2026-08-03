import { ToteProduct } from './types';

const image = (label: string) =>
  `https://placehold.co/900x600/f8fafc/0f172a?text=${encodeURIComponent(label)}`;

export const products: ToteProduct[] = [
  {
    id: '26qt',
    name: 'HDX Tough Storage Tote',
    size: '26 qt',
    description: 'Compact tote for light loads and quick moves.',
    image: image('HDX 26 qt'),
    daily: 4,
    threeDay: 9,
    sevenDay: 14,
    fourteenDay: 22,
    thirtyDay: 38,
    sixtyDay: 55,
    isOutOfStock: false
  },
  {
    id: '27gal',
    name: 'HDX Tough Storage Tote',
    size: '27 gal',
    description: 'Standard moving tote for household packing.',
    image: image('HDX 27 gal'),
    daily: 6,
    threeDay: 14,
    sevenDay: 22,
    fourteenDay: 34,
    thirtyDay: 58,
    sixtyDay: 84,
    isOutOfStock: false
  },
  {
    id: '40gal',
    name: 'HDX Tough Storage Tote',
    size: '40 gal',
    description: 'Large tote for bulky items and longer rentals.',
    image: image('HDX 40 gal'),
    daily: 8,
    threeDay: 18,
    sevenDay: 30,
    fourteenDay: 46,
    thirtyDay: 78,
    sixtyDay: 112,
    isOutOfStock: false
  },
  {
    id: 'heavy-duty',
    name: 'HDX Tough Storage Tote',
    size: 'Heavy-duty XL',
    description: 'Oversized tote for jobsite or storage overflow.',
    image: image('HDX Heavy Duty'),
    daily: 10,
    threeDay: 24,
    sevenDay: 40,
    fourteenDay: 60,
    thirtyDay: 98,
    sixtyDay: 140,
    isOutOfStock: false
  }
];

export const pricingLabel: Record<string, string> = {
  '1d': '1 Day',
  '3d': '3 Days',
  '7d': '1 Week',
  '14d': '2 Weeks',
  '30d': '1 Month',
  '60d': '2 Months'
};

export function getPriceForWindow(product: ToteProduct, window: keyof typeof pricingLabel) {
  switch (window) {
    case '1d':
      return product.daily;
    case '3d':
      return product.threeDay;
    case '7d':
      return product.sevenDay;
    case '14d':
      return product.fourteenDay;
    case '30d':
      return product.thirtyDay;
    case '60d':
      return product.sixtyDay;
  }
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}
