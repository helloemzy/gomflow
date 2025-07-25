-- GOMFLOW Database Schema for Supabase
-- Run these commands in your Supabase SQL Editor

-- 1. Profiles (unified users)
create table profiles (
  id uuid primary key references auth.users(id),
  email text unique not null,
  discord_id text unique,
  discord_username text,
  is_gom boolean default false,
  created_at timestamp default now()
);

-- 2. Orders
create table orders (
  id uuid primary key default gen_random_uuid(),
  gom_id uuid references profiles(id) not null,
  
  -- Product info
  product_name text not null,
  product_description text,
  product_image_url text,
  price decimal(10,2) not null,
  currency text not null,
  
  -- Location & payments
  country text not null check (country in ('PH', 'MY', 'ID', 'TH', 'SG', 'HK', 'US', 'CA', 'GB', 'AU')),
  payment_methods jsonb not null,
  payment_details jsonb not null, -- GOM's payment account details
  
  -- Order requirements
  minimum_order_quantity integer not null,
  current_order_count integer default 0,
  status text default 'open',
  deadline timestamp not null,
  
  -- Tracking
  shareable_slug text unique not null,
  created_at timestamp default now()
);

-- 3. Submissions
create table submissions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) not null,
  
  -- Buyer info
  buyer_id uuid references profiles(id),
  guest_email text,
  tracking_code text unique,
  
  -- Order details
  quantity integer not null,
  payment_method text not null,
  payment_proof_url text,
  payment_verified boolean default false,
  
  -- Shipping
  tracking_number text,
  courier_service text,
  shipped_at timestamp,
  
  created_at timestamp default now(),
  
  constraint buyer_identification check (buyer_id is not null or guest_email is not null)
);

-- Enable RLS (Row Level Security)
alter table profiles enable row level security;
alter table orders enable row level security;
alter table submissions enable row level security;

-- Basic RLS policies
create policy "Anyone can view orders" on orders for select using (true);
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "GOMs can manage their orders" on orders for all using (auth.uid() = gom_id);
create policy "Users can view own submissions" on submissions for select using (auth.uid() = buyer_id);
create policy "GOMs can view submissions for their orders" on submissions for select using (
  exists (
    select 1 from orders 
    where orders.id = submissions.order_id 
    and orders.gom_id = auth.uid()
  )
);

-- Additional policies for profiles
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Additional policies for submissions
create policy "Anyone can insert submissions" on submissions for insert with check (true);
create policy "GOMs can update submissions for their orders" on submissions for update using (
  exists (
    select 1 from orders 
    where orders.id = submissions.order_id 
    and orders.gom_id = auth.uid()
  )
);

-- Create storage bucket for payment proofs
insert into storage.buckets (id, name, public) values ('payment-proofs', 'payment-proofs', false);

-- Storage policy for payment proofs
create policy "Users can upload payment proofs" on storage.objects for insert with check (
  bucket_id = 'payment-proofs' and auth.role() = 'authenticated'
);

create policy "Users can view payment proofs" on storage.objects for select using (
  bucket_id = 'payment-proofs' and auth.role() = 'authenticated'
);

-- Create storage bucket for product images
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true);

-- Storage policy for product images
create policy "GOMs can upload product images" on storage.objects for insert with check (
  bucket_id = 'product-images' and auth.role() = 'authenticated'
);

create policy "Anyone can view product images" on storage.objects for select using (
  bucket_id = 'product-images'
);

-- Function to generate unique tracking codes
create or replace function generate_tracking_code()
returns text as $$
declare
  chars text := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result text := 'GOM-';
  i integer;
begin
  for i in 1..8 loop
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  end loop;
  return result;
end;
$$ language plpgsql;

-- Function to update order count when submission is created/updated
create or replace function update_order_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update orders 
    set current_order_count = current_order_count + NEW.quantity
    where id = NEW.order_id;
    
    -- Check if MOQ is met
    update orders 
    set status = 'moq_met'
    where id = NEW.order_id 
    and current_order_count >= minimum_order_quantity
    and status = 'open';
    
    return NEW;
  elsif TG_OP = 'UPDATE' then
    -- Update count based on quantity difference
    update orders 
    set current_order_count = current_order_count + (NEW.quantity - OLD.quantity)
    where id = NEW.order_id;
    
    return NEW;
  elsif TG_OP = 'DELETE' then
    update orders 
    set current_order_count = current_order_count - OLD.quantity
    where id = OLD.order_id;
    
    return OLD;
  end if;
  return null;
end;
$$ language plpgsql;

-- Trigger to update order count
create trigger update_order_count_trigger
  after insert or update of quantity or delete on submissions
  for each row execute function update_order_count();

-- Function to generate unique shareable slug
create or replace function generate_order_slug()
returns text as $$
declare
  chars text := 'abcdefghijklmnopqrstuvwxyz0123456789';
  result text := '';
  i integer;
  slug_exists boolean := true;
begin
  while slug_exists loop
    result := '';
    for i in 1..8 loop
      result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    end loop;
    
    select exists(select 1 from orders where shareable_slug = result) into slug_exists;
  end loop;
  
  return result;
end;
$$ language plpgsql;

-- Indexes for better performance
create index idx_orders_country on orders(country);
create index idx_orders_status on orders(status);
create index idx_orders_deadline on orders(deadline);
create index idx_submissions_order_id on submissions(order_id);
create index idx_submissions_buyer_id on submissions(buyer_id);
create index idx_submissions_tracking_code on submissions(tracking_code);