let player = {
    pos: {
        x: 0,
        y: 0,
        z: 0
    }
}

function dist(mypos) {
    return Math.sqrt((player.pos.x - mypos.x) ** 2 + (player.pos.z - mypos.z) ** 2)
}

AFRAME.registerComponent('currentposition', {
    schema: {
        trace: {
            type: 'boolean',
            default: false
        },
    },
    tick: function () {
        var pos = this.el.object3D.position;
        var wposition = new THREE.Vector3();
        var wpos = this.el.object3D.getWorldPosition(wposition);

        player.pos.x = pos.x + wpos.x;
        player.pos.y = pos.y + wpos.y;
        player.pos.z = pos.z + wpos.z;
        //console.log(player.pos);

        if (this.data.trace) {
            var trace = document.querySelector('#txtlog');
            var newvalue = 'x = ' + player.pos.x.toFixed(2) + ", z = " + player.pos.z.toFixed(2);
            trace.setAttribute('value', newvalue);
        }
    }
});

