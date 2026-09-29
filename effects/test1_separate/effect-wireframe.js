// version 20260926

// effect-wireframe
// bascule l'affichage wireframe des matériaux du modèle 3D (obj-model ou gltf-model)
// porté par l'entité, à chaque réception de l'event 'wireframe'
// schema "color" (optionnel) : force une couleur de wireframe, utile car en mode
// wireframe three.js n'affiche jamais la texture (map), seule mat.color compte.
// La couleur d'origine est sauvegardée puis restaurée pour ne pas teinter
// une texture (jpg/png) au retour en mode plein.
AFRAME.registerComponent('effect-wireframe', {
    schema: {
        color: {
            type: 'color',
            default: ''
        }
    },
    init: function () {
        var el = this.el;
        var forcedColor = this.data.color;

        el.addEventListener('wireframe', function () {
            var found = false;
            var processed = new Set(); // évite de traiter 2x un matériau partagé entre plusieurs meshes

            el.object3D.traverse(function (node) {
                if (!node.isMesh || !node.material) return;
                found = true;

                var materials = Array.isArray(node.material) ? node.material : [node.material];
                materials.forEach(function (mat) {
                    if (processed.has(mat.uuid)) return;
                    processed.add(mat.uuid);

                    mat.wireframe = !mat.wireframe;

                    if (forcedColor && mat.color) {
                        if (mat.wireframe) {
                            // sauvegarde la couleur d'origine avant de l'écraser
                            if (!mat.userData._originalColor) {
                                mat.userData._originalColor = mat.color.clone();
                            }
                            mat.color.set(forcedColor);
                        } else if (mat.userData._originalColor) {
                            // restaure la couleur d'origine (important si la texture est colorée)
                            mat.color.copy(mat.userData._originalColor);
                        }
                    }
                });
            });

            if (!found) {
                console.warn("effect-wireframe : aucun mesh trouvé sur '" + el.id + "' (modèle pas encore chargé ?)");
            }
        });
    }
});