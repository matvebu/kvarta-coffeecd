import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import { AttributionCapture } from "@/components/AttributionCapture";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const description =
  "Свежий спешелти кофе небольшими партиями с 2019 года. Жарим в четверг, доставляем в пятницу.";

function metadataBaseUrl() {
  const candidates = [
    process.env.SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    "http://localhost:3000",
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      return new URL(candidate);
    } catch {
      continue;
    }
  }

  return new URL("http://localhost:3000");
}

export const metadata: Metadata = {
  metadataBase: metadataBaseUrl(),
  title: "Кварта — микрообжарочная в Минске",
  description,
  openGraph: {
    title: "Кварта — микрообжарочная в Минске",
    description,
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: "/images/hero.jpg",
        width: 512,
        height: 286,
        alt: "Спелые кофейные ягоды на ветке органической фермы",
      },
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${inter.variable} ${playfair.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-body text-body-md text-on-surface selection:bg-[#e8e2d5] selection:text-[#1e1c14]">
        <AttributionCapture />
        {children}
      </body>
    </html>
  );
}
