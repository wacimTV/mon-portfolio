# La Grillade de Malpa — site web

Site vitrine d'un restaurant avec réservation en ligne, formulaire de contact et un espace admin.
HTML/CSS/JS statique + PHP/SQLite. Ça tourne sur n'importe quel hébergement mutualisé PHP 8.1+ (o2switch, OVH, Hostinger…), sans base MySQL à créer.

## Contenu du dossier

| Chemin | Rôle |
|---|---|
| `index.html` | La page : accueil, adresse et horaires, carte, grillades, réservation, contact |
| `confidentialite.html` | Page RGPD |
| `credits.html` | Crédits des photos provisoires |
| `api/reservation.php` | Reçoit les réservations, les enregistre, envoie un e-mail au restaurant et au client |
| `api/contact.php` | Reçoit les messages du formulaire de contact |
| `api/config.php` | **À remplir** : e-mails, mot de passe de l'admin |
| `admin/` | Espace restaurant : liste des réservations (confirmer / refuser / annuler, avec e-mail auto au client) et des messages |
| `data/` | Base SQLite (créée automatiquement, bloquée au public par `.htaccess`) |

## Avant la mise en ligne

1. **`api/config.php`** : mettre les vraies adresses e-mail (`restaurant_email`, `from_email` sur le domaine du site) et le hash du mot de passe admin :
   ```bash
   php -r "echo password_hash('MotDePasseSolide', PASSWORD_DEFAULT);"
   ```
2. **Les infos du client** dans `index.html` : horaires, prix de la carte, rue exacte (aujourd'hui, juste le quartier), et le domaine dans `<link rel="canonical">`.
3. **Les photos** : toutes les photos actuelles sont provisoires (Wikimedia Commons). Il faut les remplacer par les vraies : la façade, la salle vue depuis l'entrée, le grill en service, les plats, la terrasse. Puis supprimer `credits.html` et le lien qui y mène dans le pied de page.
4. Les formulaires envoient vers `/api/...` : le site doit être à la racine du domaine (sinon, adapter `data-endpoint` dans `index.html`).
5. Ne pas mettre en ligne `.taste-skill/`, `shots/`, `README.md`.

## Test en local

```bash
php -S localhost:8080
```
Puis http://localhost:8080 (site) et http://localhost:8080/admin/ (admin).
Mot de passe admin **de test** déjà réglé dans `api/config.php` : `malpa-test-2026`. **À remplacer avant la mise en ligne.**
En local les e-mails ne partent pas (pas de serveur SMTP sous Windows) : c'est normal, les réservations sont quand même enregistrées.

## Admin

`https://votre-domaine.fr/admin/` → mot de passe → réservations à venir / passées et messages.
