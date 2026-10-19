import Image from "next/image";

const solidCta =
  "inline-flex items-center justify-center bg-accent text-center font-body text-label-caps uppercase text-white shadow-md transition-colors hover:bg-accent-hover";
const quietCta =
  "inline-flex items-center justify-center text-center font-body text-label-caps uppercase text-on-surface shadow-sm transition-colors";

export function Hero({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <section className="relative flex min-h-[580px] items-center justify-center overflow-hidden px-4 py-12 text-center min-[375px]:px-gutter md:h-[82vh] md:max-h-[820px] md:min-h-[580px] md:px-gutter-desktop md:py-0">
        <Image
          src="/images/hero.jpg"
          alt="Спелые кофейные ягоды на ветке органической фермы"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/45 backdrop-blur-[0.5px] md:bg-black/35 md:backdrop-blur-[1px]" />
        <div className="relative z-10 mx-auto flex max-w-[340px] flex-col items-center text-white md:max-w-4xl">
          <span className="mb-6 font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90 md:mb-space-sm md:text-label-caps md:tracking-[0.14em]">
            Микрообжарочная • Минск
          </span>
          <h1 className="mb-4 font-display text-[34px] leading-[1.12] tracking-tight md:mb-space-md md:text-display-lg md:leading-[1.08]">
            <span className="md:hidden">
              В четверг
              <br />
              жарим.
              <br />
              <span className="mt-1 block font-normal italic text-[#ffe4d6]">
                В пятницу
                <br />
                пьёте.
              </span>
            </span>
            <span className="hidden md:inline">
              В четверг жарим.
              <br />
              <span className="font-normal italic text-secondary-fixed">
                В пятницу пьёте.
              </span>
            </span>
          </h1>
          <p className="mb-8 max-w-[280px] font-body text-[14px] leading-relaxed text-white/95 md:mb-space-lg md:max-w-xl md:text-body-lg">
            Свежий спешелти кофе небольшими партиями с 2019 года. Минск.
          </p>
          <div className="flex w-full max-w-[240px] flex-col items-center gap-3 md:max-w-none md:flex-row md:flex-wrap md:justify-center md:gap-space-md">
            <a
              href="#sorta"
              className={`${solidCta} h-11 w-full px-space-lg py-space-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:h-auto md:w-auto`}
            >
              Каталог сортов
            </a>
            <a
              href="#podpiska"
              className={`${quietCta} h-11 w-full bg-surface-container-high/90 px-space-lg py-space-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary md:h-auto md:w-auto md:bg-surface/90 md:shadow-md md:backdrop-blur-sm md:hover:bg-surface`}
            >
              Подписка
            </a>
          </div>
        </div>
      </section>
      <div className="bg-surface text-center md:hidden">
        <a
          href="#o-nas"
          className="inline-flex min-h-11 items-center px-4 font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
        >
          Наш подход
        </a>
      </div>
    </div>
  );
}
