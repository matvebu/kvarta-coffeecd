import Image from "next/image";

const quote =
  "«Кварта — независимая микрообжарочная в Минске. Мы жарим только свежие сезонные микролоты каждый четверг и доставляем в пятницу».";

const approach =
  "Мы не держим обжаренное зерно на складе про запас. Каждая чашка раскрывает максимальный природный потенциал терруара, чистоту обработки и естественную сладость свежего урожая.";

export function About({ className = "" }: { className?: string }) {
  return (
    <section
      id="o-nas"
      className={`scroll-mt-20 bg-surface-container px-4 py-space-lg min-[375px]:px-gutter md:border-b md:border-surface-container-highest md:bg-transparent md:px-gutter-desktop md:py-space-xl ${className}`}
    >
      <div className="relative mb-space-md aspect-[16/10] overflow-hidden md:hidden">
        <Image
          src="/images/cupping.jpg"
          alt="Каппинг свежеобжаренного кофе из крафтового пакета"
          fill
          unoptimized
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute right-2 bottom-2 bg-surface/90 px-2.5 py-1 backdrop-blur-sm">
          <span className="font-body text-[10px] uppercase tracking-wider text-on-surface">
            Probat UG15 • Короля, 9
          </span>
        </div>
      </div>
      <div className="md:mx-auto md:flex md:max-w-2xl md:flex-col md:items-center md:text-center">
        <span className="font-body text-label-caps uppercase text-secondary">
          Наш подход
        </span>
        <h2 className="mt-1 font-display text-headline-md leading-snug text-on-surface md:mb-space-md md:text-headline-lg md:italic">
          {quote}
        </h2>
        <p className="mt-2 font-body text-body-md leading-relaxed text-on-surface-variant md:mb-space-lg md:max-w-xl">
          {approach}
        </p>
        <div className="mt-space-lg hidden items-center justify-center gap-space-lg md:flex">
          <a
            href="#process"
            className="font-body text-label-caps uppercase text-on-surface underline decoration-secondary decoration-1 underline-offset-8 transition-colors hover:text-secondary"
          >
            О нас
          </a>
          <a
            href="#kontakty"
            className="font-body text-label-caps uppercase text-on-surface-variant transition-colors hover:text-on-surface"
          >
            Кофейня Короля, 9
          </a>
        </div>
      </div>
    </section>
  );
}
