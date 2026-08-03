-- Run this in the Supabase SQL editor.

create table if not exists public.products (
  id text primary key,
  name text not null,
  size text not null,
  description text not null,
  image_url text not null,
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
  rental_window text not null,
  billing_name text not null,
  billing_address text not null,
  billing_city text not null,
  billing_state text not null,
  billing_zip text not null,
  delivery_instructions text,
  status text not null default 'new',
  total_amount numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null,
  product_name text not null,
  product_size text not null,
  quantity integer not null default 1,
  unit_price numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  channel text not null,
  message text not null,
  sent_at timestamptz not null default now()
);

-- Optional profiles table if you want to extend roles later.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'customer',
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.notifications enable row level security;
alter table public.profiles enable row level security;

-- Public catalog reads.
drop policy if exists "Public read products" on public.products;
create policy "Public read products" on public.products
for select using (true);

-- Customers can create orders through the app service role or with authenticated API routes.
drop policy if exists "Allow order reads to authenticated users" on public.orders;
create policy "Allow order reads to authenticated users" on public.orders
for select using (auth.uid() is not null);

drop policy if exists "Allow order item reads to authenticated users" on public.order_items;
create policy "Allow order item reads to authenticated users" on public.order_items
for select using (auth.uid() is not null);

drop policy if exists "Allow notification reads to authenticated users" on public.notifications;
create policy "Allow notification reads to authenticated users" on public.notifications
for select using (auth.uid() is not null);

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile" on public.profiles
for select using (auth.uid() = id);

-- Seed products
insert into public.products (id, name, size, description, image_url, daily, three_day, seven_day, fourteen_day, thirty_day, sixty_day, is_out_of_stock)
values
('26qt', 'HDX Tough Storage Tote', '26 qt', 'Compact tote for light loads and quick moves.', 'https://placehold.co/900x600/f8fafc/0f172a?text=HDX+26+qt', 4, 9, 14, 22, 38, 55, false),
('27gal', 'HDX Tough Storage Tote', '27 gal', 'Standard moving tote for household packing.', 'https://placehold.co/900x600/f8fafc/0f172a?text=HDX+27+gal', 6, 14, 22, 34, 58, 84, false),
('40gal', 'HDX Tough Storage Tote', '40 gal', 'Large tote for bulky items and longer rentals.', 'https://placehold.co/900x600/f8fafc/0f172a?text=HDX+40+gal', 8, 18, 30, 46, 78, 112, false),
('heavy-duty', 'HDX Tough Storage Tote', 'Heavy-duty XL', 'Oversized tote for jobsite or storage overflow.', 'https://placehold.co/900x600/f8fafc/0f172a?text=HDX+Heavy+Duty', 10, 24, 40, 60, 98, 140, false)
on conflict (id) do nothing;
