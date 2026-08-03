import { ToteProduct, PricingWindow } from './types';

export const products: ToteProduct[] = [
  {
    id: '12gal',
    name: 'HDX Tough Storage Tote',
    size: '12 GAL',
    description: 'Small tote for compact loads and accessories.',
    image: '/12gal.svg',
    daily: 3,
    threeDay: 7,
    sevenDay: 9,
    fourteenDay: 14,
    thirtyDay: 20,
    sixtyDay: 28,
    isOutOfStock: false
  },
  {
    id: '17gal',
    name: 'HDX Tough Storage Tote',
    size: '17 GAL',
    description: 'Great for kitchen and office packing.',
    image: '/17gal.svg',
    daily: 4,
    threeDay: 8,
    sevenDay: 10,
    fourteenDay: 16,
    thirtyDay: 22,
    sixtyDay: 30,
    isOutOfStock: false
  },
  {
    id: '27gal',
    name: 'HDX Tough Storage Tote',
    size: '27 GAL',
    description: 'A popular mid-size moving tote.',
    image: '/27gal.svg',
    daily: 5,
    threeDay: 10,
    sevenDay: 12,
    fourteenDay: 18,
    thirtyDay: 26,
    sixtyDay: 34,
    isOutOfStock: false
  },
  {
    id: '35gal',
    name: 'HDX Tough Storage Tote',
    size: '35 GAL',
    description: 'Extra room for bedding and bulky items.',
    image: '/35gal.svg',
    daily: 6,
    threeDay: 12,
    sevenDay: 14,
    fourteenDay: 20,
    thirtyDay: 28,
    sixtyDay: 38,
    isOutOfStock: false
  },
  {
    id: '45gal',
    name: 'HDX Tough Storage Tote',
    size: '45 GAL',
    description: 'Large tote for heavy household loads.',
    image: '/45gal.svg',
    daily: 7,
    threeDay: 14,
    sevenDay: 16,
    fourteenDay: 24,
    thirtyDay: 34,
    sixtyDay: 46,
    isOutOfStock: false
  },
  {
    id: '65gal',
    name: 'HDX Tough Storage Tote',
    size: '65 GAL',
    description: 'Largest tote for long or oversized rentals.',
    image: '/65gal.svg',
    daily: 8,
    threeDay: 16,
    sevenDay: 18,
    fourteenDay: 26,
    thirtyDay: 36,
    sixtyDay: 48,
    isOutOfStock: false
  }
];

export const pricingLabels: Record<PricingWindow, string> = {
  '1d': '1 Day',
  '7d': '7 Days',
  '14d': '14 Days',
  '30d': '30 Days',
  '60d': '60 Days'
};

export function getPrice(product: ToteProduct, window: PricingWindow) {
  switch (window) {
    case '1d':
      return product.daily;
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

export function money(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}
