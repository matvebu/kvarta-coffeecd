"use client";

import { products } from "@/lib/catalog";
import { useOrderSelection } from "@/components/OrderSelection";
import type { FormEvent } from "react";

const fieldClass =
  "w-full min-h-11 bg-surface-container-low px-3 font-body text-body-md text-on-surface outline-none transition-colors placeholder:text-outline focus:bg-surface-container focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary md:border md:border-surface-container-highest md:focus:bg-surface";

const labelClass =
  "font-body text-[10px] uppercase tracking-wider text-on-surface-variant md:text-label-caps";

export function LeadForm({ className = "" }: { className?: string }) {
  const { orderType, product, status, setOrderType, setProduct } =
    useOrderSelection();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

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

      <form className="flex flex-col gap-space-md" onSubmit={handleSubmit}>
        <p className="sr-only" aria-live="polite">
          {status}
        </p>
        <div className="grid grid-cols-1 gap-space-md md:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="client-name" className={labelClass}>
              Ваше имя
            </label>
            <input
              id="client-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Имя"
              className={fieldClass}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="client-phone" className={labelClass}>
              Телефон
            </label>
            <input
              id="client-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+375 (29) 000-00-00"
              className={fieldClass}
            />
          </div>
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className={labelClass}>Тип заказа</legend>
          <div className="grid grid-cols-1 gap-2 min-[375px]:grid-cols-2">
            <label className="flex min-h-11 cursor-pointer items-center gap-2 border border-surface-container-highest bg-surface-container-low px-3 font-body text-body-md has-checked:border-accent">
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
            <label className="flex min-h-11 cursor-pointer items-center gap-2 border border-surface-container-highest bg-surface-container-low px-3 font-body text-body-md has-checked:border-accent">
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
        </fieldset>

        <div className="flex flex-col gap-1">
          <label htmlFor="order-product" className={labelClass}>
            Сорт
          </label>
          <select
            id="order-product"
            name="product"
            value={product}
            disabled={orderType === "subscription"}
            onChange={(event) => setProduct(event.target.value)}
            className={`${fieldClass} disabled:cursor-not-allowed disabled:opacity-60`}
          >
            <option value="">Выберите сорт</option>
            {products.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="client-comment" className={labelClass}>
            <span className="md:hidden">Сорт или подписка</span>
            <span className="hidden md:inline">Лоты, помол или адрес</span>
          </label>
          <textarea
            id="client-comment"
            name="comment"
            rows={3}
            placeholder="Например: Эфиопия Иргачеффе (32 BYN), в зерне. Доставка в пятницу."
            className={`${fieldClass} resize-none py-2 md:min-h-24`}
          />
        </div>

        <div className="pt-space-xs">
          <button
            type="submit"
            className="flex min-h-12 w-full items-center justify-center bg-accent font-body text-label-caps uppercase text-white shadow-sm transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
          >
            Отправить заказ
          </button>
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
