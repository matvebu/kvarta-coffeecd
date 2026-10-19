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
      <div className="mx-auto flex h-16 items-center justify-between gap-space-sm px-gutter md:h-20 md:gap-space-md md:px-gutter-desktop">
        <a href="#top" className="font-display text-headline-md tracking-tight text-on-surface md:text-headline-lg md:font-bold">
          Кварта
        </a>
        <nav className="hidden items-center gap-space-lg md:flex" aria-label="Разделы">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-body text-label-caps uppercase text-on-surface transition-colors hover:text-secondary"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <a
          href="#order-form"
          className="font-body text-label-caps uppercase text-on-surface transition-colors hover:text-secondary"
        >
          Корзина (0)
        </a>
      </div>
    </header>
  );
}
