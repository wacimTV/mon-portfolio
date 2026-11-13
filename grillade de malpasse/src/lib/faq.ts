import type { SiteData } from "@/lib/data";
import { hoursSummary } from "@/lib/hours";

/** FAQ locale — générée à partir des réglages pour rester toujours à jour. */
export function buildFaq(data: SiteData) {
  const { settings: s, hours, uberEats } = data;
  const h = hoursSummary(hours);
  const hoursText = h.map((x) => `${x.label.toLowerCase()} : ${x.value}`).join(", ");

  return [
    {
      q: "La viande est-elle halal ?",
      a: "Oui. Toutes les viandes servies à La Grillade de Malpa sont halal : sandwichs, assiettes, burgers et snacks.",
    },
    {
      q: "Jusqu'à quelle heure êtes-vous ouverts ?",
      a: `Nous sommes ouverts ${hoursText}. Idéal pour manger tard dans le 13e : vous pouvez venir sur place, commander à emporter ou vous faire livrer jusqu'à la fermeture.`,
    },
    {
      q: "Est-ce que vous livrez ?",
      a: uberEats
        ? `Oui, nous livrons via ${uberEats.name} (note ${String(s.uberRating).replace(".", ",")}/5, ${s.uberReviewCount} avis). Zones desservies : ${s.deliveryZones}. La disponibilité exacte dépend de votre adresse sur l'application.`
        : `Oui, la livraison est disponible. Zones desservies : ${s.deliveryZones}.`,
    },
    {
      q: "Peut-on commander à emporter ?",
      a: s.clickAndCollectEnabled
        ? `Oui. Vous pouvez commander en ligne via notre service Click & Collect sur la page /commander (paiement sur place) ou nous appeler au ${s.phone}, puis récupérer votre commande au ${s.street}, ${s.postalCode} ${s.city}.`
        : `Oui. Appelez-nous au ${s.phone} pour passer commande, puis venez la récupérer au ${s.street}, ${s.postalCode} ${s.city}.`,
    },
    {
      q: "Peut-on réserver pour un groupe ou un anniversaire ?",
      a: `Oui, vous pouvez réserver en ligne jusqu'à ${s.maxGuestsOnline} personnes. Pour un groupe plus grand ou une commande en quantité (anniversaire, événement, fin de match…), appelez-nous au ${s.phone} et précisez-le dans le message de réservation.`,
    },
    {
      q: "Comment venir en métro ?",
      a: `La station Malpassé du métro M1 est à proximité et relie directement le centre-ville de Marseille (Saint-Charles, Vieux-Port) en quelques minutes.${s.transportInfo ? ` ${s.transportInfo}` : ""}`,
    },
    {
      q: "Y a-t-il un parking ?",
      a: s.parkingInfo,
    },
    {
      q: "Est-ce adapté aux familles ?",
      a: "Bien sûr. Les assiettes 2 ou 3 viandes sont parfaites à partager, et la carte propose des burgers, nuggets et snacks que les enfants adorent. Les prix restent accessibles pour toute la famille.",
    },
  ];
}

