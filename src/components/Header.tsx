const nav = [
  { href: "#sorta", label: "Сорта" },
  { href: "#podpiska", label: "Подписка" },
  { href: "#process", label: "Процесс" },
  { href: "#o-nas", label: "О нас" },
  { href: "#kontakty", label: "Контакты" },
];

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-surface/95 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-md">
      <div className="mx-auto flex h-16 min-w-0 items-center justify-between gap-2 px-4 min-[375px]:px-gutter md:h-20 md:gap-4 md:px-gutter-desktop lg:gap-space-lg">
        <a href="#top" className="inline-flex min-h-11 shrink-0 items-center font-display text-[22px] leading-none tracking-tight text-on-surface min-[375px]:text-headline-md md:text-[28px] lg:text-headline-lg lg:font-bold">
          Кварта
        </a>
        <nav className="hidden min-w-0 items-center gap-3 md:flex lg:gap-space-lg" aria-label="Разделы">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="inline-flex min-h-11 items-center font-body text-[10px] uppercase text-on-surface transition-colors hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary lg:text-label-caps"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <a
          href="#order-form"
          className="inline-flex min-h-11 shrink-0 items-center font-body text-[10px] uppercase text-on-surface transition-colors hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary min-[375px]:text-label-caps"
        >
          Корзина (0)
        </a>
      </div>
    </header>
  );
}
