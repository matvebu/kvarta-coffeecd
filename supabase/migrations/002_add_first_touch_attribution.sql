-- First-touch attribution columns.
-- Paste this entire file into the Supabase SQL Editor and run it once.
-- Safe to run after 001_create_leads.sql. Existing rows keep null attribution.

alter table public.leads
  add column if not exists yclid text,
  add column if not exists landing_page text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'leads_yclid_length'
  ) then
    alter table public.leads
      add constraint leads_yclid_length
      check (yclid is null or char_length(yclid) <= 200);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'leads_landing_page_length'
  ) then
    alter table public.leads
      add constraint leads_landing_page_length
      check (landing_page is null or char_length(landing_page) <= 1000);
  end if;
end $$;

comment on column public.leads.yclid is
  'Yandex click id from the first page view in the browser tab.';

comment on column public.leads.landing_page is
  'Original landing URL from the first page view in the browser tab.';

notify pgrst, 'reload schema';
