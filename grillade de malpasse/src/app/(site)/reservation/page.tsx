import type { Metadata } from "next";
import { getSiteData } from "@/lib/data";
import { breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { ReservationSection } from "@/components/sections/ReservationSection";

export const metadata: Metadata = {
  title: "Réserver une Table — Restaurant Halal Marseille 13013",
  description:
    "Réservez votre table à La Grillade de Malpa (1 Av. de Valdonne, 13013 Marseille). Familles, amis et groupes. Créneaux 7j/7 de 11h00 à 00h30.",
  alternates: { canonical: "/reservation" },
};

export default async function ReservationPage() {
  const data = await getSiteData();
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Réserver une table", path: "/reservation" }])} />
      <ReservationSection data={data} headingLevel={1} />
    </>
  );
}

