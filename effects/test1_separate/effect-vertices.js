// version 20260926

// effect-vertices
// à chaque réception de l'event 'vertices' (toggle) :
//   - rend le modèle 3D (porté par cette entité) transparent
//   - lit le fichier .obj source comme du texte (fetch)
//   - récupère les positions des vertices (lignes "v x y z")
//   - crée une sphère (radius, color) à chaque position
// un second event 'vertices' retire les sphères et restaure l'opacité d'origine
//
// paramètres :
//   radius (défaut 0.001) : rayon des sphères
//   color  (défaut white) : couleur des sphères
//
// prérequis : l'entité doit porter obj-model="obj: #xxx; mtl: #yyy"
// et la page doit être servie via http(s) (fetch échoue en file://)
AFRAME.registerComponent('effect-vertices', {
    schema: {
        radius: {
            type: 'number',
            default: 0.001
        },
        color: {
            type: 'color',
            default: '#ffffff'
        },
        opacity: {
            type: 'number',
            default: 0.15
        },
        ratio: {
            type: 'number',
            default: 1
        }
    },
    init: function () {
        var self = this;
        this.showing = false;
        this.group = null;
        this.verticesCache = null; // évite de re-fetch/re-parser le .obj à chaque toggle
        this.originalOpacities = new Map(); // uuid matériau -> { opacity, transparent } avant modification

        this.el.addEventListener('vertices', function () {
            if (self.showing) {
                self.hideVertices();
            } else {
                self.showVertices();
            }
        });
    },

    showVertices: function () {
        var self = this;

        this.setModelOpacity(this.data.opacity);

        if (this.verticesCache) {
            this.createSpheres(this.sampleVertices(this.verticesCache));
            this.showing = true;
            return;
        }

        var objUrl = this.getObjUrl();
        if (!objUrl) {
            console.warn("effect-vertices : impossible de trouver l'URL du fichier .obj (vérifie l'attribut obj-model)");
            return;
        }

        fetch(objUrl)
            .then(function (res) {
                if (!res.ok) throw new Error('HTTP ' + res.status);
                return res.text();
            })
            .then(function (text) {
                var vertices = self.parseVertices(text);
                if (vertices.length === 0) {
                    console.warn("effect-vertices : aucun vertex trouvé dans " + objUrl);
                    return;
                }
                self.verticesCache = vertices; // cache complet, non filtré (le ratio est réappliqué à chaque affichage)
                self.createSpheres(self.sampleVertices(vertices));
                self.showing = true;
            })
            .catch(function (err) {
                console.error("effect-vertices : erreur de lecture de '" + objUrl + "'", err);
            });
    },

    hideVertices: function () {
        if (this.group) {
            this.el.object3D.remove(this.group);
        }
        this.restoreModelOpacity();
        this.showing = false;
    },

    // retrouve l'URL du fichier .obj à partir de l'attribut obj-model de l'entité
    // gère les deux syntaxes : obj-model="obj: #model-obj" (sélecteur d'asset)
    // ou obj-model="obj: ./chemin/vers/fichier.obj" (URL directe)
    getObjUrl: function () {
        var objModelData = this.el.getAttribute('obj-model');
        if (!objModelData || !objModelData.obj) return null;

        var obj = objModelData.obj;
        if (obj.charAt(0) === '#') {
            var assetEl = document.querySelector(obj);
            return assetEl ? assetEl.getAttribute('src') : null;
        }
        return obj; // déjà une URL/chemin directement utilisable par fetch
    },

    // extrait les positions de vertices ("v x y z"), en ignorant "vn" (normales) et "vt" (uv)
    parseVertices: function (text) {
        var vertices = [];
        var lines = text.split('\n');
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            if (line.charAt(0) === 'v' && line.charAt(1) === ' ') {
                var parts = line.trim().split(/\s+/);
                var x = parseFloat(parts[1]);
                var y = parseFloat(parts[2]);
                var z = parseFloat(parts[3]);
                if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
                    vertices.push(new THREE.Vector3(x, y, z));
                }
            }
        }
        return vertices;
    },

    // réduit la liste des vertices selon this.data.ratio (0 à 1)
    // répartition régulière (par pas) plutôt qu'aléatoire, pour un échantillonnage
    // homogène sur toute la surface du modèle plutôt que des trous localisés
    sampleVertices: function (vertices) {
        var ratio = this.data.ratio;
        if (ratio >= 1) return vertices;
        if (ratio <= 0) return [];

        var target = Math.max(1, Math.round(vertices.length * ratio));
        var step = vertices.length / target;
        var result = [];
        for (var i = 0; i < target; i++) {
            result.push(vertices[Math.floor(i * step)]);
        }
        return result;
    },

    // crée un groupe de sphères (géométrie/matériau partagés pour limiter le coût mémoire)
    // et l'ajoute directement dans object3D de l'entité, dans le même repère local
    // que les vertices du fichier .obj (donc alignées avec le modèle sans calcul supplémentaire)
    createSpheres: function (vertices) {
        var data = this.data;
        var geometry = new THREE.SphereGeometry(data.radius, 6, 6); // low-poly : perf si beaucoup de vertices
        // depthTest: false + renderOrder élevé : évite que les sphères (posées pile sur la
        // surface du modèle) soient masquées par le z-fighting avec le matériau semi-transparent
        var material = new THREE.MeshBasicMaterial({ color: data.color, depthTest: false });
        var group = new THREE.Group();

        vertices.forEach(function (v) {
            var sphere = new THREE.Mesh(geometry, material);
            sphere.position.copy(v);
            sphere.renderOrder = 999;
            sphere.userData.effectVerticesSphere = true; // pour que d'autres composants puissent les ignorer
            group.add(sphere);
        });

        this.group = group;
        this.sphereMaterial = material; // exposé pour effect-vertices-desappear
        this.el.object3D.add(group);

        console.log("effect-vertices : " + vertices.length + " sphère(s) créée(s) sur '" + this.el.id + "'");
    },

    setModelOpacity: function (opacity) {
        var self = this;
        var processed = new Set();
        var found = false;

        this.el.object3D.traverse(function (node) {
            if (!node.isMesh || !node.material || node.userData.effectVerticesSphere) return;
            found = true;

            var materials = Array.isArray(node.material) ? node.material : [node.material];
            materials.forEach(function (mat) {
                if (processed.has(mat.uuid)) return;
                processed.add(mat.uuid);

                if (!self.originalOpacities.has(mat.uuid)) {
                    self.originalOpacities.set(mat.uuid, { opacity: mat.opacity, transparent: mat.transparent });
                }
                mat.transparent = true;
                mat.opacity = opacity;
                mat.needsUpdate = true;
            });
        });

        if (!found) {
            console.warn("effect-vertices : aucun mesh trouvé sur '" + this.el.id + "' (modèle pas encore chargé ?)");
        }
    },

    restoreModelOpacity: function () {
        var self = this;
        var processed = new Set();

        this.el.object3D.traverse(function (node) {
            if (!node.isMesh || !node.material || node.userData.effectVerticesSphere) return;

            var materials = Array.isArray(node.material) ? node.material : [node.material];
            materials.forEach(function (mat) {
                if (processed.has(mat.uuid)) return;
                processed.add(mat.uuid);

                var original = self.originalOpacities.get(mat.uuid);
                if (original) {
                    mat.opacity = original.opacity;
                    mat.transparent = original.transparent;
                    mat.needsUpdate = true;
                }
            });
        });
    }
});