/**
 * Données de départ (seed) — reprend EXACTEMENT les infos fournies par le restaurant.
 * Tout est ensuite modifiable depuis l'espace administrateur.
 * Lancer : npx prisma db seed
 */
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? "file:./data/grillade.db" }),
});

type SeedItem = { name: string; description?: string; price: number; featured?: boolean };

const menu: { name: string; slug: string; description: string; items: SeedItem[] }[] = [
  {
    name: "Sandwichs",
    slug: "sandwichs",
    description: "Pain frais garni de viande grillée halal, crudités et sauce au choix.",
    items: [
      {
        name: "Sandwich 1 viande",
        description: "Pain frais, salade, tomates, oignons, 1 viande, 1 sauce.",
        price: 10.0,
        featured: true,
      },
      {
        name: "Sandwich 2 viandes",
        description: "Pain frais, salade, tomates, oignons, 2 viandes, 1 sauce.",
        price: 12.5,
      },
    ],
  },
  {
    name: "Assiettes",
    slug: "assiettes",
    description: "Viandes grillées halal servies avec frites et salade. Idéal pour les grandes faims ou à partager.",
    items: [
      { name: "Assiette 1 viande", description: "1 viande au choix, frites, salade, 1 sauce.", price: 11.9 },
      {
        name: "Assiette 2 viandes",
        description: "2 viandes au choix, frites, salade, 1 sauce.",
        price: 15.5,
        featured: true,
      },
      {
        name: "Assiette 3 viandes",
        description: "3 viandes au choix, frites, salade, 1 sauce.",
        price: 19.5,
        featured: true,
      },
    ],
  },
  {
    name: "Burgers",
    slug: "burgers",
    description: "Burgers halal, seuls ou en menu.",
    items: [
      { name: "Burger simple", description: "", price: 5.85 },
      { name: "Menu burger", description: "Burger + frites + boisson.", price: 9.5, featured: true },
      { name: "Menu double burger", description: "Double burger + frites + boisson.", price: 11.9 },
    ],
  },
  {
    name: "Snacks & tex-mex",
    slug: "snacks-tex-mex",
    description: "À grignoter seul ou en plus de votre plat.",
    items: [
      { name: "Nems", price: 6.5 },
      { name: "Samboussa", price: 5.2 },
      { name: "Mozza sticks", price: 4.5 },
      { name: "Jalapeños", price: 4.5 },
      { name: "Bouchées camembert", price: 4.5 },
      { name: "Nuggets", price: 4.5 },
      { name: "Wings", price: 4.5 },
    ],
  },
  { name: "Accompagnements", slug: "accompagnements", description: "", items: [] },
  { name: "Boissons", slug: "boissons", description: "", items: [] },
  { name: "Desserts", slug: "desserts", description: "", items: [] },
];

async function main() {
  await prisma.setting.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });

  for (let d = 0; d < 7; d++) {
    await prisma.openingHour.upsert({
      where: { dayOfWeek: d },
      update: {},
      create: { dayOfWeek: d, openTime: "11:00", closeTime: "01:00" },
    });
  }

  if ((await prisma.deliveryPlatform.count()) === 0) {
    await prisma.deliveryPlatform.create({
      data: {
        name: "Uber Eats",
        url: "https://www.ubereats.com/fr/store/la-grillade-de-malpa/k7JqHQ-pVl69Op0rJu1ePg",
        sort: 0,
      },
    });
  }

  if ((await prisma.category.count()) === 0) {
    for (const [ci, cat] of menu.entries()) {
      await prisma.category.create({
        data: {
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          sort: ci,
          items: {
            create: cat.items.map((it, i) => ({
              name: it.name,
              description: it.description ?? "",
              priceCents: Math.round(it.price * 100),
              featured: it.featured ?? false,
              sort: i,
            })),
          },
        },
      });
    }
  }

  // Aucune formule/offre pré-remplie avec de faux prix : la table Offer reste vide par défaut.
  console.log("✔ Données initiales créées (carte, horaires, livraison).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

