import assert from "node:assert/strict";
import test from "node:test";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const phoneA = "+375259900091";
const phoneALocal = "80259900091";
const phoneB = "+375259900092";
const normalizedA = "375259900091";
const normalizedB = "375259900092";
const api = "http://[::1]:3000/api/lead";

function supabase(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Missing Supabase environment");
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    realtime: {
      transport: class {
        readonly CONNECTING = 0;
        readonly OPEN = 1;
        readonly CLOSING = 2;
        readonly CLOSED = 3;
        readonly readyState = 3;
        readonly url = "";
        readonly protocol = "";
        onopen = null;
        onmessage = null;
        onclose = null;
        onerror = null;
        close() {}
        send() {}
        addEventListener() {}
        removeEventListener() {}
      },
    },
  });
}

function leadBody(phone: string, extra: Record<string, string> = {}) {
  return {
    name: "QA",
    phone,
    interest: "one_time",
    product: "Колумбия Уила",
    comment: "qa",
    company: "",
    utmSource: "qa",
    utmMedium: "cpc",
    utmCampaign: "qa-campaign",
    utmContent: "banner",
    utmTerm: "coffee",
    yclid: "qa-yclid",
    referrer: "https://example.test/search",
    landingPath: "/?utm_campaign=qa-campaign",
    landingPage: "https://kvarta.example/?utm_campaign=qa-campaign",
    ...extra,
  };
}

async function postLead(phone: string, extra?: Record<string, string>) {
  const response = await fetch(api, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(leadBody(phone, extra)),
  });
  const body = (await response.json()) as { ok?: boolean; error?: string; message?: string };
  return { status: response.status, body };
}

async function countPhones(db: SupabaseClient, phoneNormalized: string) {
  const { count, error } = await db
    .from("leads")
    .select("id", { count: "exact", head: true })
    .eq("phone_normalized", phoneNormalized);
  if (error) throw new Error(error.code ?? "count failed");
  return count ?? 0;
}

async function removePhones(db: SupabaseClient) {
  const { error } = await db
    .from("leads")
    .delete()
    .in("phone_normalized", [normalizedA, normalizedB]);
  if (error) throw new Error(error.code ?? "cleanup failed");
}

test("lead API stores, deduplicates, and accepts a lead after the window", async () => {
  const db = supabase();
  await removePhones(db);

  try {
    const invalid = await postLead("+79991234567");
    assert.equal(invalid.status, 400);
    assert.equal(invalid.body.ok, false);
    assert.equal(await countPhones(db, "79991234567"), 0);

    const created = await postLead("+375 (25) 990-00-91");
    assert.equal(created.status, 201, created.body.message);

    const { data: stored, error: readError } = await db
      .from("leads")
      .select(
        "created_at, phone, phone_normalized, utm_source, utm_medium, utm_campaign, utm_content, utm_term, yclid, referrer, landing_page, landing_path",
      )
      .eq("phone_normalized", normalizedA);
    if (readError) throw new Error(readError.code ?? "read failed");
    assert.equal(stored?.length, 1);
    assert.equal(stored?.[0]?.phone, phoneA);
    assert.equal(stored?.[0]?.phone_normalized, normalizedA);
    assert.equal(stored?.[0]?.utm_source, "qa");
    assert.equal(stored?.[0]?.utm_medium, "cpc");
    assert.equal(stored?.[0]?.utm_campaign, "qa-campaign");
    assert.equal(stored?.[0]?.utm_content, "banner");
    assert.equal(stored?.[0]?.utm_term, "coffee");
    assert.equal(stored?.[0]?.yclid, "qa-yclid");
    assert.equal(stored?.[0]?.referrer, "https://example.test/search");
    assert.equal(stored?.[0]?.landing_page, "https://kvarta.example/?utm_campaign=qa-campaign");
    assert.equal(stored?.[0]?.landing_path, "/?utm_campaign=qa-campaign");

    const localFormat = await postLead(phoneALocal, { name: "QA повтор" });
    assert.equal(localFormat.status, 409);
    assert.equal(await countPhones(db, normalizedA), 1);

    const concurrent = await Promise.all([postLead(phoneB), postLead(phoneB)]);
    const statuses = concurrent.map((result) => result.status).sort();
    assert.deepEqual(statuses, [201, 409]);
    assert.equal(await countPhones(db, normalizedB), 1);

    const createdAt = stored?.[0]?.created_at;
    if (!createdAt) throw new Error("missing created_at");
    const stale = new Date(new Date(createdAt).getTime() - 11 * 60 * 1000).toISOString();
    const { error: updateError } = await db
      .from("leads")
      .update({ created_at: stale })
      .eq("phone_normalized", normalizedA);
    if (updateError) throw new Error(updateError.code ?? "update failed");

    const afterWindow = await postLead(phoneA, { name: "QA позже" });
    assert.equal(afterWindow.status, 201, afterWindow.body.message);
    assert.equal(await countPhones(db, normalizedA), 2);
  } finally {
    await removePhones(db);
  }
});
