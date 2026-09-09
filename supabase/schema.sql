-- ============================================================
-- 4B Traders — full database schema + Row Level Security
-- Run this in Supabase: Dashboard -> SQL Editor -> New query
-- ============================================================

create table if not exists admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz default now()
);

create or replace function is_admin() returns boolean as $$
  select exists (select 1 from admin_users where id = auth.uid());
$$ language sql security definer stable;

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  image text,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null default 0,
  sale_price numeric(10,2),
  category_id uuid references categories(id) on delete set null,
  sku text,
  sizes text[] default '{}',
  colors text[] default '{}',
  stock int default 0,
  images text[] default '{}',
  featured boolean default false,
  new_arrival boolean default false,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  address text,
  created_at timestamptz default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete set null,
  items jsonb not null default '[]',
  subtotal numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  status text not null default 'Pending'
    check (status in ('Pending','Confirmed','Processing','Shipped','Delivered','Cancelled')),
  created_at timestamptz default now()
);

create table if not exists homepage_content (
  id int primary key default 1,
  hero_title text default 'Timeless Elegance, Handcrafted for You',
  hero_subtitle text default 'Discover our premium jutti & khussa collection',
  hero_image text,
  hero_button_text text default 'Shop Now',
  hero_button_link text default '/products',
  banner_text text,
  banner_image text,
  banner_button_text text,
  banner_button_link text,
  featured_product_ids uuid[] default '{}',
  updated_at timestamptz default now(),
  constraint single_row check (id = 1)
);
insert into homepage_content (id) values (1) on conflict (id) do nothing;

create table if not exists about_content (
  id int primary key default 1,
  heading text default 'Our Story',
  description text,
  image text,
  updated_at timestamptz default now(),
  constraint single_row check (id = 1)
);
insert into about_content (id) values (1) on conflict (id) do nothing;

create table if not exists gallery (
  id uuid primary key default gen_random_uuid(),
  image text not null,
  caption text,
  sort_order int default 0,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  review text not null,
  rating int check (rating between 1 and 5) default 5,
  photo text,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists website_settings (
  id int primary key default 1,
  business_name text default '4B Traders',
  logo text,
  favicon text,
  site_title text default '4B Traders — Luxury Jutti & Khussa',
  meta_description text,
  currency text default 'PKR',
  whatsapp text,
  phone text,
  email text,
  address text,
  business_hours text,
  google_maps_link text,
  instagram text,
  facebook text,
  tiktok text,
  youtube text,
  linkedin text,
  updated_at timestamptz default now(),
  constraint single_row check (id = 1)
);
insert into website_settings (id) values (1) on conflict (id) do nothing;

-- ============================================================
-- ROW LEVEL SECURITY
-- Public can read active/public content. Only rows present in
-- admin_users can create/update/delete anything, or read orders,
-- customers, and inactive content.
-- ============================================================

alter table admin_users enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table customers enable row level security;
alter table orders enable row level security;
alter table homepage_content enable row level security;
alter table about_content enable row level security;
alter table gallery enable row level security;
alter table testimonials enable row level security;
alter table website_settings enable row level security;

create policy "admins read admin_users" on admin_users for select using (is_admin());

create policy "public read active categories" on categories for select using (active = true or is_admin());
create policy "admin write categories" on categories for insert with check (is_admin());
create policy "admin update categories" on categories for update using (is_admin());
create policy "admin delete categories" on categories for delete using (is_admin());

create policy "public read active products" on products for select using (active = true or is_admin());
create policy "admin write products" on products for insert with check (is_admin());
create policy "admin update products" on products for update using (is_admin());
create policy "admin delete products" on products for delete using (is_admin());

create policy "admin read customers" on customers for select using (is_admin());
create policy "public create customer on checkout" on customers for insert with check (true);
create policy "admin update customers" on customers for update using (is_admin());
create policy "admin delete customers" on customers for delete using (is_admin());

create policy "admin read orders" on orders for select using (is_admin());
create policy "public create order on checkout" on orders for insert with check (true);
create policy "admin update orders" on orders for update using (is_admin());
create policy "admin delete orders" on orders for delete using (is_admin());

create policy "public read homepage" on homepage_content for select using (true);
create policy "admin update homepage" on homepage_content for update using (is_admin());

create policy "public read about" on about_content for select using (true);
create policy "admin update about" on about_content for update using (is_admin());

create policy "public read settings" on website_settings for select using (true);
create policy "admin update settings" on website_settings for update using (is_admin());

create policy "public read active gallery" on gallery for select using (active = true or is_admin());
create policy "admin write gallery" on gallery for insert with check (is_admin());
create policy "admin update gallery" on gallery for update using (is_admin());
create policy "admin delete gallery" on gallery for delete using (is_admin());

create policy "public read active testimonials" on testimonials for select using (active = true or is_admin());
create policy "admin write testimonials" on testimonials for insert with check (is_admin());
create policy "admin update testimonials" on testimonials for update using (is_admin());
create policy "admin delete testimonials" on testimonials for delete using (is_admin());
