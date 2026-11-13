# La Grillade de Malpa — Site officiel (Marseille 13013)

Site complet, rapide et optimisé SEO local pour **La Grillade de Malpa** (grillade & fast-food halal, 1 Avenue de Valdonne, 13013 Marseille — quartier de Malpassé).

## 1. Fonctionnalités principales

- **Accueil & Carte dynamique (`/`, `/carte`)** : indicateur temps réel *Ouvert maintenant / Fermé* (11h00–01h00 avec gestion du passage de minuit et des fermetures exceptionnelles), origine des viandes, 14 allergènes réglementaires (badges + légende), section *Nos formules* (affichée uniquement si au moins une formule est active).
- **Click & Collect à emporter (`/commander`)** : panier interactif avec prix figés en base (`Order` + `OrderItem`), créneaux de retrait toutes les 15 min (minimum 20 min après l'heure actuelle), paiement sur place, suivi en direct dans `/admin` avec rafraîchissement toutes les 30 s et signal sonore à chaque nouvelle commande. Interrupteur d'activation dans l'admin.
- **Réservation de table (`/reservation`)** : créneaux de 30 min (11h00–00h30), contrôle de la capacité maximale par créneau, emails de confirmation client et restaurant.
- **Pages SEO locales dédiées** :
  - `/livraison-marseille-13`
  - `/snack-ouvert-tard-marseille`
  - `/burger-halal-marseille-13`
  - `/restaurant-saint-jerome`
  - `/restaurant-frais-vallon`
  - `/restaurant-la-rose`
- **Affiche QR Code Avis Google (`/admin/qr-avis`)** : génération SVG 100 % côté serveur (sans service tiers), mise en page A5 prête à imprimer pour le comptoir.
- **Statistiques de visite sans cookies** : intégration optionnelle de Plausible ou Umami (`NEXT_PUBLIC_ANALYTICS_DOMAIN` ou `NEXT_PUBLIC_UMAMI_WEBSITE_ID`) avec suivi des événements *Appeler*, *Uber Eats*, *Itinéraire*, *Réservation envoyée* et *Commande envoyée*.

---

## 2. Installation en local

```bash
# 1. Installer les dépendances
npm install

# 2. Copier le fichier d'environnement et le configurer
cp .env.example .env

# 3. Appliquer les migrations SQLite et charger la carte initiale
npx prisma migrate dev
npx prisma db seed

# 4. Lancer le serveur de développement
npm run dev
```

Le site est accessible sur `http://localhost:3000` et l'espace d'administration sur `http://localhost:3000/admin`.

---

## 3. Variables d'environnement (`.env`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL publique sans `/` final (ex. `https://www.lagrilladedemalpa.fr`) |
| `DATABASE_URL` | Chemin SQLite (ex. `file:./data/grillade.db`) |
| `UPLOAD_DIR` | Dossier persistant pour les photos uploadées (`./data/uploads`) |
| `ADMIN_EMAIL` | Adresse email de connexion à `/admin` |
| `ADMIN_PASSWORD_HASH_B64` | Hash bcrypt encodé en Base64 du mot de passe admin |
| `SESSION_SECRET` | Chaîne aléatoire d'au moins 32 caractères pour signer les sessions |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` | Paramètres SMTP pour l'envoi des emails (réservations, commandes, contact) |
| `MAIL_FROM` | Expéditeur des emails (ex. `La Grillade de Malpa <no-reply@lagrilladedemalpa.fr>`) |
| `RESTAURANT_EMAIL` | Adresse qui reçoit les réservations, commandes Click & Collect et messages |
| `NEXT_PUBLIC_ANALYTICS_DOMAIN` | (Optionnel) Domaine Plausible Analytics — activé uniquement si renseigné |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | (Optionnel) ID de site Umami Analytics — activé uniquement si renseigné |

---

## 4. Créer ou changer le mot de passe administrateur

```bash
npm run admin:hash -- "VotreMotDePasseUltraSolide!"
```

Copiez la ligne `ADMIN_PASSWORD_HASH_B64="..."` affichée dans le terminal et collez-la dans votre fichier `.env`, ainsi que votre `ADMIN_EMAIL`.

---

## 5. Checklist de mise en ligne & Google Business Profile

1. **Dans `/admin` (Réglages & Carte)** :
   - Remplacez les emplacements *À REMPLACER PAR UNE VRAIE PHOTO* par de vraies photos du grill, de la salle et des plats.
   - Renseignez l'**origine des viandes** (par plat et/ou dans la mention générale en bas de carte) et cochez les **allergènes** de chaque plat.
   - Vérifiez les **coordonnées GPS** exactes (clic droit sur le restaurant dans Google Maps → copier `latitude` et `longitude`).
   - Ajoutez votre **lien court « Laisser un avis Google »**, puis imprimez l'affiche A5 depuis `/admin/qr-avis`.
   - Renseignez les liens **Instagram**, **Snapchat**, **Facebook** et **WhatsApp** si vous les utilisez (les champs vides restent masqués).
   - Créez vos **formules** réelles dans la section *Formules & promotions* si souhaité.
2. **Dans `/mentions-legales`** :
   - Complétez la raison sociale, le numéro SIRET/RCS et le nom de l'hébergeur.
3. **Sur Google Business Profile & TikTok (`@grillade.de.malpa`)** :
   - Gardez exactement le même nom (`La Grillade de Malpa`), adresse (`1 Avenue de Valdonne, 13013 Marseille`), téléphone (`09 84 37 95 25`) et horaires (`11:00 – 01:00` 7j/7).
   - Ajoutez les liens vers `/carte`, `/commander`, `/reservation` et Uber Eats.
