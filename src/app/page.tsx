import { About } from "@/components/About";
import { CoffeeProducts } from "@/components/CoffeeProducts";
import { Delivery } from "@/components/Delivery";
import { FeaturedLot } from "@/components/FeaturedLot";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { LeadForm } from "@/components/LeadForm";
import { MobileNav } from "@/components/MobileNav";
import { OrderSelectionProvider } from "@/components/OrderSelection";
import { Subscription } from "@/components/Subscription";

export default function Home() {
  return (
    <OrderSelectionProvider>
    <div id="top" className="flex min-w-0 flex-1 flex-col overflow-x-clip pb-16 md:pb-0">
      <Header />
      <main className="flex flex-1 flex-col bg-background pt-16 md:pt-20">
        <Hero className="order-1" />
        <CoffeeProducts className="order-2 md:order-5" />
        <Subscription className="order-3" />
        <About className="order-4 md:order-2" />
        <FeaturedLot className="order-5 hidden md:order-4 md:block" />
        <section
          id="kontakty"
          className="order-6 scroll-mt-20 md:px-gutter-desktop md:py-space-xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-gutter-desktop">
            <Delivery className="lg:col-span-5" />
            <LeadForm className="lg:col-span-7" />
          </div>
        </section>
      </main>
      <Footer />
      <MobileNav />
    </div>
    </OrderSelectionProvider>
  );
}
