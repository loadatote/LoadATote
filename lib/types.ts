export type PricingWindow = '1d' | '3d' | '7d' | '14d' | '30d' | '60d';

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

export type CartItem = {
  productId: string;
  quantity: number;
};

export type CheckoutPayload = {
  customerName: string;
  email: string;
  phone: string;
  notifyMethod: 'email' | 'sms';
  billingName: string;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingZip: string;
  deliveryInstructions: string;
  rentalWindow: PricingWindow;
  items: CartItem[];
};

export type OrderStatus =
  | 'new'
  | 'processing'
  | 'ready'
  | 'delivered'
  | 'cancelled';

export type OrderRecord = {
  id: string;
  customer_name: string;
  email: string;
  phone: string | null;
  notify_method: 'email' | 'sms' | null;
  rental_window: PricingWindow;
  billing_name: string;
  billing_address: string;
  billing_city: string;
  billing_state: string;
  billing_zip: string;
  delivery_instructions: string | null;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
};

export type NotificationRecord = {
  id: string;
  order_id: string;
  channel: 'owner' | 'customer';
  message: string;
  sent_at: string;
};
