import assert from "node:assert/strict";
import test from "node:test";

import { leadRequestSchema } from "../src/lib/lead";
import { normalizeBelarusPhone } from "../src/lib/phone";

const normalized = "+375291234567";

test("a valid Belarusian phone number is accepted", () => {
  for (const input of ["+375291234567", "+375 (29) 123-45-67", "291234567"]) {
    assert.equal(normalizeBelarusPhone(input), normalized);
  }

  const parsed = leadRequestSchema.safeParse({
    name: "Анна",
    phone: "+375 (29) 123-45-67",
    interest: "one_time",
    product: "Колумбия Уила",
    comment: "",
    company: "",
  });

  assert.equal(parsed.success, true);
  if (parsed.success) assert.equal(parsed.data.phone, normalized);
});

test("an invalid phone number is rejected", () => {
  for (const input of [
    "",
    "123",
    "телефон",
    "+79991234567",
    "+375991234567",
    "3752912345678",
    "++375291234567",
  ]) {
    assert.equal(normalizeBelarusPhone(input), null, input);
  }

  const parsed = leadRequestSchema.safeParse({
    name: "Анна",
    phone: "+79991234567",
    interest: "one_time",
    product: "Колумбия Уила",
    comment: "",
    company: "",
  });

  assert.equal(parsed.success, false);
});

test("supported phone formats normalize to the same number", () => {
  const formats = [
    "+375291234567",
    "375291234567",
    "80291234567",
    "+375 (29) 123-45-67",
    "8 (029) 123-45-67",
    "291234567",
    "  +375-29-123-45-67  ",
  ];

  for (const input of formats) {
    assert.equal(normalizeBelarusPhone(input), normalized, input);
  }
});
