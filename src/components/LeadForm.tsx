const fieldClass =
  "w-full bg-surface-container-low font-body text-body-md text-on-surface outline-none transition-colors placeholder:text-outline";

export function LeadForm({ className = "" }: { className?: string }) {
  return (
    <div
      id="order-form"
      className={`scroll-mt-24 px-gutter py-space-lg md:border md:border-surface-container-high md:bg-surface md:p-space-xl ${className}`}
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

      <form className="flex flex-col gap-space-md" action="#order-form">
        <div className="grid grid-cols-1 gap-space-md md:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="client-name"
              className="font-body text-[10px] uppercase tracking-wider text-on-surface-variant md:hidden"
            >
              Ваше имя
            </label>
            <label
              htmlFor="client-name-desktop"
              className="hidden font-body text-label-caps uppercase text-on-surface-variant md:block"
            >
              Ваше имя
            </label>
            <input
              id="client-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Имя"
              className={`${fieldClass} h-11 px-3 focus:bg-surface-container md:hidden`}
            />
            <input
              id="client-name-desktop"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Константин"
              className={`${fieldClass} hidden border border-surface-container-highest p-space-sm focus:bg-surface md:block`}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="client-phone"
              className="font-body text-[10px] uppercase tracking-wider text-on-surface-variant md:hidden"
            >
              Телефон
            </label>
            <label
              htmlFor="client-phone-desktop"
              className="hidden font-body text-label-caps uppercase text-on-surface-variant md:block"
            >
              Телефон
            </label>
            <input
              id="client-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+375 (29) 000-00-00"
              className={`${fieldClass} h-11 px-3 focus:bg-surface-container md:hidden`}
            />
            <input
              id="client-phone-desktop"
              name="phone"
              type="tel"
              autoComplete="tel"
              defaultValue="+375 "
              placeholder="+375 (29) 123-45-67"
              className={`${fieldClass} hidden border border-surface-container-highest p-space-sm focus:bg-surface md:block`}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1 md:hidden">
          <label
            htmlFor="client-notes"
            className="font-body text-[10px] uppercase tracking-wider text-on-surface-variant"
          >
            Сорт или подписка
          </label>
          <input
            id="client-notes"
            name="notes"
            type="text"
            placeholder="Например: Эфиопия Иргачеффе или Кварта Клуб"
            className={`${fieldClass} h-11 px-3 focus:bg-surface-container`}
          />
        </div>

        <div className="hidden flex-col gap-1 md:flex">
          <label
            htmlFor="client-comment"
            className="font-body text-label-caps uppercase text-on-surface-variant"
          >
            Лоты, помол или адрес
          </label>
          <textarea
            id="client-comment"
            name="comment"
            rows={3}
            placeholder="Например: Эфиопия Иргачеффе (32 BYN), в зерне. Доставка в пятницу."
            className={`${fieldClass} resize-none border border-surface-container-highest p-space-sm focus:bg-surface`}
          />
        </div>

        <div className="pt-space-xs">
          <button
            type="button"
            className="flex h-12 w-full items-center justify-center gap-2 bg-accent font-body text-label-caps uppercase text-white shadow-sm transition-colors hover:bg-accent-hover md:py-space-sm"
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
