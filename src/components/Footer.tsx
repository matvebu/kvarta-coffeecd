import { IconArrow } from "@/components/Icons";
import { SubscriptionCta } from "@/components/OrderSelection";

export function Footer() {
  return (
    <footer className="bg-surface-container-low text-on-surface">
      <div className="px-4 py-space-lg min-[375px]:px-gutter md:hidden">
        <div className="flex flex-col gap-space-md">
          <div className="flex items-baseline justify-between">
            <span className="font-display text-headline-md font-normal text-on-surface">
              Кварта
            </span>
            <span className="font-body text-label-caps uppercase text-secondary">
              Обжарка
            </span>
          </div>
          <div className="flex flex-col gap-1 font-body text-body-sm text-on-surface-variant">
            <p className="font-medium text-on-surface">Минск, ул. Короля, 9</p>
            <p>Режим работы: пн–пт 8:00–20:00, сб–вс 10:00–18:00</p>
            <p className="text-secondary">Доставка по Минску по пятницам</p>
          </div>
          <p className="pt-space-sm font-body text-label-meta text-outline">
            © 2019—2025 Кварта Ростери. Обжариваем в Минске.
          </p>
        </div>
      </div>

      <div className="mx-auto hidden px-gutter-desktop pt-space-xl pb-space-lg md:block">
        <div className="grid grid-cols-2 gap-gutter-desktop lg:grid-cols-4">
          <div className="flex flex-col gap-space-sm">
            <span className="font-body text-label-caps uppercase text-secondary">
              Локация
            </span>
            <div className="font-display text-title-editorial text-on-surface">
              Минск, ул. Короля, 9
            </div>
            <p className="font-body text-body-sm text-on-surface-variant">
              Микро-ростери и брю-бар в историческом центре Минска. Свежие лоты
              прямо из ростера Probat.
            </p>
          </div>
          <div className="flex flex-col gap-space-sm">
            <span className="font-body text-label-caps uppercase text-secondary">
              График работы
            </span>
            <div className="flex flex-col gap-1 font-body text-body-md text-on-surface">
              <div className="flex items-baseline justify-between gap-space-sm">
                <span className="font-body text-label-meta uppercase text-on-surface-variant">
                  Пн — Пт
                </span>
                <span className="font-body text-body-sm">8:00 – 20:00</span>
              </div>
              <div className="flex items-baseline justify-between gap-space-sm">
                <span className="font-body text-label-meta uppercase text-on-surface-variant">
                  Сб — Вс
                </span>
                <span className="font-body text-body-sm">10:00 – 18:00</span>
              </div>
            </div>
            <p className="mt-space-xs font-body text-body-sm text-on-surface-variant">
              Фильтр-кофе, эспрессо и калибровка под домашние воронки.
            </p>
          </div>
          <div className="flex flex-col gap-space-sm">
            <span className="font-body text-label-caps uppercase text-secondary">
              Доставка
            </span>
            <div className="font-body text-body-md text-on-surface">
              Каждую пятницу курьером
            </div>
            <p className="font-body text-body-sm text-on-surface-variant">
              Бесплатная доставка по Минску при заказе от 50 BYN. Отправка
              Европочтой по всей Беларуси на следующий день после обжарки.
            </p>
          </div>
          <div className="flex flex-col gap-space-sm">
            <span className="font-body text-label-caps uppercase text-secondary">
              Подписка на обжарку
            </span>
            <p className="font-body text-body-sm text-on-surface-variant">
              Две или четыре пачки сезонного зерна каждого 1-го и 3-го четверга
              месяца с заметками обжарщика.
            </p>
            <SubscriptionCta className="w-fit gap-space-xs bg-transparent font-body text-label-meta uppercase text-secondary shadow-none transition-colors hover:text-[#752806]">
              Оформить подписку
              <IconArrow />
            </SubscriptionCta>
          </div>
        </div>
        <div className="mt-space-xl flex flex-col items-center justify-between gap-space-sm border-t border-surface-container-highest pt-space-md font-body text-label-meta text-on-surface-variant sm:flex-row">
          <div className="flex items-center gap-space-sm">
            <span>© 2024 Кварта Ростери</span>
            <span>•</span>
            <span>Минск</span>
          </div>
          <div className="flex items-center gap-space-md">
            <span className="font-body text-label-caps uppercase text-secondary">
              Свежий урожай 2023/2024
            </span>
            <a href="#o-nas" className="transition-colors hover:text-on-surface">
              Манифест основателей
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
