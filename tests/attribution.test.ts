import assert from "node:assert/strict";
import test from "node:test";

import { readFirstTouch } from "../src/lib/attribution";

const landing =
  "https://kvarta.example/?utm_source=yandex&utm_medium=cpc&utm_campaign=spring&utm_content=banner&utm_term=coffee&yclid=555&phone=%2B375291112233&name=Anna";

function memoryStorage() {
  const data = new Map<string, string>();
  return {
    getItem(key: string) {
      return data.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      data.set(key, value);
    },
  };
}

test("utm parameters are captured from the landing URL", () => {
  const attribution = readFirstTouch(memoryStorage(), {
    href: landing,
    referrer: "https://yandex.by/search?text=coffee",
  });

  assert.equal(attribution.utmSource, "yandex");
  assert.equal(attribution.utmMedium, "cpc");
  assert.equal(attribution.utmCampaign, "spring");
  assert.equal(attribution.utmContent, "banner");
  assert.equal(attribution.utmTerm, "coffee");
  assert.equal(attribution.yclid, "555");
  assert.equal(attribution.referrer, "https://yandex.by/search?text=coffee");
  assert.equal(
    attribution.landingPage,
    "https://kvarta.example/?utm_source=yandex&utm_medium=cpc&utm_campaign=spring&utm_content=banner&utm_term=coffee&yclid=555",
  );
  assert.equal(attribution.landingPage.includes("phone"), false);
  assert.equal(attribution.landingPage.includes("Anna"), false);
});

test("attribution survives navigation before submission", () => {
  const storage = memoryStorage();
  const first = readFirstTouch(storage, {
    href: landing,
    referrer: "https://yandex.by/",
  });

  const afterNavigation = readFirstTouch(storage, {
    href: "https://kvarta.example/catalog?utm_source=internal",
    referrer: "https://kvarta.example/",
  });

  assert.deepEqual(afterNavigation, first);
  assert.equal(afterNavigation.utmCampaign, "spring");
  assert.equal(afterNavigation.yclid, "555");
  assert.equal(
    afterNavigation.landingPage.startsWith("https://kvarta.example/?utm_source=yandex"),
    true,
  );
});

test("form fields stay out of the stored landing URL", () => {
  const attribution = readFirstTouch(memoryStorage(), {
    href: landing,
    referrer: "",
  });
  const payload = {
    name: "Анна",
    phone: "+375291112233",
    comment: "позвоните после 18",
    ...attribution,
  };

  assert.equal(payload.landingPage.includes(payload.name), false);
  assert.equal(payload.landingPage.includes("375291112233"), false);
  assert.equal(payload.landingPage.includes(payload.comment), false);
  assert.equal(payload.phone, "+375291112233");
});
