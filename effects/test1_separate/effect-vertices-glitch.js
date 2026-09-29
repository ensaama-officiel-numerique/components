// version 20260926

// effect-vertices-glitch
// à combiner avec effect-vertices sur la MÊME entité.
// à chaque réception de l'event 'glitch', chaque sphère de vertices est
// perturbée de façon aléatoire et répétée pendant "duration" (ms), comme un
// artefact d'affichage juste avant une panne, puis revient à sa position
// d'origine.
// paramètres :
//   amplitude (défaut 0.02) : distance max de déplacement aléatoire (dans les
//                             unités locales du modèle, comme "radius")
//   duration  (défaut 800)  : durée totale du glitch, en ms
//   frequency (défaut 60)   : nombre de sauts aléatoires par seconde
//
// prérequis : l'event 'vertices' doit avoir été déclenché au moins une fois
// (effect-vertices doit avoir créé les sphères) avant d'utiliser cet effet.
(function () {

    AFRAME.registerComponent('effect-vertices-glitch', {
        schema: {
            amplitude: {
                type: 'number',
                default: 0.02
            },
            duration: {
                type: 'number',
                default: 800
            },
            frequency: {
                type: 'number',
                default: 60
            }
        },
        init: function () {
            var el = this.el;
            var data = this.data;

            el.addEventListener('vertices-glitch', function () {
                console.log("glitch");
                var verticesComp = el.components['effect-vertices'];

                if (!verticesComp || !verticesComp.group || verticesComp.group.children.length === 0) {
                    console.warn("effect-vertices-glitch : pas de sphères trouvées sur '" + el.id +
                        "' (déclenche d'abord l'event 'vertices' via effect-vertices)");
                    return;
                }

                // position d'origine sauvegardée par sphère, pour un retour propre en fin de glitch
                var spheres = verticesComp.group.children.map(function (sphere) {
                    return { sphere: sphere, origin: sphere.position.clone() };
                });

                runGlitch(spheres, data.amplitude, data.duration, data.frequency);
            });
        }
    });

    // applique des sauts de position aléatoires à intervalle régulier pendant duration ms,
    // puis restaure la position d'origine de chaque sphère
    function runGlitch(spheres, amplitude, duration, frequency) {
        var startTime = performance.now();
        var interval = 1000 / frequency;
        var nextJumpTime = startTime;

        function tick(now) {
            var elapsed = now - startTime;

            if (elapsed >= duration) {
                // fin du glitch : retour à la position d'origine
                spheres.forEach(function (item) {
                    item.sphere.position.copy(item.origin);
                });
                return;
            }

            if (now >= nextJumpTime) {
                spheres.forEach(function (item) {
                    item.sphere.position.set(
                        item.origin.x + (Math.random() * 2 - 1) * amplitude,
                        item.origin.y + (Math.random() * 2 - 1) * amplitude,
                        item.origin.z + (Math.random() * 2 - 1) * amplitude
                    );
                });
                nextJumpTime = now + interval;
            }

            requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
    }

})();
