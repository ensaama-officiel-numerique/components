// Component to change to a sequential color on click.
AFRAME.registerComponent('send-testevent', {
    schema: {
        evt: { type: 'string', default: 'none'},
        cible: { type: 'string', default: 'none'},
    },
    init: function () {
        let id = this.el.id;
        if (this.data.cible != 'none') { id = this.data.cible; }
        let cible = document.querySelector('#' + id);
        let evt = this.data.evt;
        this.el.addEventListener('fusing', function (e) {
            cible.emit(evt);
            console.log('event '+evt+' sent to '+id);
        });
    }
});