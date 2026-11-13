/**
 * Génère le hash bcrypt (encodé en base64) d'un mot de passe admin.
 * Usage : npm run admin:hash -- "VotreMotDePasseSolide"
 */
import bcrypt from "bcryptjs";

const pwd = process.argv[2];
if (!pwd || pwd.length < 8) {
  console.error("Usage : npm run admin:hash -- \"VotreMotDePasse (8 caractères min)\"");
  process.exit(1);
}

const hash = bcrypt.hashSync(pwd, 12);
const b64 = Buffer.from(hash, "utf8").toString("base64");
console.log("\nAjoutez cette ligne dans votre fichier .env :\n");
console.log(`ADMIN_PASSWORD_HASH_B64="${b64}"\n`);

