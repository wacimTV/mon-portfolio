import type { Metadata } from "next";
import { getSiteData } from "@/lib/data";
import { buildFaq } from "@/lib/faq";
import { faqJsonLd, menuJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Hero } from "@/components/sections/Hero";
import { MenuHighlights } from "@/components/sections/MenuHighlights";
import { OffersSection } from "@/components/sections/OffersSection";
import { Delivery } from "@/components/sections/Delivery";
import { Story } from "@/components/sections/Story";
import { Gallery } from "@/components/sections/Gallery";
import { Reviews } from "@/components/sections/Reviews";
import { ReservationSection } from "@/components/sections/ReservationSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Faq } from "@/components/sections/Faq";

export const metadata: Metadata = {
  title: {
    absolute: "Grillade halal Marseille 13013 · La Grillade de Malpa",
  },
  description:
    "Grillade et fast-food halal à Malpassé (1 Av. de Valdonne, 13013 Marseille) : sandwichs dès 10 €, assiettes, burgers et Uber Eats 7j/7 de 11h à 1h.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const data = await getSiteData();
  const faq = buildFaq(data);

  return (
    <>
      <JsonLd data={[menuJsonLd(data), faqJsonLd(faq)]} />
      <Hero data={data} />
      <MenuHighlights data={data} />
      <OffersSection offers={data.offers} />
      <Delivery data={data} />
      <Story data={data} />
      <Gallery data={data} />
      <Reviews data={data} />
      <ReservationSection data={data} />
      <ContactSection data={data} />
      <Faq items={faq} />
    </>
  );
}

