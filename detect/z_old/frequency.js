AFRAME.registerComponent('frequency', {
    schema: {
        log: { type: 'boolean', default: false},
        delay: { type: 'number', default: 1000 },
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