import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBar } from "@/components/layout/MobileBar";
import { JsonLd } from "@/components/JsonLd";
import { getSiteData } from "@/lib/data";
import { restaurantJsonLd } from "@/lib/seo";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const data = await getSiteData();
  return (
    <>
      <a
        href="#contenu"
        className="sr-only z-[60] rounded-full bg-amber-500 px-4 py-2 font-semibold text-coal-950 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Aller au contenu
      </a>
      <JsonLd data={restaurantJsonLd(data)} />
      <Header />
      <main id="contenu">{children}</main>
      <Footer />
      <MobileBar />
    </>
  );
}

