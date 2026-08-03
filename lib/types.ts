export type PricingWindow = '1d' | '7d' | '14d' | '30d' | '60d';

export type CartItem = {
  productId: string;
  quantity: number;
};

export type ToteProduct = {
  id: string;
  name: string;
  size: string;
  description: string;
  image: string;
  daily: number;
  threeDay: number;
  sevenDay: number;
  fourteenDay: number;
  thirtyDay: number;
  sixtyDay: number;
  isOutOfStock: boolean;
};

export type OrderStatus = 'new' | 'processing' | 'ready' | 'completed' | 'cancelled';
