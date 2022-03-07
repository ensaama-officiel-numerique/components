## detect.js _ 20220305
* principe : librairie de composants de détection qui envoie un événement
* intégration : ajouter dans le head
```html
<script src="https://eminet666.github.io/ensaama/components/detect/detect.js"></script>
```

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
let player = { pos: { x: 0, y: 0, z: 0 } }
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

<!-- https://www.w3docs.com/snippets/javascript/how-to-create-and-trigger-event-in-javascript.html -->




    