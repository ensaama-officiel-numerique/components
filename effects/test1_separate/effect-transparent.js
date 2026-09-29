// version 20260926

// effect-transparent
// bascule la transparence des matériaux du modèle 3D (obj-model ou gltf-model)
// porté par l'entité, à chaque réception de l'event 'transparent'
// schema "opacity" : niveau d'opacité de l'état "transparent" (0 = invisible, 1 = opaque)
AFRAME.registerComponent('effect-transparent', {
    schema: {
        opacity: {
            type: 'number',
            default: 0.3
        }
    },
    init: function () {
        var el = this.el;
        var opacity = this.data.opacity;

        el.addEventListener('transparent', function () {
            console.log("effect-transparent : event 'transparent' reçu sur '" + el.id + "' (opacity=" + opacity + ")");
            var found = false;

            el.object3D.traverse(function (node) {
                if (!node.isMesh || !node.material) return;
                found = true;

                var materials = Array.isArray(node.material) ? node.material : [node.material];
                materials.forEach(function (mat) {
                    mat.transparent = true;
                    mat.opacity = (mat.opacity <= opacity) ? 1 : opacity;
                    mat.needsUpdate = true;
                });
            });

            if (!found) {
                console.warn("effect-transparent : aucun mesh trouvé sur '" + el.id + "' (modèle pas encore chargé ?)");
            }
        });
    }
});
