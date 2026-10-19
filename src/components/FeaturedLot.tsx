import Image from "next/image";

const cta =
  "inline-flex items-center justify-center bg-accent px-space-md py-space-sm font-body text-label-caps uppercase text-white shadow-sm transition-colors hover:bg-accent-hover";

export function FeaturedLot({ className = "" }: { className?: string }) {
  return (
    <section
      id="process"
      className={`scroll-mt-24 border-b border-surface-container-highest px-gutter-desktop pt-space-xl pb-space-xl ${className}`}
    >
      <div className="grid grid-cols-1 items-center gap-gutter-desktop lg:grid-cols-12">
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-container shadow-sm lg:col-span-7">
          <Image
            src="/images/cupping.jpg"
            alt="Каппинг свежеобжаренного кофе в мастерской обжарки"
            fill
            unoptimized
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover transition-transform duration-700 hover:scale-[1.02]"
          />
        </div>
        <div className="lg:col-span-5 lg:pl-space-md">
          <span className="mb-space-xs block font-body text-label-caps uppercase text-secondary">
            Свежий лот в центре внимания
          </span>
          <h2 className="mb-space-xs font-display text-headline-lg text-on-surface">
            Эфиопия Иргачеффе
          </h2>
          <p className="mb-space-sm font-display text-body-lg italic text-secondary">
            Бергамот, жасмин, спелый белый персик
          </p>
          <p className="mb-space-md font-body text-body-md text-on-surface-variant">
            Мытая классика высокогорного региона Гедео. Высота произрастания
            1900–2100 м. Деликатный профиль обжарки под фильтр, воронку и чашку.
            Оценка Q: 87.5 SCA.
          </p>
          <div className="flex items-center gap-space-md pt-space-xs">
            <span className="font-display text-headline-md font-bold text-on-surface">
              32 BYN
            </span>
            <a href="#order-form" className={cta}>
              В корзину
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
