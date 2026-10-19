-- Kvarta leads table.
-- Paste this entire file into the Supabase SQL Editor and run it once.

create or replace function public.normalize_phone(raw text)
returns text
language plpgsql
immutable
set search_path = public
as $$
declare
  digits text;
begin
  digits := regexp_replace(coalesce(raw, ''), '\D', '', 'g');

  -- Belarus: 375 + 9 digits, local 80 + 9 digits, or the 9-digit national number.
  if digits ~ '^80\d{9}$' then
    digits := '375' || substring(digits from 3);
  elsif digits ~ '^\d{9}$' then
    digits := '375' || digits;
  end if;

  return digits;
end;
$$;

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  phone_normalized text not null,
  order_type text not null,
  product text,
  comment text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  yclid text,
  referrer text,
  landing_path text,
  landing_page text,
  constraint leads_name_not_blank check (char_length(btrim(name)) between 1 and 120),
  constraint leads_phone_not_blank check (char_length(btrim(phone)) between 1 and 40),
  constraint leads_phone_normalized_format check (phone_normalized ~ '^375\d{9}$'),
  constraint leads_order_type_check check (order_type in ('one_time', 'subscription')),
  constraint leads_product_length check (product is null or char_length(product) <= 120),
  constraint leads_comment_length check (comment is null or char_length(comment) <= 2000),
  constraint leads_utm_source_length check (utm_source is null or char_length(utm_source) <= 200),
  constraint leads_utm_medium_length check (utm_medium is null or char_length(utm_medium) <= 200),
  constraint leads_utm_campaign_length check (utm_campaign is null or char_length(utm_campaign) <= 200),
  constraint leads_utm_term_length check (utm_term is null or char_length(utm_term) <= 200),
  constraint leads_utm_content_length check (utm_content is null or char_length(utm_content) <= 200),
  constraint leads_yclid_length check (yclid is null or char_length(yclid) <= 200),
  constraint leads_referrer_length check (referrer is null or char_length(referrer) <= 500),
  constraint leads_landing_path_length check (landing_path is null or char_length(landing_path) <= 500),
  constraint leads_landing_page_length check (landing_page is null or char_length(landing_page) <= 1000)
);

comment on table public.leads is
  'Coffee order requests. Writable only with the server secret key.';

comment on column public.leads.phone_normalized is
  'Digits only. Belarus numbers are stored as 375 followed by 9 digits.';

-- Supports the 10-minute duplicate lookup: phone_normalized = $1 and created_at > now() - interval.
create index leads_phone_normalized_created_at_idx
  on public.leads (phone_normalized, created_at desc);

create index leads_created_at_idx
  on public.leads (created_at desc);

-- Serializes concurrent inserts for the same phone, then rejects a second
-- lead when one already exists inside the last 10 minutes.
create or replace function public.leads_before_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.created_at := now();
  new.name := btrim(new.name);
  new.phone := btrim(new.phone);
  new.phone_normalized := public.normalize_phone(new.phone);

  if new.product is not null and btrim(new.product) = '' then
    new.product := null;
  end if;

  if new.comment is not null and btrim(new.comment) = '' then
    new.comment := null;
  end if;

  if new.phone_normalized !~ '^375\d{9}$' then
    raise exception 'phone must be a Belarus number'
      using errcode = 'check_violation';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(new.phone_normalized, 0));

  if exists (
    select 1
    from public.leads
    where phone_normalized = new.phone_normalized
      and created_at > now() - interval '10 minutes'
  ) then
    raise exception 'duplicate lead for this phone within 10 minutes'
      using errcode = 'unique_violation';
  end if;

  return new;
end;
$$;

create trigger leads_before_insert
  before insert on public.leads
  for each row
  execute function public.leads_before_insert();

alter table public.leads enable row level security;
alter table public.leads force row level security;

revoke all on table public.leads from public, anon, authenticated;
revoke all on function public.normalize_phone(text) from public, anon, authenticated;
revoke all on function public.leads_before_insert() from public, anon, authenticated;

grant all on table public.leads to service_role;

notify pgrst, 'reload schema';
