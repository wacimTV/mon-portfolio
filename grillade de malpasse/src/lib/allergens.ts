/**
 * Les 14 allergènes à déclaration obligatoire (Règlement UE INCO 1169/2011).
 */
export type AllergenCode =
  | "gluten"
  | "crustaces"
  | "oeufs"
  | "poissons"
  | "arachides"
  | "soja"
  | "lait"
  | "fruits-a-coque"
  | "celeri"
  | "moutarde"
  | "sesame"
  | "sulfites"
  | "lupin"
  | "mollusques";

export const ALLERGENS: { code: AllergenCode; label: string; short: string }[] = [
  { code: "gluten", label: "Gluten", short: "GLU" },
  { code: "crustaces", label: "Crustacés", short: "CRU" },
  { code: "oeufs", label: "Œufs", short: "OEU" },
  { code: "poissons", label: "Poissons", short: "POI" },
  { code: "arachides", label: "Arachides", short: "ARA" },
  { code: "soja", label: "Soja", short: "SOJ" },
  { code: "lait", label: "Lait / lactose", short: "LAI" },
  { code: "fruits-a-coque", label: "Fruits à coque", short: "COQ" },
  { code: "celeri", label: "Céleri", short: "CEL" },
  { code: "moutarde", label: "Moutarde", short: "MOU" },
  { code: "sesame", label: "Graines de sésame", short: "SES" },
  { code: "sulfites", label: "Sulfites", short: "SUL" },
  { code: "lupin", label: "Lupin", short: "LUP" },
  { code: "mollusques", label: "Mollusques", short: "MOL" },
];

export function parseAllergens(raw: string | null | undefined) {
  if (!raw) return [];
  const codes = new Set(
    raw
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
  return ALLERGENS.filter((a) => codes.has(a.code));
}

