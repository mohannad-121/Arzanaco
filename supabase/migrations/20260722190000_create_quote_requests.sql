-- Run this migration in the Arzana Supabase SQL Editor before deploying the
-- quote-storage API. It does not modify public.catalog_state.

begin;

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.quote_requests (
  id uuid primary key default extensions.gen_random_uuid(),
  full_name text not null,
  company_name text not null,
  email text not null,
  phone text not null,
  product_ids jsonb not null default '[]'::jsonb,
  product_names jsonb not null default '[]'::jsonb,
  language text not null default 'en',
  email_status text not null default 'pending',
  whatsapp_status text not null default 'pending',
  submission_status text not null default 'received',
  email_provider_id text,
  error_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint quote_requests_language_check
    check (language in ('en', 'ar')),
  constraint quote_requests_email_status_check
    check (email_status in ('pending', 'sent', 'failed', 'configuration_error')),
  constraint quote_requests_whatsapp_status_check
    check (whatsapp_status in ('prepared', 'not_prepared')),
  constraint quote_requests_submission_status_check
    check (submission_status in ('received', 'completed', 'partially_completed', 'failed')),
  constraint quote_requests_product_ids_array_check
    check (jsonb_typeof(product_ids) = 'array' and jsonb_array_length(product_ids) > 0),
  constraint quote_requests_product_names_array_check
    check (jsonb_typeof(product_names) = 'array' and jsonb_array_length(product_names) > 0),
  constraint quote_requests_safe_error_code_check
    check (
      error_code is null
      or (char_length(error_code) <= 80 and error_code ~ '^[A-Z0-9_]+$')
    )
);

create index if not exists quote_requests_created_at_idx
  on public.quote_requests (created_at desc);

create index if not exists quote_requests_email_idx
  on public.quote_requests (email);

alter table public.quote_requests enable row level security;

revoke all on table public.quote_requests from public, anon, authenticated, service_role;
grant select, insert, update on table public.quote_requests to service_role;

commit;
