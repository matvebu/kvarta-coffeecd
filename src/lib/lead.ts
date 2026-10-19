import { z } from "zod";

import { products } from "@/lib/catalog";
import { normalizeBelarusPhone } from "@/lib/phone";
import type { LeadOrderType } from "@/types/lead";

const productNames = new Set(products.map((item) => item.name));

const phoneMessage = "Введите номер Беларуси, например +375 (29) 123-45-67";

export const duplicateLeadMessage =
  "Заказ с этим номером уже принят. Повторно отправить заявку можно через 10 минут.";

export const leadFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Введите имя")
    .max(120, "Имя не длиннее 120 символов"),
  phone: z
    .string()
    .trim()
    .min(1, "Введите номер телефона")
    .max(40, "Слишком длинный номер")
    .transform((value, context) => {
      const normalized = normalizeBelarusPhone(value);
      if (!normalized) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: phoneMessage,
        });
        return z.NEVER;
      }
      return normalized;
    }),
  interest: z
    .union([z.literal("one_time"), z.literal("subscription"), z.literal("")])
    .superRefine((value, context) => {
      if (value === "") {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Выберите тип заказа",
        });
      }
    })
    .transform((value, context) => {
      if (value === "one_time" || value === "subscription") return value;
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Выберите тип заказа",
      });
      return z.NEVER;
    }),
  product: z
    .string()
    .trim()
    .max(120, "Название сорта слишком длинное")
    .transform((value) => (value ? value : null))
    .refine((value) => value === null || productNames.has(value), {
      message: "Выберите сорт из списка",
    }),
  comment: z
    .string()
    .trim()
    .max(2000, "Комментарий не длиннее 2000 символов")
    .transform((value) => (value ? value : null)),
  company: z.string().transform((value) => value.trim().slice(0, 200)),
});

function optionalMeta(max: number) {
  return z.unknown().transform((value) => {
    if (typeof value !== "string") return null;
    const trimmed = value.trim();
    if (!trimmed || trimmed.length > max) return null;
    return trimmed;
  });
}

export const leadRequestSchema = leadFormSchema
  .and(
    z.object({
      utmSource: optionalMeta(200),
      utmMedium: optionalMeta(200),
      utmCampaign: optionalMeta(200),
      utmTerm: optionalMeta(200),
      utmContent: optionalMeta(200),
      referrer: optionalMeta(500),
      landingPath: optionalMeta(500),
    }),
  )
  .transform((data) => ({
    ...data,
    product: data.interest === "subscription" ? null : data.product,
  }));

export type LeadRequest = z.infer<typeof leadRequestSchema> & {
  interest: LeadOrderType;
};

export function leadFieldErrors(error: z.ZodError) {
  const fields = error.flatten().fieldErrors;
  const result: Record<string, string> = {};
  for (const [key, messages] of Object.entries(fields)) {
    const message = messages?.[0];
    if (message && key !== "company") result[key] = message;
  }
  return result;
}
