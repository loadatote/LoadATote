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

export type OrderRecord = {
  id: string;
  customer_name: string;
  email: string;
  phone: string | null;
  notify_method: string | null;
  billing_name: string;
  billing_address: string;
  billing_city: string;
  billing_state: string;
  billing_zip: string;
  delivery_instructions: string | null;
  rental_window: PricingWindow;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
};
