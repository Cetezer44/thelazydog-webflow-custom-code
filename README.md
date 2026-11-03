# The Lazy Dog — custom code Webflow

Code JavaScript du site Webflow **The Lazy Dog**, servi par [jsDelivr](https://www.jsdelivr.com/) depuis ce repo.

## Ce que contient le repo

| Fichier | Rôle | Où il est appelé |
|---|---|---|
| `src/home/loader.js` | Loader « THE LAZY DOG » (Step 0 → 5), clignement de l'œil, révélation du H1 ligne par ligne, entrée de la navigation | Page d'accueil |
| `src/home/stickers.js` | Stickers du hero : chute avec gravité (Matter.js), glisser-déposer / lancer, showreel en obstacle | Page d'accueil |
| `src/home/eye.js` | Logo œil du header : l'image du sprite change selon la position du curseur | Page d'accueil |
| `src/home/showreel.js` | Showreel en boucle, curseur play/pause au survol, clic = lecture/pause | Page d'accueil |
| `src/global/cursor.js` | Curseur étoile (normal / survol / clic) en mode difference | Toutes les pages |
| `webflow/*.html` | Copies de référence des embeds qui restent dans Webflow (CSS + balisage du loader et du showreel) | — |

`dist/` contient les bundles générés : `home.js` / `home.min.js` et `global.js` / `global.min.js`.

## Dans Webflow

**Page d'accueil → Settings → Custom code → Before `</body>`**

```html
<script src="https://cdn.jsdelivr.net/gh/Cetezer44/thelazydog-webflow-custom-code@v1.0.0/dist/home.min.js"></script>
```

**Site settings → Custom code → Footer**

```html
<script src="https://cdn.jsdelivr.net/gh/Cetezer44/thelazydog-webflow-custom-code@v1.0.0/dist/global.min.js"></script>
```

Le loader a besoin de l'embed « Loader – The Lazy Dog » placé en haut du Body de la page d'accueil : il affiche le loader avant tout chargement de script (pas de flash de la page).

## Modifier le code

1. Modifier les fichiers dans `src/`.
2. `npm install` (une fois) puis `npm run build` pour régénérer `dist/`.
3. Commit, puis créer un nouveau tag de version :
   ```bash
   git tag v1.0.1 && git push origin main --tags
   ```
4. Dans Webflow, remplacer `@v1.0.0` par `@v1.0.1` dans les deux liens, puis publier.

Pourquoi un tag plutôt que `@main` : jsDelivr met les branches en cache jusqu'à 12 h, alors qu'une version taguée est servie tout de suite et ne change plus. Pour tester sans créer de tag, on peut utiliser `@main` puis vider le cache via `https://purge.jsdelivr.net/gh/Cetezer44/thelazydog-webflow-custom-code@main/dist/home.min.js`.

## Attributs utilisés dans Webflow

- Œil : `data-eye`, `data-eye-frames` (22), `data-eye-range` (distance en px pour l'image extrême), `data-eye-src` (sprite).
- Showreel : `data-reel`, `data-reel-src` (vidéo), `data-reel-poster` (image d'attente).
- Stickers (images dans `.tld-stickers`) : `data-sticker`, `data-x` (point de chute sur une largeur de 1440 px), `data-y` (position si « réduire les animations »), `data-w` (largeur en px à 1440), `data-rot` (rotation de départ). `data-matter-src` sur `.tld-stickers` permet de changer l'URL de Matter.js.
- Curseur : tout élément avec `data-cursor="hover"` déclenche l'état survol.
