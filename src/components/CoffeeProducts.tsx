import { products } from "@/lib/catalog";

const cartLink =
  "inline-flex shrink-0 items-center justify-center bg-accent font-body text-label-caps uppercase text-white shadow-sm transition-colors hover:bg-accent-hover";

export function CoffeeProducts({ className = "" }: { className?: string }) {
  return (
    <section
      id="sorta"
      className={`scroll-mt-20 bg-surface-container-low px-gutter py-space-lg md:border-b md:border-surface-container-highest md:bg-transparent md:px-gutter-desktop md:py-space-xl ${className}`}
    >
      <div className="mb-space-md flex flex-col gap-1 md:mb-space-xl md:flex-row md:items-end md:justify-between md:gap-space-md">
        <div>
          <span className="mb-1 block font-body text-label-caps uppercase text-secondary">
            Сезонное поступление
          </span>
          <h2 className="font-display text-headline-md text-on-surface md:text-headline-lg">
            Витрина сортов
          </h2>
          <p className="mt-1 font-body text-body-sm leading-relaxed text-on-surface-variant md:hidden">
            Свежая четверговая обжарка • Фасовка 250 г и дрипы
          </p>
        </div>
        <p className="hidden font-body text-label-meta uppercase text-on-surface-variant md:block">
          Свежая четверговая обжарка • Фасовка 250 г и дрипы
        </p>
      </div>

      <div className="flex flex-col gap-space-sm md:hidden">
        {products.map((product) => (
          <article
            key={product.name}
            className="flex flex-col gap-3 bg-surface p-space-md shadow-sm"
          >
            <div className="flex items-baseline justify-between gap-space-sm">
              <h3 className="font-display text-title-editorial text-on-surface">
                {product.name}
              </h3>
              <span className="shrink-0 font-display text-title-editorial font-semibold text-on-surface">
                {product.price} BYN
              </span>
            </div>
            <div className="flex items-center justify-between gap-space-sm">
              <p className="font-body text-body-sm italic text-on-surface-variant">
                {product.notes} • {product.amount}
              </p>
              <a href="#order-form" className={`${cartLink} h-8 px-3.5`}>
                Хочу
              </a>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden gap-gutter-desktop md:grid md:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <article
            key={product.name}
            className="flex flex-col justify-between border border-surface-container-high bg-surface p-space-lg transition-colors hover:border-outline-variant"
          >
            <div className="mb-space-lg">
              <h3 className="mb-space-xs font-display text-headline-md text-on-surface">
                {product.name}
              </h3>
              <p className="font-body text-body-md text-on-surface-variant">
                {product.notes} • {product.amount}
              </p>
            </div>
            <div className="flex items-center justify-between gap-space-sm border-t border-surface-container-high pt-space-md">
              <span className="font-display text-headline-md font-bold text-on-surface">
                {product.price} BYN
              </span>
              <a href="#order-form" className={`${cartLink} px-space-md py-2`}>
                В корзину
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
