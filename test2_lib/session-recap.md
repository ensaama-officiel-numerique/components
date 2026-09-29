# Synthèse de session — projet VR "vanité numérique"

## Contexte du projet

Expérience VR (A-Frame) évoquant la **vanité du numérique**, en écho aux vanités picturales classiques (crâne, sablier, fumée). Deux axes travaillés :

1. **L'obsolescence matérielle** — la machine qui tombe en panne (`effects-model.js`)
2. **La fragilité de la donnée** — une matière informationnelle qui peut disparaître d'une simple commande (`effects-vertices.js`)

Les effets sont déclenchés par des **events A-Frame** émis sur une entité portant un modèle 3D (`obj-model`), eux-mêmes envoyés via le composant `debug-keyboard` (touches clavier).

## Fichiers produits (tous dans `/mnt/user-data/outputs/` de cette conversation)

| Fichier | Contenu |
|---|---|
| `debug.js` | Composants de test/debug : `debug-cursor`, `debug-keyboard` (corrigé : `keydown`/`evt.key` au lieu de `keypress`/`keyCode`, `querySelectorAll` pour supporter id **et** classes), `debug-fuse`, `debug-hands` (ces 3 derniers inchangés depuis l'original) |
| `effects-model.js` | 6 composants sur le modèle : `model-wireframe`, `model-transparent`, `model-desappear`, `model-bluescreen`, `model-reboot`, `model-delete` |
| `effects-vertices.js` | 8 composants sur les vertices : `vertices`, `vertices-desappear`, `vertices-falling`, `vertices-glitch`, `vertices-corrupt`, `vertices-scatter`, `vertices-binary-rain`, `vertices-erosion` |
| `effects-doc.md` | Documentation complète des 14 composants (objet, event, paramètres, syntaxe) |
| `test_1_wireframe_obj_tree.html`, `test_3_obj_chair.html` | Fichiers de test (gérés par l'utilisateur pour l'intégration HTML) |

Convention : chaque composant `model-xxx` répond à l'event `xxx` ; chaque composant `vertices-xxx` répond à l'event `vertices-xxx` (sauf `vertices` lui-même, event `vertices`).

## Difficultés rencontrées et résolues (utile à se rappeler)

- **Materiau partagé entre sous-meshes** : un fichier `.obj` avec plusieurs groupes (`usemtl`) référant le **même** matériau (même `uuid`) fait que `traverse()` le visite plusieurs fois par event → un toggle s'annule silencieusement (parité paire = pas de changement visible). Corrigé par dédoublonnage via `Set` sur `mat.uuid` dans tous les effets qui traversent le modèle.
- **Z-fighting** : les sphères de vertices sont posées pile sur la surface (souvent semi-transparente) du modèle → `depthTest: false` + `renderOrder` élevé sur leur matériau.
- **`fetch()` du fichier `.obj`** nécessite un serveur http(s) (Live Server OK), jamais `file://`.
- **Échelle des paramètres** (`radius`, `amplitude`, etc.) : exprimée dans les unités locales du fichier `.obj`, donc affectée par le `scale` de l'entité — pas des mètres absolus.
- **`obj-model="obj: ..."`** peut être un sélecteur d'asset (`#id`) OU une URL directe : à gérer différemment (`querySelector` vs URL brute).
- Attention aux erreurs bêtes déjà rencontrées : nom de fichier avec tiret vs underscore, cache navigateur (toujours faire un hard-refresh après une modif de fichier `.js`), espaces dans les noms de fichiers 3D.

## Pistes non explorées / idées en réserve

D'autres idées avaient été évoquées mais pas implémentées, si l'envie revient :
- Fondu d'opacité **individuel** par sphère dans `vertices-binary-rain` (actuellement toutes les sphères/sprites d'un même effet partagent un seul matériau pour la performance — un fondu par sprite nécessiterait un matériau cloné par sprite, plus coûteux en mémoire selon le nombre de vertices).
- Possibilité d'ajouter d'autres effets modèle (ex. altération de couleur progressive façon patine/rouille) ou vertices, en suivant la même convention `model-xxx` / `vertices-xxx`.

## État actuel

Les 2 librairies sont complètes et documentées (`effects-doc.md`). L'utilisateur gère lui-même l'intégration dans ses fichiers HTML de test. Prochaine session : tests utilisateur des derniers effets (`vertices-binary-rain`, `vertices-erosion`), et éventuellement construction de la scène VR finale à partir de ces briques.
