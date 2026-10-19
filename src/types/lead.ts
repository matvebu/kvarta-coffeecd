export type LeadOrderType = "one_time" | "subscription";

export type Lead = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  phone_normalized: string;
  order_type: LeadOrderType;
  product: string | null;
  comment: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  yclid: string | null;
  referrer: string | null;
  landing_path: string | null;
  landing_page: string | null;
};
