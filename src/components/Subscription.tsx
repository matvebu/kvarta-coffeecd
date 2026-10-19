import Image from "next/image";

const cta =
  "inline-flex items-center justify-center bg-accent text-center font-body text-label-caps uppercase text-white shadow-sm transition-colors hover:bg-accent-hover";

export function Subscription({ className = "" }: { className?: string }) {
  return (
    <section
      id="podpiska"
      className={`scroll-mt-20 bg-surface px-gutter py-space-lg md:bg-transparent md:px-gutter-desktop md:pt-space-xl md:pb-0 ${className}`}
    >
      <div className="grid grid-cols-1 items-center gap-space-md lg:grid-cols-12 lg:gap-gutter-desktop">
        <div className="order-2 md:order-1 lg:col-span-5 lg:pr-space-md">
          <div className="mb-1 flex items-center justify-between md:mb-space-xs md:block">
            <span className="font-body text-label-caps uppercase text-secondary">
              Кофейная подписка
            </span>
            <span className="font-display text-title-editorial font-semibold text-on-surface md:hidden">
              54 BYN / мес
            </span>
          </div>
          <h2 className="mb-2 font-display text-headline-md text-on-surface md:mb-space-sm md:text-headline-lg">
            2 пачки по 250 г каждый месяц
          </h2>
          <p className="mb-space-md font-body text-body-md leading-relaxed text-on-surface-variant md:hidden">
            Две свежие пачки каждую 1-ю и 3-ю неделю месяца. Бесплатная доставка
            курьером по пятницам до двери. Отмена или пауза в любой момент.
          </p>
          <p className="mb-space-md hidden font-body text-body-md text-on-surface-variant md:block">
            Регулярный свежий кофе прямо домой без лишних напоминаний. Каждые
            две недели обжариваем новые экспериментальные лоты и проверенную
            классику с карточками каппинга.
          </p>
          <div className="mb-space-md hidden items-baseline gap-space-xs md:flex">
            <span className="font-display text-display-lg text-on-surface">54</span>
            <span className="font-body text-label-caps uppercase text-on-surface-variant">
              Кофейная подписка
            </span>
          </div>
          <a
            href="#order-form"
            className={`${cta} h-12 w-full md:h-auto md:w-auto md:px-space-lg md:py-space-sm`}
          >
            Оформить подписку
          </a>
        </div>
        <div className="relative order-1 aspect-[16/10] overflow-hidden bg-surface-container shadow-sm md:order-2 md:aspect-[4/3] lg:col-span-7">
          <Image
            src="/images/subscription.jpg"
            alt="Минималистичные упаковки кофе Кварта на деревянном столе"
            fill
            unoptimized
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover transition-transform duration-700 hover:scale-[1.02]"
          />
          <div className="absolute right-2 bottom-2 bg-surface/90 px-2.5 py-1 backdrop-blur-sm md:hidden">
            <span className="font-body text-[10px] uppercase tracking-wider text-on-surface">
              Кварта Клуб
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
