"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";

import { useOrderSelection } from "@/components/OrderSelection";
import { products } from "@/lib/catalog";
import { duplicateLeadMessage, leadFormSchema } from "@/lib/lead";
import type { z } from "zod";

const fieldClass =
  "w-full min-h-11 border border-transparent bg-surface-container-low px-3 font-body text-body-md text-on-surface outline-none transition-colors placeholder:text-outline focus:bg-surface-container focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary aria-invalid:border-error md:border-surface-container-highest md:focus:bg-surface md:aria-invalid:border-error";

const labelClass =
  "font-body text-[10px] uppercase tracking-wider text-on-surface-variant md:text-label-caps";

type FormValues = {
  name: string;
  phone: string;
  interest: "" | "one_time" | "subscription";
  product: string;
  comment: string;
  company: string;
};

type Notice = {
  kind: "success" | "duplicate" | "error";
  message: string;
  fingerprint: string;
};

type LeadApiResponse = {
  ok: boolean;
  error?: "validation" | "duplicate" | "unavailable";
  message?: string;
  fieldErrors?: Record<string, string>;
};

function fingerprint(values: FormValues) {
  return JSON.stringify([
    values.name,
    values.phone,
    values.interest,
    values.product,
    values.comment,
  ]);
}

function readAttribution() {
  const params = new URLSearchParams(window.location.search);
  const pick = (key: string) => params.get(key) ?? "";
  return {
    utmSource: pick("utm_source"),
    utmMedium: pick("utm_medium"),
    utmCampaign: pick("utm_campaign"),
    utmTerm: pick("utm_term"),
    utmContent: pick("utm_content"),
    referrer: document.referrer,
    landingPath: `${window.location.pathname}${window.location.search}`,
  };
}

export function LeadForm({ className = "" }: { className?: string }) {
  const { orderType, product, status, setOrderType, setProduct } =
    useOrderSelection();
  const [notice, setNotice] = useState<Notice | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormValues, unknown, z.output<typeof leadFormSchema>>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      interest: "",
      product: "",
      comment: "",
      company: "",
    },
  });

  useEffect(() => {
    setValue("interest", orderType);
    setValue("product", orderType === "subscription" ? "" : product);
  }, [orderType, product, setValue]);

  const onSubmit = handleSubmit(
    async () => {
      const raw = getValues();
      const currentFingerprint = fingerprint(raw);
      if (
        notice &&
        notice.kind !== "error" &&
        notice.fingerprint === currentFingerprint
      ) {
        setNotice({
          kind: "duplicate",
          message: duplicateLeadMessage,
          fingerprint: currentFingerprint,
        });
        return;
      }

      try {
        const response = await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...raw,
            ...readAttribution(),
          }),
        });
        const body = (await response.json().catch(() => null)) as
          | LeadApiResponse
          | null;

        if (response.ok && body?.ok) {
          setNotice({
            kind: "success",
            message:
              "Заявка отправлена. Мы свяжемся с вами в течение 20 минут.",
            fingerprint: currentFingerprint,
          });
          return;
        }

        if (response.status === 409 || body?.error === "duplicate") {
          setNotice({
            kind: "duplicate",
            message: body?.message ?? duplicateLeadMessage,
            fingerprint: currentFingerprint,
          });
          return;
        }

        if (body?.fieldErrors) {
          for (const [field, message] of Object.entries(body.fieldErrors)) {
            if (field in raw) {
              setError(field as keyof FormValues, { message });
            }
          }
        }

        setNotice({
          kind: "error",
          message:
            body?.message ??
            "Не удалось отправить заявку. Проверьте соединение и попробуйте ещё раз.",
          fingerprint: currentFingerprint,
        });
      } catch {
        setNotice({
          kind: "error",
          message:
            "Не удалось отправить заявку. Проверьте соединение и попробуйте ещё раз.",
          fingerprint: currentFingerprint,
        });
      }
    },
    () => {
      setNotice(null);
    },
  );

  const nameField = register("name");
  const phoneField = register("phone");
  const commentField = register("comment");

  return (
    <div
      id="order-form"
      className={`scroll-mt-24 px-4 py-space-lg min-[375px]:px-gutter md:border md:border-surface-container-high md:bg-surface md:p-space-xl ${className}`}
    >
      <div className="mb-space-md">
        <span className="mb-1 block font-body text-label-caps uppercase text-secondary">
          Быстрый заказ
        </span>
        <h2 className="font-display text-headline-md text-on-surface">
          Оформить заказ зерна
        </h2>
        <p className="mt-1.5 font-body text-body-sm leading-relaxed text-on-surface-variant md:hidden">
          Согласуем заказ и помол в Telegram или по звонку в течение 20 минут.
        </p>
      </div>

      <form className="relative flex flex-col gap-space-md" onSubmit={onSubmit}>
        <p className="sr-only" aria-live="polite">
          {status}
          {notice ? ` ${notice.message}` : ""}
        </p>
        <Honeypot register={register("company")} />
        <div className="grid grid-cols-1 gap-space-md md:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="client-name" className={labelClass}>
              Ваше имя
            </label>
            <input
              id="client-name"
              type="text"
              autoComplete="name"
              placeholder="Имя"
              maxLength={120}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? "client-name-error" : undefined}
              className={fieldClass}
              {...nameField}
            />
            <FieldMessage id="client-name-error" message={errors.name?.message} />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="client-phone" className={labelClass}>
              Телефон
            </label>
            <input
              id="client-phone"
              type="tel"
              autoComplete="tel"
              placeholder="+375 (29) 000-00-00"
              maxLength={40}
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={errors.phone ? "client-phone-error" : undefined}
              className={fieldClass}
              {...phoneField}
            />
            <FieldMessage id="client-phone-error" message={errors.phone?.message} />
          </div>
        </div>

        <fieldset
          className="flex flex-col gap-2"
          aria-invalid={errors.interest ? true : undefined}
          aria-describedby={errors.interest ? "order-type-error" : undefined}
        >
          <legend className={labelClass}>Тип заказа</legend>
          <div className="grid grid-cols-1 gap-2 min-[375px]:grid-cols-2">
            <label className={`flex min-h-11 cursor-pointer items-center gap-2 border bg-surface-container-low px-3 font-body text-body-md has-checked:border-accent ${errors.interest ? "border-error" : "border-surface-container-highest"}`}>
              <input
                id="order-type-one-time"
                type="radio"
                name="orderType"
                value="one_time"
                checked={orderType === "one_time"}
                onChange={() => setOrderType("one_time")}
                className="size-4 accent-accent"
              />
              Разовый заказ
            </label>
            <label className={`flex min-h-11 cursor-pointer items-center gap-2 border bg-surface-container-low px-3 font-body text-body-md has-checked:border-accent ${errors.interest ? "border-error" : "border-surface-container-highest"}`}>
              <input
                id="order-type-subscription"
                type="radio"
                name="orderType"
                value="subscription"
                checked={orderType === "subscription"}
                onChange={() => setOrderType("subscription")}
                className="size-4 accent-accent"
              />
              Подписка
            </label>
          </div>
          <FieldMessage id="order-type-error" message={errors.interest?.message} />
        </fieldset>

        <div className="flex flex-col gap-1">
          <label htmlFor="order-product" className={labelClass}>
            Сорт
          </label>
          <select
            id="order-product"
            name="product"
            value={orderType === "subscription" ? "" : product}
            disabled={orderType === "subscription"}
            onChange={(event) => setProduct(event.target.value)}
            aria-invalid={errors.product ? true : undefined}
            aria-describedby={errors.product ? "order-product-error" : undefined}
            className={`${fieldClass} disabled:cursor-not-allowed disabled:opacity-60`}
          >
            <option value="">Выберите сорт</option>
            {products.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
          <FieldMessage id="order-product-error" message={errors.product?.message} />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="client-comment" className={labelClass}>
            <span className="md:hidden">Сорт или подписка</span>
            <span className="hidden md:inline">Лоты, помол или адрес</span>
          </label>
          <textarea
            id="client-comment"
            rows={3}
            placeholder="Например: Эфиопия Иргачеффе (32 BYN), в зерне. Доставка в пятницу."
            maxLength={2000}
            aria-invalid={errors.comment ? true : undefined}
            aria-describedby={errors.comment ? "client-comment-error" : undefined}
            className={`${fieldClass} resize-none py-2 md:min-h-24`}
            {...commentField}
          />
          <FieldMessage
            id="client-comment-error"
            message={errors.comment?.message}
          />
        </div>

        <div className="pt-space-xs">
          <button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting || undefined}
            className="flex min-h-12 w-full items-center justify-center bg-accent font-body text-label-caps uppercase text-white shadow-sm transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Отправляем…" : "Отправить заказ"}
          </button>
          {notice ? (
            <p
              className={`mt-space-xs text-center font-body text-[11px] leading-normal ${notice.kind === "success" ? "text-on-surface" : "form-error"}`}
              style={notice.kind === "success" ? undefined : { color: "#d32f2f" }}
              role="status"
            >
              {notice.message}
            </p>
          ) : null}
          <p className="mt-space-xs text-center font-body text-[11px] leading-normal text-outline md:hidden">
            Нажимая кнопку, вы соглашаетесь на связь по заказу
          </p>
          <p className="mt-space-xs hidden text-center font-body text-label-meta text-on-surface-variant md:block">
            Согласуем заказ и помол в Telegram или по звонку в течение 20 минут.
          </p>
        </div>
      </form>
    </div>
  );
}

function FieldMessage({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="form-error font-body text-[11px] leading-normal" style={{ color: "#d32f2f" }}>
      {message}
    </p>
  );
}

function Honeypot({ register }: { register: UseFormRegisterReturn<"company"> }) {
  return (
    <div className="absolute left-0 top-0 -z-10 h-px w-px overflow-hidden opacity-0" aria-hidden="true">
      <label htmlFor="lead-company">Компания</label>
      <input
        id="lead-company"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        {...register}
      />
    </div>
  );
}
