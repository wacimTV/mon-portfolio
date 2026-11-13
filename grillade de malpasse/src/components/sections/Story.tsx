import type { SiteData } from "@/lib/data";
import { PhotoSlot } from "@/components/PhotoSlot";
import { IconCheck } from "@/components/icons";

/** Notre histoire + texte local sur Malpassé et le 13e (SEO local). */
export function Story({ data }: { data: SiteData }) {
  return (
    <section id="histoire" aria-labelledby="histoire-title" className="py-20 sm:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center">
        <PhotoSlot
          src={data.settings.storyImage}
          alt="L'équipe et la devanture de La Grillade de Malpa, avenue de Valdonne à Malpassé"
          hint="Photo de l'équipe derrière le grill ou de la devanture"
          className="reveal aspect-[4/3] rounded-3xl"
        />
        <div className="reveal">
          <p className="eyebrow">Notre histoire</p>
          <h2 id="histoire-title" className="h2 mt-2">
            Un snack de quartier à Malpassé, ouvert à tous
          </h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-muted">
            <p>
              La Grillade de Malpa, c&apos;est l&apos;adresse grillade du quartier de Malpassé, au 1 avenue de
              Valdonne dans le 13e arrondissement de Marseille. Ici, la recette est simple&nbsp;: de la viande
              halal grillée à la commande, du pain frais, des crudités et des sauces au choix, servis avec le sourire.
            </p>
            <p>
              On vient chez nous en famille, entre amis, entre collègues à midi ou après une longue journée.
              Les étudiants y trouvent des menus à petit prix, les familles des assiettes à partager, et
              les couche-tard un repas chaud jusqu&apos;à 1h du matin.
            </p>
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "Viande 100 % halal",
              "Grillé à la commande",
              "Prix accessibles",
              "Accueil familial et convivial",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2 font-medium">
                <IconCheck className="size-5 text-amber-400" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-x mt-20">
        <div className="card reveal grain p-6 sm:p-10">
          <h2 className="font-display text-3xl font-bold uppercase sm:text-4xl">
            Où manger à Malpassé et dans le 13e&nbsp;?
          </h2>
          <div className="mt-5 grid gap-6 text-base leading-relaxed text-muted md:grid-cols-2">
            <p>
              Malpassé est un quartier vivant des quartiers nord-est de Marseille, dans le 13e arrondissement,
              entre Saint-Just, Saint-Jérôme et Frais-Vallon. Desservi par la station de métro Malpassé sur la
              ligne M1, il est à quelques minutes du centre-ville, ce qui en fait un point de rendez-vous
              pratique pour les habitants du 13e, du 14e et du 12e.
            </p>
            <p>
              Que vous habitiez le quartier, que vous travailliez dans le secteur ou que vous soyez simplement
              de passage, La Grillade de Malpa est l&apos;endroit idéal pour un sandwich grillade, une assiette
              de viandes grillées ou un burger halal. Et si vous préférez rester chez vous, on vous livre dans
              tout le secteur via Uber Eats.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

