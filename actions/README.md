## actions.js _ 20220303
* principe : librairie de composants d'actions en réception à un événement
* intégration : ajouter dans le head
```html
<script src="https://eminet666.github.io/ensaama/components/actions/actions.js"></script>
```

#### modify-objcolor
* objet : change la couleur d'un modele 3D exporté en glb avec Blender
* déclenchement : à réception d'un event 'modify-objcolor'
* paramètres :
```js
schema: {
    log: { type: 'boolean', default: false },
    objname: { type: 'string', default: "Cube"},
    newcolor: { type: 'string', default: "none"},
}
```
* syntaxe : 
```html
<a-entity modify-objcolor="objname: Suzanne; newcolor: red; log: true;"></a-entity>
```
* remarques : 
    - attention, l'objname correspond au nom d'objet dans la fenêtre Collection de Blender
    - si le paramètre 'newcolor' n'est pas renseigné, une couleur au hasard est attribuée
* [exemple](./modifiy-objcolor.html)


### composants : 

### composant : nom
* objet : 
* résultat : 
* syntaxe :  
```html     
```
* remarques : 
* [exemple]()