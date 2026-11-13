import type { Metadata } from "next";
import { getSiteData } from "@/lib/data";
import { breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { ContactSection } from "@/components/sections/ContactSection";

export const metadata: Metadata = {
  title: "Contact & Accès — 1 Av. de Valdonne, 13013 Marseille",
  description:
    "Contactez La Grillade de Malpa au 09 84 37 95 25 ou venez au 1 Avenue de Valdonne, 13013 Marseille (métro Malpassé M1). Ouvert 7j/7 de 11h à 1h.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const data = await getSiteData();
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Contact & accès", path: "/contact" }])} />
      <ContactSection data={data} headingLevel={1} />
    </>
  );
}

