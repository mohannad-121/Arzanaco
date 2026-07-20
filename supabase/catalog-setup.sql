-- Run this file once in the Arzana Supabase SQL Editor.
-- It creates one shared catalog document, public read access, realtime updates,
-- and password-protected functions for admin writes.

begin;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.catalog_state (
  id smallint primary key check (id = 1),
  data jsonb,
  updated_at timestamptz not null default now()
);

insert into public.catalog_state (id, data)
values (1, null)
on conflict (id) do nothing;

alter table public.catalog_state enable row level security;

revoke all on table public.catalog_state from anon, authenticated;
grant select on table public.catalog_state to anon, authenticated;

drop policy if exists "Catalog is publicly readable" on public.catalog_state;
create policy "Catalog is publicly readable"
on public.catalog_state
for select
to anon, authenticated
using (true);

create table if not exists private.catalog_admin_config (
  singleton boolean primary key default true check (singleton),
  password_hash text not null
);

revoke all on table private.catalog_admin_config from public, anon, authenticated;

insert into private.catalog_admin_config (singleton, password_hash)
values (true, extensions.crypt('admin@arzana2024', extensions.gen_salt('bf')))
on conflict (singleton) do nothing;

create or replace function public.verify_catalog_admin(admin_password text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from private.catalog_admin_config
    where singleton = true
      and password_hash = extensions.crypt(admin_password, password_hash)
  );
$$;

revoke all on function public.verify_catalog_admin(text) from public;
grant execute on function public.verify_catalog_admin(text) to anon, authenticated;

create or replace function public.save_catalog(admin_password text, new_catalog jsonb)
returns timestamptz
language plpgsql
security definer
set search_path = ''
as $$
declare
  saved_at timestamptz := now();
begin
  if not public.verify_catalog_admin(admin_password) then
    raise insufficient_privilege using message = 'Invalid admin password';
  end if;

  if coalesce(jsonb_typeof(new_catalog), 'null') <> 'object'
    or coalesce(jsonb_typeof(new_catalog -> 'products'), 'null') <> 'array'
    or coalesce(jsonb_typeof(new_catalog -> 'categories'), 'null') <> 'array'
    or jsonb_array_length(new_catalog -> 'products') > 500
    or jsonb_array_length(new_catalog -> 'categories') > 100
    or pg_column_size(new_catalog) > 1000000 then
    raise invalid_parameter_value using message = 'Invalid catalog payload';
  end if;

  update public.catalog_state
  set data = new_catalog,
      updated_at = saved_at
  where id = 1;

  return saved_at;
end;
$$;

revoke all on function public.save_catalog(text, jsonb) from public;
grant execute on function public.save_catalog(text, jsonb) to anon, authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'catalog_state'
  ) then
    alter publication supabase_realtime add table public.catalog_state;
  end if;
end;
$$;

commit;
