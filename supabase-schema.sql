-- ============================================
-- OFERTONAZOS DATABASE SCHEMA
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- TABLE: profiles
-- Extends auth.users with custom fields
-- ============================================
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  avatar_url text,
  role text default 'user' check (role in ('user', 'admin')),
  subscription_active boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ============================================
-- TABLE: offers
-- Main table for product offers
-- ============================================
create table offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  price numeric not null check (price >= 0),
  image_url text not null,
  description text,
  affiliate_link text not null,
  user_id uuid references profiles(id) on delete cascade,
  likes_count integer default 0 check (likes_count >= 0),
  source text default 'manual' check (source in ('manual', 'scraper')),
  status text default 'active' check (status in ('active', 'inactive', 'pending')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ============================================
-- TABLE: likes (para fase 2)
-- Track user likes on offers
-- ============================================
create table likes (
  user_id uuid references profiles(id) on delete cascade,
  offer_id uuid references offers(id) on delete cascade,
  created_at timestamp with time zone default now(),
  primary key (user_id, offer_id)
);

-- ============================================
-- INDEXES for better performance
-- ============================================
create index idx_offers_created_at on offers(created_at desc);
create index idx_offers_user_id on offers(user_id);
create index idx_offers_status on offers(status);
create index idx_likes_offer_id on likes(offer_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table offers enable row level security;
alter table likes enable row level security;

-- ============================================
-- RLS POLICIES: profiles
-- ============================================

-- Anyone can view profiles
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

-- Users can update their own profile
create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Users can insert their own profile
create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- ============================================
-- RLS POLICIES: offers
-- ============================================

-- Anyone can view active offers
create policy "Public can view active offers"
  on offers for select
  using (status = 'active');

-- Users with active subscription OR admins can create offers
create policy "Subscribed users or admins can insert offers"
  on offers for insert
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and (subscription_active = true or role = 'admin')
    )
  );

-- Users can update their own offers
create policy "Users can update own offers"
  on offers for update
  using (auth.uid() = user_id);

-- Admins can update any offer
create policy "Admins can update any offer"
  on offers for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and role = 'admin'
    )
  );

-- Users can delete their own offers
create policy "Users can delete own offers"
  on offers for delete
  using (auth.uid() = user_id);

-- Admins can delete any offer
create policy "Admins can delete any offer"
  on offers for delete
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and role = 'admin'
    )
  );

-- ============================================
-- RLS POLICIES: likes
-- ============================================

-- Anyone can view likes
create policy "Anyone can view likes"
  on likes for select
  using (true);

-- Users can create their own likes
create policy "Users can insert own likes"
  on likes for insert
  with check (auth.uid() = user_id);

-- Users can delete their own likes
create policy "Users can delete own likes"
  on likes for delete
  using (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update likes_count when a like is added/removed
create or replace function update_likes_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update offers
    set likes_count = likes_count + 1
    where id = NEW.offer_id;
    return NEW;
  elsif TG_OP = 'DELETE' then
    update offers
    set likes_count = likes_count - 1
    where id = OLD.offer_id;
    return OLD;
  end if;
  return null;
end;
$$ language plpgsql;

-- Trigger to automatically update likes_count
create trigger on_like_change
  after insert or delete on likes
  for each row execute function update_likes_count();

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  NEW.updated_at = now();
  return NEW;
end;
$$ language plpgsql;

-- Triggers to update updated_at
create trigger update_profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at_column();

create trigger update_offers_updated_at
  before update on offers
  for each row execute function update_updated_at_column();

-- ============================================
-- FUNCTION: Create profile on user signup
-- This runs automatically when a user signs up
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'name',
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
