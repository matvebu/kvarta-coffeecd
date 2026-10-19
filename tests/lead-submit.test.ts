import assert from "node:assert/strict";
import test from "node:test";

import { submitLead, type LeadInsert } from "../src/lib/submit-lead";

function leadRequest(extra: Record<string, unknown> = {}) {
  return new Request("https://kvarta.example/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Анна",
      phone: "+375 (29) 111-22-33",
      interest: "one_time",
      product: "Колумбия Уила",
      comment: "",
      company: "",
      ...extra,
    }),
  });
}

function recordingClient() {
  const rows: LeadInsert[] = [];
  return {
    rows,
    client() {
      return {
        from(table: "leads") {
          assert.equal(table, "leads");
          return {
            insert(values: LeadInsert) {
              rows.push(values);
              return Promise.resolve({ error: null });
            },
          };
        },
      };
    },
  };
}

test("a lead is created with the expected campaign values", async () => {
  const recorder = recordingClient();
  const response = await submitLead(
    leadRequest({
      utmSource: "yandex",
      utmMedium: "cpc",
      utmCampaign: "spring",
      utmContent: "banner",
      utmTerm: "coffee",
      yclid: "555",
      referrer: "https://yandex.by/",
      landingPage:
        "https://kvarta.example/?utm_campaign=spring&phone=%2B375291112233",
      landingPath: "/?utm_campaign=spring&phone=%2B375291112233",
    }),
    recorder.client,
  );

  assert.equal(response.status, 201);
  assert.equal(recorder.rows.length, 1);
  assert.equal(recorder.rows[0]?.utm_source, "yandex");
  assert.equal(recorder.rows[0]?.utm_medium, "cpc");
  assert.equal(recorder.rows[0]?.utm_campaign, "spring");
  assert.equal(recorder.rows[0]?.utm_content, "banner");
  assert.equal(recorder.rows[0]?.utm_term, "coffee");
  assert.equal(recorder.rows[0]?.yclid, "555");
  assert.equal(recorder.rows[0]?.referrer, "https://yandex.by/");
  assert.equal(
    recorder.rows[0]?.landing_page,
    "https://kvarta.example/?utm_campaign=spring",
  );
  assert.equal(recorder.rows[0]?.landing_path, "/?utm_campaign=spring");
  assert.equal(recorder.rows[0]?.phone, "+375291112233");
  assert.equal(recorder.rows[0]?.landing_page?.includes("1112233"), false);
});

test("missing attribution does not block a valid submission", async () => {
  const recorder = recordingClient();
  const response = await submitLead(leadRequest(), recorder.client);

  assert.equal(response.status, 201);
  assert.equal(recorder.rows.length, 1);
  assert.equal(recorder.rows[0]?.utm_campaign, null);
  assert.equal(recorder.rows[0]?.utm_source, null);
  assert.equal(recorder.rows[0]?.yclid, null);
  assert.equal(recorder.rows[0]?.referrer, null);
  assert.equal(recorder.rows[0]?.landing_page, null);
  assert.equal(recorder.rows[0]?.landing_path, null);
  assert.equal(recorder.rows[0]?.name, "Анна");
});

test("oversized attribution is dropped and the lead is still created", async () => {
  const recorder = recordingClient();
  const response = await submitLead(
    leadRequest({
      utmCampaign: "c".repeat(201),
      yclid: "y".repeat(201),
      landingPage: `https://kvarta.example/?q=${"a".repeat(1200)}`,
    }),
    recorder.client,
  );

  assert.equal(response.status, 201);
  assert.equal(recorder.rows[0]?.utm_campaign, null);
  assert.equal(recorder.rows[0]?.yclid, null);
  assert.equal(recorder.rows[0]?.landing_page, null);
});
