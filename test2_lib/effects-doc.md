# Librairies d'effets A-Frame : effects-model.js / effects-vertices.js

Ces deux librairies fournissent des composants A-Frame déclenchés par des **events** (via `debug-keyboard` ou tout autre émetteur d'event sur l'entité). Elles s'appliquent à une entité portant un modèle 3D (`obj-model` ou `gltf-model`).

- **`effects-model.js`** : effets qui agissent directement sur le(s) matériau(x) du modèle 3D.
- **`effects-vertices.js`** : effets qui agissent sur des sphères (ou sprites) créées à la position de chaque vertex du fichier source, lu comme un fichier texte.

## Prérequis généraux

- La page doit être servie en **http(s)** (Live Server, etc.) — pas en `file://`, car certains effets font un `fetch()` du fichier `.obj` source.
- Les paramètres numériques comme `radius`, `amplitude`, `spread`, `distance`, `height` s'expriment dans les **unités locales du modèle** (celles du fichier `.obj`), pas en mètres absolus : si l'entité a un `scale` différent de `1 1 1`, ce facteur s'applique aussi à ces valeurs.
- Un composant `vertices-xxx` (sauf `vertices` lui-même) nécessite que l'event `vertices` ait déjà été déclenché au moins une fois sur la même entité, pour que les sphères existent.

---

# effects-model.js

Composants agissant sur le modèle 3D lui-même (son ou ses matériaux three.js).

## model-wireframe

**Objet** : bascule l'affichage filaire (wireframe) du modèle.
**Event déclencheur** : `wireframe` (toggle : rebascule à chaque déclenchement).

| Paramètre | Type | Défaut | Description |
|---|---|---|---|
| `color` | couleur | *(vide)* | Si renseigné, force cette couleur pour le rendu wireframe. La couleur d'origine du matériau est sauvegardée et restaurée automatiquement au retour en mode plein (utile pour ne pas teinter une texture). |

**Syntaxe** :
```html
model-wireframe
model-wireframe="color: #00ff00"
```

**Notes** : en mode wireframe, three.js n'affiche jamais la texture (`map`) du matériau, seule sa couleur compte — c'est un comportement normal du moteur, pas une limite du composant.

---

## model-transparent

**Objet** : bascule l'opacité du modèle entre pleine opacité et une valeur réduite.
**Event déclencheur** : `transparent` (toggle).

| Paramètre | Type | Défaut | Description |
|---|---|---|---|
| `opacity` | nombre (0-1) | `0.3` | Niveau d'opacité de l'état "transparent". |

**Syntaxe** :
```html
model-transparent="opacity: 0.3"
```

**Notes** : bascule instantanée, sans animation (contrairement à `model-desappear`).

---

## model-desappear

**Objet** : anime une baisse progressive de l'opacité du modèle jusqu'à une valeur donnée, puis revient à l'opacité pleine au prochain déclenchement.
**Event déclencheur** : `desappear` (toggle).

| Paramètre | Type | Défaut | Description |
|---|---|---|---|
| `opacity` | nombre (0-1) | `0.3` | Opacité cible de la disparition. |
| `duration` | nombre (ms) | `2000` | Durée de la transition. |

**Syntaxe** :
```html
model-desappear="opacity: 0.1; duration: 3000"
```

**Notes** : l'état caché/visible est mémorisé indépendamment de l'opacité réelle en cours d'animation — redéclencher l'event en pleine transition reste cohérent (repart vers la cible opposée).

---

## model-bluescreen

**Objet** : évoque une panne matérielle soudaine — flash bref d'une couleur d'alerte, puis extinction brutale et instantanée (sans transition), en contraste volontaire avec `model-desappear`.
**Event déclencheur** : `bluescreen`. Une fois le crash survenu, un second déclenchement restaure l'état d'origine (pour pouvoir retester), sans relancer le crash automatiquement.

| Paramètre | Type | Défaut | Description |
|---|---|---|---|
| `color` | couleur | `#0000aa` | Couleur du flash d'alerte (bleu façon écran bleu par défaut). |
| `duration` | nombre (ms) | `400` | Durée du flash avant l'extinction brutale. |

**Syntaxe** :
```html
model-bluescreen="color: #0000aa; duration: 400"
```

---

## model-reboot

**Objet** : clignotement on/off de toute l'entité, comme un vieil écran qui agonise, avant extinction finale.
**Event déclencheur** : `reboot`. Une fois éteint, un second déclenchement rallume tout (pour retester).

| Paramètre | Type | Défaut | Description |
|---|---|---|---|
| `duration` | nombre (ms) | `2000` | Durée totale de la séquence de clignotement avant extinction. |
| `frequency` | nombre (clignotements/s) | `8` | Vitesse du clignotement au départ. |
| `slowdown` | booléen | `true` | Si vrai, le clignotement ralentit progressivement vers la fin. Si faux, rythme constant jusqu'à l'extinction. |

**Syntaxe** :
```html
model-reboot="duration: 2000; frequency: 8; slowdown: true"
```

---

## model-delete

**Objet** : cache ou affiche instantanément toute l'entité (modèle et tout ce qui lui est rattaché, y compris d'éventuelles sphères de vertices), sans aucune transition.
**Event déclencheur** : `delete` (toggle).

Pas de paramètre.

**Syntaxe** :
```html
model-delete
```

---

# effects-vertices.js

Composants agissant sur des sphères (ou sprites) créées à partir des positions des vertices, lues directement dans le fichier `.obj` source.

## vertices

**Objet** : composant central de la librairie. Rend le modèle transparent, lit le fichier `.obj` comme du texte, en extrait les positions de vertices, et crée une sphère à chaque position.
**Event déclencheur** : `vertices` (toggle : un second déclenchement retire les sphères et restaure l'opacité d'origine du modèle).

| Paramètre | Type | Défaut | Description |
|---|---|---|---|
| `radius` | nombre | `0.001` | Rayon des sphères. |
| `color` | couleur | `#ffffff` | Couleur des sphères. |
| `opacity` | nombre (0-1) | `0.15` | Opacité du modèle pendant que les sphères sont affichées. |
| `ratio` | nombre (0-1) | `1` | Proportion des vertices utilisée (échantillonnage régulier, pas aléatoire). Utile si le modèle a beaucoup de points ou si plusieurs modèles utilisent ce composant. |

**Syntaxe** :
```html
vertices="radius: 0.02; color: white; opacity: 0.15; ratio: 0.1"
```

**Notes** : le fichier `.obj` n'est lu/parsé qu'une seule fois (mis en cache) ; les toggles suivants réutilisent les positions déjà extraites. Tous les composants `vertices-xxx` ci-dessous dépendent de ce composant sur la même entité.

---

## vertices-desappear

**Objet** : anime l'opacité des sphères de vertices (pas celle du modèle) jusqu'à une valeur donnée, puis revient à l'opacité pleine au prochain déclenchement.
**Event déclencheur** : `vertices-desappear` (toggle).

| Paramètre | Type | Défaut | Description |
|---|---|---|---|
| `opacity` | nombre (0-1) | `0.3` | Opacité cible. |
| `duration` | nombre (ms) | `2000` | Durée de la transition. |

**Syntaxe** :
```html
vertices-desappear="opacity: 0.1; duration: 3000"
```

**Notes** : toutes les sphères partagent un seul matériau (pour la performance), donc l'opacité s'applique à l'ensemble du nuage de points, pas sphère par sphère.

---

## vertices-falling

**Objet** : chaque sphère descend (en position locale y) jusqu'à `y=0`, comme des flocons qui tombent au sol.
**Event déclencheur** : `vertices-falling`. Aller simple (pas de toggle) — redéclencher fait retomber les sphères qui auraient été déplacées entre-temps.

| Paramètre | Type | Défaut | Description |
|---|---|---|---|
| `duration` | nombre (ms) | `2000` | Durée de la chute. |
| `destroy` | booléen | `false` | Si vrai, la sphère est supprimée une fois arrivée au sol (comme un flocon qui fond). |

**Syntaxe** :
```html
vertices-falling="duration: 3000; destroy: true"
```

---

## vertices-glitch

**Objet** : perturbation aléatoire et répétée de la position de chaque sphère pendant une courte durée, comme un artefact d'affichage avant une panne, puis retour exact à la position d'origine.
**Event déclencheur** : `vertices-glitch`. Rejouable à volonté sans dérive (chaque sphère revient précisément à sa position sauvegardée avant le glitch).

| Paramètre | Type | Défaut | Description |
|---|---|---|---|
| `amplitude` | nombre | `0.02` | Distance maximale de déplacement aléatoire à chaque saut. |
| `duration` | nombre (ms) | `800` | Durée totale du glitch. |
| `frequency` | nombre (sauts/s) | `60` | Nombre de sauts aléatoires par seconde. |

**Syntaxe** :
```html
vertices-glitch="amplitude: 0.02; duration: 800; frequency: 60"
```

---

## vertices-corrupt

**Objet** : déplace instantanément (sans animation) un pourcentage aléatoire de sphères, dans une direction arbitraire — évoque un bit qui bascule (bit-rot), sans notion de gravité contrairement à `vertices-falling`.
**Event déclencheur** : `vertices-corrupt` (toggle : un second déclenchement restaure exactement les sphères touchées, puis un nouveau lot aléatoire est corrompu au suivant).

| Paramètre | Type | Défaut | Description |
|---|---|---|---|
| `percentage` | nombre (0-1) | `0.1` | Proportion des sphères affectées à chaque déclenchement. |
| `amplitude` | nombre | `0.05` | Distance maximale du déplacement aléatoire. |

**Syntaxe** :
```html
vertices-corrupt="percentage: 0.1; amplitude: 0.05"
```

---

## vertices-scatter

**Objet** : chaque sphère monte et se disperse horizontalement de façon aléatoire, comme de la cendre qui se dissout — dissolution plutôt que chute (mouvement inverse de `vertices-falling`).
**Event déclencheur** : `vertices-scatter`. Aller simple, pas de toggle.

| Paramètre | Type | Défaut | Description |
|---|---|---|---|
| `duration` | nombre (ms) | `3000` | Durée de la montée. |
| `height` | nombre | `0.5` | Distance de montée verticale (avec une variation aléatoire jusqu'à ×1.5). |
| `spread` | nombre | `0.3` | Dispersion horizontale aléatoire maximale (x/z). |
| `destroy` | booléen | `true` | Si vrai, la sphère est supprimée une fois la dissolution terminée. |

**Syntaxe** :
```html
vertices-scatter="duration: 3000; height: 0.5; spread: 0.3; destroy: true"
```

---

## vertices-binary-rain

**Objet** : remplace visuellement l'idée des sphères statiques par une pluie continue de chiffres "0"/"1" façon Matrix, positionnés aux vertices et tombant en boucle.
**Event déclencheur** : `vertices-binary-rain` (toggle : démarre une animation continue ; un second déclenchement l'arrête et retire les sprites).

| Paramètre | Type | Défaut | Description |
|---|---|---|---|
| `ratio` | nombre (0-1) | `0.1` | Proportion des vertices utilisée. |
| `size` | nombre | `0.05` | Taille des sprites 0/1. |
| `color` | couleur | `#00ff00` | Couleur des chiffres. |
| `distance` | nombre | `0.3` | Hauteur de chute avant que chaque chiffre reboucle en haut. |
| `duration` | nombre (ms) | `2000` | Temps pour parcourir `distance` (détermine la vitesse de chute). |

**Syntaxe** :
```html
vertices-binary-rain="ratio: 0.1; size: 0.05; color: #00ff00; distance: 0.3; duration: 2000"
```

**Notes** : chaque chiffre démarre avec un décalage aléatoire pour éviter une chute synchronisée. Nécessite que `vertices` ait déjà été déclenché (pour avoir les positions en cache), même si les sphères elles-mêmes ne sont pas utilisées par cet effet.

---

## vertices-erosion

**Objet** : un pourcentage de sphères disparaît, chacune instantanément, mais à des instants étalés (et légèrement irréguliers) sur toute la durée — l'usure du temps plutôt qu'une commande unique.
**Event déclencheur** : `vertices-erosion`. Aller simple, pas de toggle.

| Paramètre | Type | Défaut | Description |
|---|---|---|---|
| `duration` | nombre (ms) | `5000` | Durée totale de l'érosion. |
| `percentage` | nombre (0-1) | `1.0` | Proportion des sphères qui finissent par disparaître. |
| `jitter` | nombre | `0.3` | Irrégularité du rythme de disparition (0 = métronomique, plus élevé = plus erratique). |

**Syntaxe** :
```html
vertices-erosion="duration: 5000; percentage: 1.0; jitter: 0.3"
```

---

# Tableau récapitulatif

| Composant | Event | Fichier | Toggle ? |
|---|---|---|---|
| `model-wireframe` | `wireframe` | effects-model.js | oui |
| `model-transparent` | `transparent` | effects-model.js | oui |
| `model-desappear` | `desappear` | effects-model.js | oui |
| `model-bluescreen` | `bluescreen` | effects-model.js | oui (après crash) |
| `model-reboot` | `reboot` | effects-model.js | oui (après extinction) |
| `model-delete` | `delete` | effects-model.js | oui |
| `vertices` | `vertices` | effects-vertices.js | oui |
| `vertices-desappear` | `vertices-desappear` | effects-vertices.js | oui |
| `vertices-falling` | `vertices-falling` | effects-vertices.js | non |
| `vertices-glitch` | `vertices-glitch` | effects-vertices.js | non (rejouable) |
| `vertices-corrupt` | `vertices-corrupt` | effects-vertices.js | oui |
| `vertices-scatter` | `vertices-scatter` | effects-vertices.js | non |
| `vertices-binary-rain` | `vertices-binary-rain` | effects-vertices.js | oui |
| `vertices-erosion` | `vertices-erosion` | effects-vertices.js | non |
