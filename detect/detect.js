// version 20220303

// FREQUENCY
AFRAME.registerComponent('frequency', {
    schema: {
        log: {
            type: 'boolean',
            default: false
        },
        delay: {
            type: 'number',
            default: 1000
        },
    },
    init: function () {
        this.tick = AFRAME.utils.throttleTick(this.tick, this.data.delay, this);
    },
    tick: function (time, delta) {
        if (this.data.log) {
            console.log("interval = " + delta.toFixed(3));
        }
    }
});

// CURRENTPOSITION
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

// PROXIMITY
    AFRAME.registerComponent('proximity', {
    schema: {
        trace: {
            type: 'boolean',
            default: false
        },
        seuils: {
            type: 'array',
            default: [1]
        },
        state: {
            type: 'string',
            default: '0'
        },
        mypos: {
            type: 'vec3'
        }
    },
    init: function () {
        this.data.mypos = this.el.getAttribute('position');
    },
    tick: function () {
        // var cibles = this.data.cibles;
        let seuils = this.data.seuils;
        let state = this.data.state;
        let mypos = this.data.mypos;
        let distance = dist(mypos);
        let newstate = 0;
        for (let i = 0; i < seuils.length; i++) {
            if (distance > seuils[i]) newstate = i + 1;
        }
        if (state != newstate) {
            if (state < newstate) {
                this.el.emit("exit" + newstate);
                console.log("event : 'exit-" + newstate + "' sent to #" + this.el.id);
            } else {
                this.el.emit("enter" + newstate);
                console.log("event : 'enter-" + newstate + "' sent to #" + this.el.id);
            }
            this.data.state = newstate;
        }
        if (this.data.trace) {
            var log = document.querySelector('#txtlog');
            log.setAttribute('value', "#" + this.el.id + " _ etat=" + newstate + " _ distance=" + distance.toFixed(2));
        }
    }
});

function dist(mypos) {
    return Math.sqrt((player.pos.x - mypos.x) ** 2 + (player.pos.z - mypos.z) ** 2);
}