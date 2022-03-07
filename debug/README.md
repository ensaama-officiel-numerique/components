## debug.js _ 20220228
* principe : librairie de composants pour les tests et le debug
* intégration : ajouter dans le head
```html
<script src="https://eminet666.github.io/ensaama/components/debug/debug.js"></script>
```

### composant : debug-cursor
* objet : permet de tester les objets avec la souris
* résultat : envoi un event à une cible selon les actions 'mouseenter', 'mouseexit' et 'click'
* syntaxe : ajouter la ligne suivante à la scène   
```html     
<a-entity id="debug-cursor" 
          raycaster="objects: .collidable" 
          cursor="rayOrigin: mouse" 
          debug-cursor="detect: #boite-click-test, #boule-mouseenter-test2; log: false">
</a-entity>
```
* remarques : 
    - le paramètre 'rayOrigin: mouse' affecte à la souris le rayon de détection
    - utiliser la classe .collidable pour identifier les objets détectables
    - le paramètre detect peut prendre plusieurs paramètres séparés par une ','
    - chacun contient 3 éléments targetid-mouseaction-eventtosend séparés par un '-'
    - le paramètre 'all: true' affiche l'objet dans la console
* [exemple](./debug_cursor.html)

### composant : debug-keyboard
* objet : émettre des événement à partir de touches du clavier
* résultat : émet un événement donné vers une ciblée choisie
* syntaxe : 
```html     
<a-scene debug-keyboard="key: r, t; event: test, hello2; target: #boite, #boule">
<a-box id="boite" tourne="angle: 30"></a-box>
```

```javascript
        AFRAME.registerComponent('tourne', {
            init: function () {
                el = this.el;
                document.addEventListener('test', evt => {
                    el.setAttribute('rotation', '0 45 0');
                });
            }
        });
```
* commentaires : 
    - key, event et target sont à séparer par un virgule
    - il doit y avoir autant d'éléments pour chaque paramètre
    - ils se correspondent selon leur ordre 
    - par exemple ici : 
        - la touche 'r' envoie 'test' à l'id 'boite'
        - un composant ici 'tourne' sur 'boite' écoute l'event 'test' avec un addEventListener
* [exemple](./debug_keyboard.html)

### composant : debug-fuse
* objet : émettre des événement du fuse (action par le regard)
* résultat : un event est émis quand le fuse passe sur l'objet
* syntaxe : ajouter dans le body

```html   
<!-- définition du fuse  -->
<a-entity raycaster="objects: .collidable" cursor="fuse: true; fuseTimeout: 500" position="0 0 -1"
        geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.03" 
        material="color: black; shader: flat; opacity: 0.5">
</a-entity>

<a-box id="boite" class="collidable" position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9" 
        debug-fuse="event: test" random-color></a-box>
```
* commentaires : 
    - utiliser la classe .collidable pour identifier les objets détectables    
    - présciser en paramètre event le nom de l'event emis
    - le composant random-color joue le rôle du composant à tester
    - par exemple ici, le composant 'random-color' attend l'event 'test'
* [exemple](./debug_fuse.html)

### composant : debug-hands
* objet : émettre des événement avec les boutons X, Y, A, B des manettes
* résultat : un event est émis vers une target quand un bouton est pressé
* syntaxe : ajouter pour chaque hand
```html   
<a-entity id="left" raycaster="objects: .collidable; far:100;"
    oculus-touch-controls="hand: left" 
    debug-hands="trace: true;
                action: xbuttondown, xbuttonup; 
                event: Xdown, Xup;
                target: #boite, #boite;"></a-entity>
```
* commentaires :  
    - action, event et target sont à séparer par un virgule
    - il doit y avoir autant d'éléments pour chaque paramètre
    - ils se correspondent selon leur ordre 
* [exemple](./debug_hands.html)


