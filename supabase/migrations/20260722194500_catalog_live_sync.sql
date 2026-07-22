-- Apply this migration to the same Supabase project configured in Vercel.
-- It replaces the legacy save_catalog RPC with the optimistic-concurrency
-- version used by the live catalog provider.

begin;

drop function if exists public.save_catalog(text, jsonb);

create function public.save_catalog(
  admin_password text,
  new_catalog jsonb,
  expected_updated_at timestamptz default null
)
returns table (data jsonb, updated_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
declare
  saved_at timestamptz := clock_timestamp();
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

  return query
  update public.catalog_state
  set data = new_catalog,
      updated_at = saved_at
  where id = 1
    and (expected_updated_at is null or catalog_state.updated_at = expected_updated_at)
  returning catalog_state.data, catalog_state.updated_at;

  if not found then
    raise exception using
      errcode = 'P0001',
      message = 'Catalog was changed by another administrator. Reload and try again.';
  end if;
end;
$$;

revoke all on function public.save_catalog(text, jsonb, timestamptz) from public;
grant execute on function public.save_catalog(text, jsonb, timestamptz) to anon, authenticated;

commit;
