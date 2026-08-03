create table if not exists public.products (
  id text primary key,
  name text not null,
  size text not null,
  description text not null,
  image text not null,
  daily numeric not null default 0,
  three_day numeric not null default 0,
  seven_day numeric not null default 0,
  fourteen_day numeric not null default 0,
  thirty_day numeric not null default 0,
  sixty_day numeric not null default 0,
  is_out_of_stock boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  email text not null,
  phone text,
  notify_method text,
  billing_name text not null,
  billing_address text not null,
  billing_city text not null,
  billing_state text not null,
  billing_zip text not null,
  delivery_instructions text,
  rental_window text not null,
  status text not null default 'new',
  total_amount numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_name text not null,
  product_size text not null,
  quantity integer not null default 1,
  unit_price numeric not null default 0,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "public read products" on public.products;
create policy "public read products"
on public.products for select
using (true);

drop policy if exists "public read orders" on public.orders;
create policy "public read orders"
on public.orders for select
using (true);

drop policy if exists "public read order items" on public.order_items;
create policy "public read order items"
on public.order_items for select
using (true);

insert into public.products (id, name, size, description, image, daily, three_day, seven_day, fourteen_day, thirty_day, sixty_day, is_out_of_stock)
values
('12gal', 'HDX Tough Storage Tote', '12 GAL', 'Small tote for compact loads and accessories.', '/12gal.svg', 3, 7, 9, 14, 20, 28, false),
('17gal', 'HDX Tough Storage Tote', '17 GAL', 'Great for kitchen and office packing.', '/17gal.svg', 4, 8, 10, 16, 22, 30, false),
('27gal', 'HDX Tough Storage Tote', '27 GAL', 'A popular mid-size moving tote.', '/27gal.svg', 5, 10, 12, 18, 26, 34, false),
('35gal', 'HDX Tough Storage Tote', '35 GAL', 'Extra room for bedding and bulky items.', '/35gal.svg', 6, 12, 14, 20, 28, 38, false),
('45gal', 'HDX Tough Storage Tote', '45 GAL', 'Large tote for heavy household loads.', '/45gal.svg', 7, 14, 16, 24, 34, 46, false),
('65gal', 'HDX Tough Storage Tote', '65 GAL', 'Largest tote for long or oversized rentals.', '/65gal.svg', 8, 16, 18, 26, 36, 48, false)
on conflict (id) do nothing;
