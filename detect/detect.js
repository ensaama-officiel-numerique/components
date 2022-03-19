// version 20220303
// 20220228 _ initiale
// 20220313 _ du composant head-height

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
    },
    left: {
        x: 0,
        y: 0,
        z: 0
    },
    right: {
        x: 0,
        y: 0,
        z: 0
    },
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
        player.pos.y = pos.y;
        //player.pos.y = pos.y + wpos.y;
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
                this.el.emit("exit-" + newstate);
                console.log("event : 'exit-" + newstate + "' sent to #" + this.el.id);
            } else {
                this.el.emit("enter-" + newstate);
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

// HEAD HEIGHT
AFRAME.registerComponent('head-height', {
    schema: {
        trace: { type: 'boolean', default: false },
        seuils: { type: 'array', default: [1] },
        state: { type: 'string', default: '0' },
    },
    tick: function () {
        // var cibles = this.data.cibles;
        let seuils = this.data.seuils;
        let state = this.data.state;
        let hauteur = player.pos.y;

        let newstate = 0;
        for (let i = 0; i < seuils.length; i++) {
            if (hauteur > seuils[i]) newstate = i + 1;
        }
        if (state != newstate) {
            if (state < newstate) {
                this.el.emit("heightup-" + newstate);
                console.log("event : 'heightup-" + newstate + "' sent to #" + this.el.id);
            } else {
                this.el.emit("heightdown-" + newstate);
                console.log("event : 'heightdown-" + newstate + "' sent to #" + this.el.id);
            }
            this.data.state = newstate;
        }
        if (this.data.trace) {
            var log = document.querySelector('#txtlog');
            log.setAttribute('value', "#" + this.el.id + " _ etat=" + newstate + " _ hauteur=" + hauteur.toFixed(2));
        }
    }
});

// HANDSPOSITION
AFRAME.registerComponent('handsposition', {
    schema: {
        trace: {
            type: 'boolean',
            default: false
        },
        left: { type: 'string', default: 'gauche' },
        right: { type: 'string', default: 'droite' }
    },
    init: function () {
        let left = document.querySelector('#' + this.data.left);
        this.data.left = left;
        let right = document.querySelector('#' + this.data.right);
        this.data.right = right;
    },
    tick: function () {
        let leftpos = this.data.left.getAttribute('position');
        let rightpos = this.data.right.getAttribute('position');
        player.left = leftpos;
        player.right = rightpos;

        if (this.data.trace) {
            var trace = document.querySelector('#txtlog');
            var newvalue = 'left : x = ' + leftpos.x.toFixed(2) + ", y = " + leftpos.y.toFixed(2) + ", z = " + leftpos.z.toFixed(2);
            newvalue += '\n right: x = ' + rightpos.x.toFixed(2) + ", y = " + rightpos.y.toFixed(2) + ", z = " + rightpos.z.toFixed(2);
            trace.setAttribute('value', newvalue);
        }
    }
});

// HANDS HEIGHT
AFRAME.registerComponent('hands-height', {
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
        side: {
            type: 'string', default: 'right'
        }
    },
    tick: function () {
        // var cibles = this.data.cibles;
        let side = this.data.side;
        let seuils = this.data.seuils;
        let state = this.data.state;
        let hauteur;
        switch (side) {
            case 'left':
                hauteur = player.left.y;
                break;
            case 'right':
                hauteur = player.right.y;
                break;
            default:
                hauteur = (player.left.y + player.right.y) / 2;
        }

        let newstate = 0;
        for (let i = 0; i < seuils.length; i++) {
            if (hauteur > seuils[i]) newstate = i + 1;
        }
        if (state != newstate) {
            if (state < newstate) {
                this.el.emit(side + "up-" + newstate);
                console.log("event : '" + side + "up-" + newstate + "' sent to #" + this.el.id);
            } else {
                this.el.emit(side + "up-" + newstate);
                console.log("event : '" + side + "down-" + newstate + "' sent to #" + this.el.id);
            }
            this.data.state = newstate;
        }
        if (this.data.trace) {
            var log = document.querySelector('#txtlog');
            log.setAttribute('value', "#" + this.el.id + " _ etat=" + newstate + " _ hauteur=" + hauteur.toFixed(2));
        }
    }
});
 
