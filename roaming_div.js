class RoamingDiv {
    constructor(obj, container) {
        this.object = obj;
        this.container = container;

        this.accel_padding = [30, 30];

        const move_space = this.getMovableDimensions();

        this.position = [Math.floor(move_space[0]/2), Math.floor(move_space[1]/2)]; // pixel (top-left of div relative to top-left of container)
        this.updatePosition();
        this.velocity = [10, 10]; // pixel/sec
        this.accelaration = [0, 0]; // pixel/sec^2
    }

    getMovableDimensions() {
        if (this.container === window) {
            return [
                this.container.innerHeight - this.object.clientHeight,
                this.container.innerWidth - this.object.clientWidth
            ];
        } else {
            return [
                this.container.clientHeight - this.object.clientHeight,
                this.container.clientWidth - this.object.clientWidth
            ];
        }
    }

    getNextFrame() {
        const move_space = this.getMovableDimensions();
        const dim0_inbounds = (this.position[0] > this.accel_padding[0]) && (this.position[0] < move_space[0] - this.accel_padding[0]);
        const dim1_inbounds = (this.position[1] > this.accel_padding[1]) && (this.position[1] < move_space[1] - this.accel_padding[1]);
        if (dim0_inbounds && dim1_inbounds) {
            this.position[0] += 1;
        }
        
        this.updatePosition();

        window.requestAnimationFrame(this.getNextFrame.bind(this));
    }

    updatePosition() {
        this.object.style.left = this.position[0] + 'px';
        this.object.style.top = this.position[1] + 'px';
    }
}
