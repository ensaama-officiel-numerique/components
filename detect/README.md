## detect.js _ 20220305
* principe : librairie de composants de détection qui envoie un événement
* intégration : ajouter dans le head
```html
<script src="https://ensaama-officiel-numerique.github.io/components/detect/detect.js"></script>
```

### test
[handsdistz](./handsdistz.html)

### outils communs : trace VR (casque)
* paramètres trace et log selon les composants
```js
trace: { type: 'boolean', default: false}
```
* prequis : ajouter un a-text dans l'entity caméra pour afficher la trace
```html
<a-text id="txtlog" value="" align="center" color="#FF0000" 
    position="0 0 -1" rotation="0 0 0" scale="0.25 0.25 0.25">
</a-text>
```
* remarque : un parmètre log apparait sur certains composants pour un affichage console
* [exemple](./trace.html)

#### frequency
* objet : change la fréquence des boucles de rendu (nécessite moins de ressources)
* résultat : en particulier le suivi du joueur se fait à des intervalles plus espacés
* paramètres : 
```js
log: { type: 'boolean', default: false},
delay: { type: 'number', default: 1000 }
```
* syntaxe : 
```html
<a-scene frequency="delay: 500;"></a-scene>
```
* [exemple](./frequency.html)
    

#### currentposition
* objet : repère la position du player
```js
let player = { pos: { x: 0, y: 0, z: 0 },
               left: { x: 0, y: 0, z: 0 },
               right: { x: 0, y: 0, z: 0 },
} 
``` 
* résultat : affiche la position du joueur avec l'option trace
    - local (déplacement physique) 
    - world (déplacement dans l'espace virtuel comme avec le téléport)
* paramètres : 
```js
trace: { type: 'boolean', default: false}
```
* syntaxe : 
```html
<a-entity camera currentposition="trace: true;"></a-entity>
```
* remarque : un variable globale est crée
```js
let player = { pos: { x: 0, y: 0, z: 0 } }
console.log(player.pos.x);
```
* [exemple](./currentposition.html)

#### proximity
* objet : détecte la proximité du player à un objet
* paramètres :
```js
trace: { type: 'boolean', default: false },
seuils: { type: 'array', default: [1]},
```
* syntaxe : 
```html
<a-box id="boite" position="1 0 -2" rotation="0 45 0" color="silver"
    width="0.25" height="0.25" depth="0.25" 
    proximity="trace: true; seuils: 0.5, 1, 2">
</a-box>
```
* remarques : 
    - plusieurs seuils sont possibles (séparés par une vigule)
    - la zone la plus centrale est notée 0, puis 1, 2, en s'éloignant
    - en se rapprochant de l'objet, un événement 'enter-N' où N correspond à la zone
    - en s'éloignant de l'objet, un événement 'exit-N' où N correspond à la zone
* [exemple](./proximity.html)

#### head-height
* objet : envoie un event en fonction de la hauteur du casque
* paramètres :
```js
trace: { type: 'boolean', default: false },
seuils: { type: 'array', default: [1]},
```
* syntaxe : 
```html
<a-box id="boite" position="1 0 -2" rotation="0 45 0" color="silver"
    width="0.25" height="0.25" depth="0.25" 
    head-height="trace: true; seuils: 0.5, 1, 1.5">
</a-box>
```
* remarques : (même principe que proximity)
    - plusieurs seuils sont possibles (séparés par une vigule)
    - la zone la plus basse est notée 0, puis 1, 2, en remontant
    - quand le player se baisse, un événement 'heightdown-N' où N correspond à la zone
    - quand le player remonte, un événement 'heightup-N' où N correspond à la zone
    - les touches 'h' et 'b' permettent de tester sans casque, permettant d'augmenter ou baisser la hauteur dans l'exemple ci-dessous.
* [exemple](./headheight.html)

#### handsposition
* objet : repère la position des mains du player
* résultat : affiche la position des mains du joueur avec l'option trace
* paramètres : 
```js
trace: { type: 'boolean', default: false},
left: { type: 'string', default: 'gauche' },
right: { type: 'string', default: 'droite' }
```
* syntaxe : 
```html
<a-entity camera handsposition="trace: true;"></a-entity>
```
* remarque : 
    * utilise la variable globale player
    * les paramètres left et right sont les paramètres id des mains gauche et droite.
    * il est conseillé de choisir id="gauche" et id="droite"
* [exemple](./handsposition.html)

#### hands-height
* objet : envoie un event en fonction de la hauteur des manettes
* paramètres :
```js
trace: { type: 'boolean', default: false },
seuils: { type: 'array', default: [1]},
state: { type: 'string', default: '0' },
side: { type: 'string', default: 'right'}
```
* syntaxe : 
```html
<a-box id="boite" position="1 0 -2" rotation="0 45 0" color="silver"
    width="0.25" height="0.25" depth="0.25" 
    hands-height="trace: true; side: right; seuils: 0.5, 1, 1.5">
</a-box>
```
* remarques : (même principe que proximity)
    - plusieurs seuils sont possibles (séparés par une vigule)
    - la zone la plus basse est notée 0, puis 1, 2, en remontant
    - le paramètre side peut prendre 3 valeurs : left, right ou both (moyenne de left & right)
    - quand la manette se baisse, un événement 'SIDEdown-N' où N correspond à la zone, SIDE à la valeur de 'side'.
    - quand la manette remonte, un événement 'SIDEup-N' où N correspond à la zone, SIDE à la valeur de 'side'
    - les touches 'h' et 'b' permettent de tester sans manette, permettant d'augmenter ou baisser la hauteur dans l'exemple ci-dessous.
* [exemple](./handsheight.html)

#### hands-distz
* objet : envoie un event en fonction de la distance en z des manettes
* paramètres :
```js
trace: { type: 'boolean', default: false },
seuils: { type: 'array', default: [1]},
state: { type: 'string', default: '0' },
side: { type: 'string', default: 'right'}
```
* syntaxe : 
```html
<a-box id="boite" position="1 0 -2" rotation="0 45 0" color="silver"
    width="0.25" height="0.25" depth="0.25" 
    hands-distz="trace: true; side: right; seuils: 0.5, 1, 1.5">
</a-box>
```
* remarques : (même principe que proximity)
    - plusieurs seuils sont possibles (séparés par une vigule)
    - la zone la plus basse est notée 0, puis 1, 2, en remontant
    - le paramètre side peut prendre 3 valeurs : left, right ou both (moyenne de left & right)
    - quand la manette se baisse, un événement 'SIDEout-N' où N correspond à la zone, SIDE à la valeur de 'side'.
    - quand la manette remonte, un événement 'SIDEin-N' où N correspond à la zone, SIDE à la valeur de 'side'
    - les touches 'h' et 'b' permettent de tester sans manette, permettant d'augmenter ou baisser la distance en z dans l'exemple ci-dessous.
* [exemple](./handsdistz.html)



<!-- https://www.w3docs.com/snippets/javascript/how-to-create-and-trigger-event-in-javascript.html -->




    