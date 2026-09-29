// version 20260926

// effect-delete
// à chaque réception de l'event 'delete' (toggle), cache/affiche instantanément
// TOUTE l'entité (modèle + sphères de vertices éventuelles), sans transition.
// contraste volontaire avec les autres effets (wireframe, transparent, desappear,
// falling...) qui sont tous progressifs : ici, rien ne prévient, rien ne s'étire
// dans le temps — la donnée est là, puis elle ne l'est plus.
//
// pas de paramètre : la brutalité de l'effet n'a rien à régler.
//
// note : implémenté en toggle pour faciliter les tests (retour à l'affichage
// avec un second event). Pour l'expérience finale, tu voudras peut-être plutôt
// un aller simple (jamais de retour) — dis-le-moi si tu veux cette variante.
AFRAME.registerComponent('effect-delete', {
    init: function () {
        var el = this.el;

        el.addEventListener('delete', function () {
            el.object3D.visible = !el.object3D.visible;
        });
    }
});
