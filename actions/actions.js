// MODIFY-OBJCOLOR
AFRAME.registerComponent('modify-objcolor', {
    schema: {
        log: {
            type: 'boolean',
            default: false
        },
        objname: {
            type: 'string',
            default: "Cube"
        },
        newcolor: {
            type: 'string',
            default: "random"
        },
    },
    init: function () {
        // Wait for event
        this.el.addEventListener('objcolor', () => {
            let obj = this.el.getObject3D('mesh');
            let objname = this.data.objname;
            let newcolor = this.data.newcolor;
            if (newcolor == 'random') {
                newcolor = randomColor();
            }
            obj.traverse(node => {
                if (node.name.indexOf(objname) !== -1) {
                    node.material.color.set(newcolor);
                    if (this.data.log) console.log("newcolor = " + newcolor);
                }
            });
        });

        function randomColor() {
            return '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
        }
    }

});