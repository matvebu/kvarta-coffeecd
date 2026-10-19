import {
  IconAbout,
  IconCafe,
  IconMail,
  IconNear,
  IconProcess,
} from "@/components/Icons";

const items = [
  { href: "#sorta", label: "Кофе", icon: IconCafe },
  { href: "#podpiska", label: "Подписка", icon: IconMail },
  { href: "#o-nas", label: "Процесс", icon: IconProcess },
  { href: "#o-nas", label: "О нас", icon: IconAbout },
  { href: "#kontakty", label: "Контакты", icon: IconNear },
];

export function MobileNav() {
  return (
    <nav
      aria-label="Мобильная навигация"
      className="fixed inset-x-0 bottom-0 z-50 bg-surface/95 shadow-[0_-2px_12px_rgba(0,0,0,0.04)] backdrop-blur-xl md:hidden"
    >
      <div className="flex h-16 items-center justify-around px-gutter">
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex min-h-11 min-w-14 flex-col items-center justify-center gap-0.5 text-on-surface-variant transition-colors hover:text-on-surface"
          >
            <item.icon />
            <span className="font-body text-[10px] uppercase tracking-[0.14em]">
              {item.label}
            </span>
          </a>
        ))}
      </div>
    </nav>
  );
}
