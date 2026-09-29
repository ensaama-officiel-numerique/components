// version 20260926

// effect-vertices-desappear
// à combiner avec effect-vertices sur la MÊME entité.
// à chaque réception de l'event 'vertices-desappear' (toggle), anime l'opacité
// du matériau des sphères de vertices (pas celui du modèle) vers "opacity",
// pendant "duration" (ms) ; un second event ramène à une opacité de 1.
// paramètres : opacity (défaut 0.3), duration (défaut 2000)
//
// prérequis : l'event 'vertices' doit avoir été déclenché au moins une fois
// (effect-vertices doit avoir créé les sphères) avant d'utiliser cet effet.
(function () {

    AFRAME.registerComponent('effect-vertices-desappear', {
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

            el.addEventListener('vertices-desappear', function () {
                var verticesComp = el.components['effect-vertices'];

                if (!verticesComp || !verticesComp.sphereMaterial) {
                    console.warn("effect-vertices-desappear : pas de sphères trouvées sur '" + el.id +
                        "' (déclenche d'abord l'event 'vertices' via effect-vertices)");
                    return;
                }

                var mat = verticesComp.sphereMaterial;

                // toggle : alterne entre l'opacité cible et une opacité de 1
                var isHidden = mat.userData._verticesDesappearHidden || false;
                var target = isHidden ? 1 : data.opacity;
                mat.userData._verticesDesappearHidden = !isHidden;

                animateOpacity(mat, target, data.duration);
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

})();
