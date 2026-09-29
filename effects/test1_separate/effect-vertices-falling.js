// version 20260926

// effect-vertices-falling
// à combiner avec effect-vertices sur la MÊME entité.
// à chaque réception de l'event 'falling', chaque sphère de vertices descend
// (en position locale y) jusqu'à y=0, pendant "duration" (ms).
// paramètre : duration (défaut 2000)
//
// prérequis : l'event 'vertices' doit avoir été déclenché au moins une fois
// (effect-vertices doit avoir créé les sphères) avant d'utiliser cet effet.
// comportement à sens unique (pas de toggle) : chaque sphère tombe depuis sa
// position actuelle ; redéclencher l'event fait retomber celles qui seraient
// déjà remontées ou déplacées entre-temps.
(function () {

    AFRAME.registerComponent('effect-vertices-falling', {
        schema: {
            duration: {
                type: 'number',
                default: 2000
            },
            destroy: {
                type: 'boolean',
                default: false
            }
        },
        init: function () {
            var el = this.el;
            var data = this.data;

            el.addEventListener('vertices-falling', function () {
                var verticesComp = el.components['effect-vertices'];

                if (!verticesComp || !verticesComp.group || verticesComp.group.children.length === 0) {
                    console.warn("effect-vertices-falling : pas de sphères trouvées sur '" + el.id +
                        "' (déclenche d'abord l'event 'vertices' via effect-vertices)");
                    return;
                }

                // copie du tableau : on va potentiellement retirer des enfants du groupe
                // pendant les animations, autant itérer sur une liste stable
                var spheres = verticesComp.group.children.slice();
                spheres.forEach(function (sphere) {
                    animateFall(sphere, data.duration, data.destroy);
                });
            });
        }
    });

    // anime la position y d'une sphère depuis sa valeur actuelle jusqu'à 0, en duration ms
    // si destroy est vrai, la sphère est retirée de la scène une fois arrivée au sol
    function animateFall(sphere, duration, destroy) {
        var startY = sphere.position.y;
        var startTime = performance.now();

        function tick(now) {
            var t = Math.min((now - startTime) / duration, 1);
            sphere.position.y = startY + (0 - startY) * t;
            if (t < 1) {
                requestAnimationFrame(tick);
            } else if (destroy && sphere.parent) {
                sphere.parent.remove(sphere);
            }
        }

        requestAnimationFrame(tick);
    }

})();