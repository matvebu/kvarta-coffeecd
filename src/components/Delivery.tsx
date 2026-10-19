export function Delivery({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <div className="bg-surface-container-low px-gutter py-space-lg md:bg-transparent md:p-0">
        <span className="font-body text-label-caps uppercase text-secondary">
          Брю-бар & Ростери
        </span>
        <h2 className="mt-1 font-display text-headline-md text-on-surface md:text-headline-lg">
          Минск, ул. Короля, 9
        </h2>
        <p className="mt-1 font-body text-body-sm text-on-surface-variant md:hidden">
          Тихий двор, кирпичный цех и кофейный спот.
        </p>
        <p className="mt-space-md hidden font-body text-body-md text-on-surface-variant md:block">
          Уютное пространство в историческом квартале. Свежий четверговый
          ростер в воронке V60, аэропрессе или эспрессо. Самовывоз пачек без
          ожидания доставки.
        </p>

        <div className="mt-space-sm flex flex-col gap-2 bg-surface p-space-md md:hidden">
          <div className="flex items-baseline justify-between gap-space-sm">
            <span className="font-body text-body-sm font-semibold text-on-surface">
              Самовывоз
            </span>
            <span className="font-body text-label-meta uppercase text-secondary">
              Бесплатно + эспрессо
            </span>
          </div>
          <p className="font-body text-body-sm text-on-surface-variant">
            Пн–пт 8:00–20:00, сб–вс 10:00–18:00
          </p>
          <div className="flex items-baseline justify-between gap-space-sm pt-2">
            <span className="font-body text-body-sm font-semibold text-on-surface">
              Курьер по Минску
            </span>
            <span className="font-body text-label-meta uppercase text-secondary">
              Каждую пятницу
            </span>
          </div>
          <p className="font-body text-body-sm text-on-surface-variant">
            Бесплатно от 50 BYN (иначе 5 BYN)
          </p>
        </div>

        <div className="mt-space-sm hidden space-y-space-xs pt-space-sm md:block">
          <div className="flex justify-between border-b border-surface-container-highest py-1 font-body text-body-md font-medium">
            <span className="text-on-surface-variant">Понедельник — Пятница</span>
            <span>8:00 – 20:00</span>
          </div>
          <div className="flex justify-between border-b border-surface-container-highest py-1 font-body text-body-md font-medium">
            <span className="text-on-surface-variant">Суббота — Воскресенье</span>
            <span>10:00 – 18:00</span>
          </div>
          <p className="pt-space-xs font-body text-label-meta text-on-surface-variant">
            Доставка курьером по пятницам от 50 BYN бесплатно. Отправка
            Европочтой по всей Беларуси.
          </p>
        </div>
      </div>
    </div>
  );
}
