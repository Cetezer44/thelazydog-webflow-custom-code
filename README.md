# The Lazy Dog — custom code Webflow

Code JavaScript du site Webflow **The Lazy Dog**, servi par [jsDelivr](https://www.jsdelivr.com/) depuis ce repo.

## Ce que contient le repo

| Fichier | Rôle | Où il est appelé |
|---|---|---|
| `src/home/loader.js` | Loader « THE LAZY DOG » (Step 0 → 5), clignement de l'œil, révélation du H1 ligne par ligne, entrée de la navigation | Page d'accueil |
| `src/home/stickers.js` | Stickers du hero : chute avec gravité (Matter.js) dans le premier écran, showreel en obstacle, poussés par la souris au survol (tap = saut sur mobile). Au scroll ils sont éjectés par les côtés et ne retombent qu'en revenant tout en haut | Page d'accueil |
| `src/home/eye.js` | Logo œil du header : l'image du sprite change selon la position du curseur | Page d'accueil |
| `src/home/showreel.js` | Showreel en boucle, curseur play/pause au survol, clic = lecture/pause | Page d'accueil |
| `src/home/words.js` | Texte qui s'écrit mot par mot quand il entre dans l'écran (`[data-words]`) | Page d'accueil |
| `src/home/reveal.js` | Apparition des visuels projets par un masque de haut en bas (`.tld-work__media` ou `[data-reveal]`), puis du titre | Page d'accueil |
| `src/home/parallax.js` | Parallax au scroll : image dans son cadre (`[data-parallax]`) et décalage des cartes projets (`[data-speeds]`, `[data-speed]`) | Page d'accueil |
| `src/global/cursor.js` | Curseur étoile (normal / survol / clic) en mode difference | Toutes les pages |
| `webflow/*.html` | Copies de référence des embeds qui restent dans Webflow (CSS + balisage du loader et du showreel) | — |

`dist/` contient les bundles générés : `home.js` / `home.min.js` et `global.js` / `global.min.js`.

## Dans Webflow

**Page d'accueil → Settings → Custom code → Before `</body>`**

```html
<script src="https://cdn.jsdelivr.net/gh/Cetezer44/thelazydog-webflow-custom-code@a5ffea3cacec246793f25ac42519ae0b23edc63f/dist/home.min.js"></script>
```

**Site settings → Custom code → Footer**

```html
<script src="https://cdn.jsdelivr.net/gh/Cetezer44/thelazydog-webflow-custom-code@a5ffea3cacec246793f25ac42519ae0b23edc63f/dist/global.min.js"></script>
```

Le loader a besoin de l'embed « Loader – The Lazy Dog » placé en haut du Body de la page d'accueil : il affiche le loader avant tout chargement de script (pas de flash de la page).

## Modifier le code

1. Modifier les fichiers dans `src/`.
2. `npm install` (une fois) puis `npm run build` pour régénérer `dist/`.
3. Commit + push, puis figer la version : soit avec un tag (`git tag v1.0.1 && git push --tags`, ou une Release sur GitHub), soit en utilisant directement le hash du commit.
4. Dans Webflow, remplacer la référence après `@` dans les deux liens (hash du commit ou `v1.0.1`), puis publier.

Les liens actuels pointent sur le hash d'un commit : la version servie ne change jamais tant qu'on ne modifie pas le lien. On évite `@nom-de-branche` en production : jsDelivr met les branches en cache jusqu'à 12 h (purge possible via `https://purge.jsdelivr.net/gh/Cetezer44/thelazydog-webflow-custom-code@<branche>/dist/home.min.js`).

## Attributs utilisés dans Webflow

- Œil : `data-eye`, `data-eye-frames` (22), `data-eye-range` (distance en px pour l'image extrême), `data-eye-src` (sprite).
- Showreel : `data-reel`, `data-reel-src` (vidéo), `data-reel-poster` (image d'attente).
- Stickers (images dans `.tld-stickers`) : `data-sticker`, `data-x` (point de chute sur une largeur de 1440 px), `data-y` (position si « réduire les animations »), `data-w` (largeur en px à 1440), `data-rot` (rotation de départ). `data-scale` (taille), `data-gravity` (gravité), `data-bounce` (rebond), `data-push` (force de la souris) et `data-matter-src` sur `.tld-stickers` permettent de régler la physique et de changer l'URL de Matter.js.
- Texte mot par mot : `data-words` sur un paragraphe (le gras `<strong>` est conservé) ; `data-words-delay` (ms entre deux mots, 55) et `data-words-duration` (ms par mot, 500) en option.
- Parallax : `data-parallax="0.12"` sur un cadre `overflow: hidden` contenant une image (amplitude en fraction de la hauteur) ; `data-speeds="0,0.08,0,0.14,0.05"` sur une liste (une vitesse par enfant, en fraction de la hauteur d'écran) ou `data-speed` sur un élément. Désactivé sur mobile et si « réduire les animations ».
- Curseur : tout élément avec `data-cursor="hover"` déclenche l'état survol.
