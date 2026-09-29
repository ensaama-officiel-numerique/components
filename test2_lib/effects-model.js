// version 20260926
// effets sur le MODÈLE 3D lui-même (obj-model / gltf-model)
// composants : model-wireframe, model-transparent, model-desappear, model-delete
// events     : wireframe,       transparent,       desappear,       delete

(function () {

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

    // ------------------------------------------------------------------
    // model-wireframe
    // bascule l'affichage wireframe des matériaux du modèle, à chaque event 'wireframe'
    // schema "color" (optionnel) : force une couleur de wireframe (sauvegardée/restaurée
    // pour ne pas teinter une texture au retour en mode plein)
    // ------------------------------------------------------------------
    AFRAME.registerComponent('model-wireframe', {
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
                                if (!mat.userData._originalColor) {
                                    mat.userData._originalColor = mat.color.clone();
                                }
                                mat.color.set(forcedColor);
                            } else if (mat.userData._originalColor) {
                                mat.color.copy(mat.userData._originalColor);
                            }
                        }
                    });
                });

                if (!found) {
                    console.warn("model-wireframe : aucun mesh trouvé sur '" + el.id + "' (modèle pas encore chargé ?)");
                }
            });
        }
    });

    // ------------------------------------------------------------------
    // model-transparent
    // bascule l'opacité du modèle entre 1 et "opacity", à chaque event 'transparent'
    // paramètre : opacity (défaut 0.3)
    // ------------------------------------------------------------------
    AFRAME.registerComponent('model-transparent', {
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
                var found = false;
                var processed = new Set();

                el.object3D.traverse(function (node) {
                    if (!node.isMesh || !node.material) return;
                    found = true;

                    var materials = Array.isArray(node.material) ? node.material : [node.material];
                    materials.forEach(function (mat) {
                        if (processed.has(mat.uuid)) return;
                        processed.add(mat.uuid);

                        mat.transparent = true;
                        mat.opacity = (mat.opacity <= opacity) ? 1 : opacity;
                        mat.needsUpdate = true;
                    });
                });

                if (!found) {
                    console.warn("model-transparent : aucun mesh trouvé sur '" + el.id + "' (modèle pas encore chargé ?)");
                }
            });
        }
    });

    // ------------------------------------------------------------------
    // model-desappear
    // anime l'opacité du modèle jusqu'à "opacity" pendant "duration" (ms), en toggle
    // (un second event 'desappear' ramène à une opacité de 1)
    // paramètres : opacity (défaut 0.3), duration (défaut 2000)
    // ------------------------------------------------------------------
    AFRAME.registerComponent('model-desappear', {
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
                var processed = new Set();

                el.object3D.traverse(function (node) {
                    if (!node.isMesh || !node.material) return;
                    found = true;

                    var materials = Array.isArray(node.material) ? node.material : [node.material];
                    materials.forEach(function (mat) {
                        if (processed.has(mat.uuid)) return;
                        processed.add(mat.uuid);

                        var isHidden = mat.userData._desappearHidden || false;
                        var target = isHidden ? 1 : data.opacity;
                        mat.userData._desappearHidden = !isHidden;

                        animateOpacity(mat, target, data.duration);
                    });
                });

                if (!found) {
                    console.warn("model-desappear : aucun mesh trouvé sur '" + el.id + "' (modèle pas encore chargé ?)");
                }
            });
        }
    });

    // ------------------------------------------------------------------
    // model-bluescreen
    // à l'event 'bluescreen' : flash bref d'une couleur d'alerte (type écran bleu),
    // puis extinction BRUTALE sans transition (contraste volontaire avec model-desappear,
    // qui est progressif) — la panne matérielle ne prévient pas.
    // un second event 'bluescreen', une fois le crash survenu, restaure l'état d'origine
    // (pour pouvoir retester), avant de pouvoir re-décencher un nouveau crash.
    // paramètres : color (défaut #0000aa), duration (défaut 400 : durée du flash avant le crash)
    // ------------------------------------------------------------------
    AFRAME.registerComponent('model-bluescreen', {
        schema: {
            color: {
                type: 'color',
                default: '#0000aa'
            },
            duration: {
                type: 'number',
                default: 400
            }
        },
        init: function () {
            var el = this.el;
            var data = this.data;
            var self = this;
            this.crashed = false;
            this.saved = [];

            el.addEventListener('bluescreen', function () {
                if (self.crashed) {
                    self.restore();
                    self.crashed = false;
                    return;
                }
                self.crash(data.color, data.duration);
            });
        },
        crash: function (color, duration) {
            var el = this.el;
            var self = this;
            var processed = new Set();
            var found = false;
            this.saved = [];

            el.object3D.traverse(function (node) {
                if (!node.isMesh || !node.material) return;
                found = true;

                var materials = Array.isArray(node.material) ? node.material : [node.material];
                materials.forEach(function (mat) {
                    if (processed.has(mat.uuid)) return;
                    processed.add(mat.uuid);

                    self.saved.push({
                        mat: mat,
                        color: mat.color ? mat.color.clone() : null,
                        opacity: mat.opacity,
                        transparent: mat.transparent
                    });

                    if (mat.color) mat.color.set(color);
                    mat.needsUpdate = true;
                });
            });

            if (!found) {
                console.warn("model-bluescreen : aucun mesh trouvé sur '" + el.id + "' (modèle pas encore chargé ?)");
                return;
            }

            // extinction brutale après le flash : pas d'animation, un seul saut net
            setTimeout(function () {
                self.saved.forEach(function (item) {
                    item.mat.transparent = true;
                    item.mat.opacity = 0;
                    item.mat.needsUpdate = true;
                });
                self.crashed = true;
            }, duration);
        },
        restore: function () {
            this.saved.forEach(function (item) {
                if (item.color) item.mat.color.copy(item.color);
                item.mat.opacity = item.opacity;
                item.mat.transparent = item.transparent;
                item.mat.needsUpdate = true;
            });
        }
    });

    // ------------------------------------------------------------------
    // model-reboot
    // à l'event 'reboot' : clignotement on/off de toute l'entité, comme un vieil
    // écran CRT qui agonise, avant extinction finale.
    // un second event 'reboot', une fois éteint, rallume tout (pour retester).
    // paramètres :
    //   duration  (défaut 2000) : durée totale du clignotement avant extinction, en ms
    //   frequency (défaut 8)    : clignotements par seconde au départ
    //   slowdown  (défaut true) : ralentit progressivement le clignotement vers la fin
    // ------------------------------------------------------------------
    AFRAME.registerComponent('model-reboot', {
        schema: {
            duration: {
                type: 'number',
                default: 2000
            },
            frequency: {
                type: 'number',
                default: 8
            },
            slowdown: {
                type: 'boolean',
                default: true
            }
        },
        init: function () {
            var el = this.el;
            var data = this.data;
            var self = this;
            this.off = false;

            el.addEventListener('reboot', function () {
                if (self.off) {
                    el.object3D.visible = true;
                    self.off = false;
                    return;
                }
                self.runReboot(data.duration, data.frequency, data.slowdown);
            });
        },
        runReboot: function (duration, frequency, slowdown) {
            var el = this.el;
            var self = this;
            var startTime = performance.now();
            var baseInterval = 1000 / frequency;

            function blink() {
                var elapsed = performance.now() - startTime;

                if (elapsed >= duration) {
                    el.object3D.visible = false;
                    self.off = true;
                    return;
                }

                el.object3D.visible = !el.object3D.visible;

                var nextInterval = baseInterval;
                if (slowdown) {
                    var t = elapsed / duration; // 0 -> 1
                    nextInterval = baseInterval * (1 + t * 4); // jusqu'à x5 plus lent en fin de course
                }

                setTimeout(blink, nextInterval);
            }

            blink();
        }
    });

    // ------------------------------------------------------------------
    // model-delete
    // cache/affiche instantanément TOUTE l'entité, sans transition, à chaque event 'delete'
    // pas de paramètre
    // ------------------------------------------------------------------
    AFRAME.registerComponent('model-delete', {
        init: function () {
            var el = this.el;

            el.addEventListener('delete', function () {
                el.object3D.visible = !el.object3D.visible;
            });
        }
    });

})();
