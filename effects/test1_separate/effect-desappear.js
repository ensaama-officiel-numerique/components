// version 20260926

// effect-desappear
// fait baisser progressivement l'opacité des matériaux du modèle 3D (obj-model ou gltf-model)
// porté par l'entité, jusqu'à "opacity", pendant "duration" (ms), à chaque réception de l'event 'desappear'
AFRAME.registerComponent('effect-desappear', {
    schema: {
        opacity: {
            type: 'number',
            default: 0.3
        },
        duration: {
            type: 'number',
            default: 2000
        }
    },
    init: function () {
        var el = this.el;
        var data = this.data;

        el.addEventListener('desappear', function () {
            var found = false;
            var processed = new Set(); // évite de lancer plusieurs animations sur un matériau partagé

            el.object3D.traverse(function (node) {
                if (!node.isMesh || !node.material) return;
                found = true;

                var materials = Array.isArray(node.material) ? node.material : [node.material];
                materials.forEach(function (mat) {
                    if (processed.has(mat.uuid)) return;
                    processed.add(mat.uuid);

                    // toggle : alterne entre l'opacité cible et une opacité de 1 (réapparition)
                    // l'état est mémorisé dans userData, indépendamment de l'opacité réelle
                    // en cours d'animation (utile si l'event arrive pendant une transition)
                    var isHidden = mat.userData._desappearHidden || false;
                    var target = isHidden ? 1 : data.opacity;
                    mat.userData._desappearHidden = !isHidden;

                    animateOpacity(mat, target, data.duration);
                });
            });

            if (!found) {
                console.warn("effect-desappear : aucun mesh trouvé sur '" + el.id + "' (modèle pas encore chargé ?)");
            }
        });
    }
});

// anime l'opacité d'un matériau depuis sa valeur actuelle jusqu'à targetOpacity, en duration ms
function animateOpacity(mat, targetOpacity, duration) {
    mat.transparent = true;
    var startOpacity = mat.opacity;
    var startTime = performance.now();

    function tick(now) {
        var t = Math.min((now - startTime) / duration, 1);
        mat.opacity = startOpacity + (targetOpacity - startOpacity) * t;
        mat.needsUpdate = true;
        if (t < 1) {
            requestAnimationFrame(tick);
        }
    }

    requestAnimationFrame(tick);
}