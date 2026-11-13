# Design — La Grillade de Malpa

Le site est **le tableau à lettres du comptoir** : un seul grand tableau de feutre noir rainuré, dans un cadre en bois, avec des lettres en plastique blanc enfoncées dans les rainures. On le lit de haut en bas comme le panneau d'une grillade.

## Tokens

| Rôle | Token | Valeur |
|---|---|---|
| Feutre (fond du tableau) | `--felt` | `#141312` |
| Rainure | `--felt-rib` | `#0c0b0a` |
| Reflet de rainure | `--felt-lift` | `#1d1b19` |
| Lettres | `--letter` | `#efeae0` |
| Lettres pâles (sous-titres, libellés) | `--letter-dim` | `#a8a196` |
| Braise : seule couleur chaude | `--ember` | `#ff5a1f` |
| Texte sur braise | `--ember-ink` | `#141312` |
| Cadre en bois | `--wood` | `#ad8a5d` |
| Mur derrière le tableau | `--wood-dark` | `#5d452a` |
| Pas des rainures | `--rib` | `8px` |
| Épaisseur du cadre | `--frame` | `16px` (10px sous 860px) |

## Règles

- **Une seule couleur chaude.** L'orange braise ne sert qu'aux prix et à l'action Réserver. Jamais en décor.
- **Tout sur les rainures.** Chaque hauteur de ligne est un multiple de 8px. Aucune lettre hors ligne.
- **Pas d'ombres.** La profondeur vient de l'empilement : mur, cadre, feutre, lettres, photos.
- **Un seul objet.** La page est un seul tableau. Les sections continuent sur le même feutre, séparées par de l'air et un fil de rainure, jamais par un nouveau cadre.
- **Lettres :** Archivo Narrow 700, en capitales, approche +0.08em (`.l`). Tailles : `.l-xl` (titre), `.l-lg` (titres de section, prix d'accueil), `.l-md` (lignes de carte, horaires), `.l-sm` (libellés).
- **Texte courant :** Archivo 400, 16 ou 20px, pour les phrases et les champs de saisie libre. Il n'imite pas les lettres du tableau.
- **Champs :** des cases de lettres, bord 2px couleur lettre, fond feutre, coins droits. Erreur : bord et message en braise.
- **Boutons :** braise pleine pour Réserver ; contour lettre pour les actions secondaires. Pression : descend de 2px.
- **Mouvement :** à l'arrivée, les lignes du tableau d'accueil sont posées une à une (90ms d'écart), la photo de braise apparaît. Rien d'autre ne bouge seul. Tout est coupé sous `prefers-reduced-motion`.
- **Bois :** la barre du haut et le pied de page sont les rails du cadre.

## Fichiers

- `assets/malpa.css` : tout le système.
- `assets/malpa.js` : listes de jours, rail d'accueil vers le formulaire, envoi des formulaires, barre mobile.
