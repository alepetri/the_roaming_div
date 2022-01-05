class RoamingDiv {
    constructor(obj, container) {
        this.object = obj;
        this.container = container;
        this.object.style.position = 'absolute';
        this.fps = 60;
        this.base_speed = 100

        this.timestamp = null;

        this.accel_padding = [30, 30];

        const move_space = this.getMovableDimensions();

        this.heading = Math.PI;
        this.speed = this.base_speed;

        this.position = [Math.floor(move_space[0]/2), Math.floor(move_space[1]/2)]; // pixel (top-left of div relative to top-left of container)
        this.drawPosition();
        this.setSpeed(this.base_speed); // pixel/sec
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
        const now = new Date().getTime();
        if (!this.timestamp) {
            this.timestamp = now;
        }

        if (now - this.timestamp > 1000/this.fps)
        {
            this.timestamp = now;

            const move_space = this.getMovableDimensions();
            const dim0_inbounds = (this.position[0] >= this.accel_padding[0]) && (this.position[0] < move_space[0] - this.accel_padding[0]);
            const dim1_inbounds = (this.position[1] >= this.accel_padding[1]) && (this.position[1] < move_space[1] - this.accel_padding[1]);
            if (dim0_inbounds && dim1_inbounds) {
                this.accelaration = [0,0];
                if (this.speed !== this.base_speed) {
                    this.setSpeed(this.base_speed);
                }

                // Add heading noise between -1 and 1 deg
                this.setHeading(this.heading + (Math.random()-0.5)*6*Math.PI/180);
            }
            else {
                if (!dim0_inbounds) {
                    if (!this.accelaration[0]) {
                        if (this.position[0] < this.accel_padding[0]) {
                            this.accelaration[0] = (this.velocity[0]**2)/(2*(this.accel_padding[0]-1));
                        }
                        else {
                            this.accelaration[0] = -(this.velocity[0]**2)/(2*(this.accel_padding[0]-1));
                        }
                    }
                }
                else {
                    this.accelaration[0] = 0;
                }
                if (!dim1_inbounds) {
                    if (!this.accelaration[1]) {
                        if (this.position[1] < this.accel_padding[1]) {
                            this.accelaration[1] = (this.velocity[1]**2)/(2*(this.accel_padding[1]-1));
                        }
                        else {
                            this.accelaration[1] = -(this.velocity[1]**2)/(2*(this.accel_padding[1]-1));
                        }
                    }
                }
                else {
                    this.accelaration[1] = 0;
                }
            }
            
            this.propogate();
            this.drawPosition();
        }

        window.requestAnimationFrame(this.getNextFrame.bind(this));
    }

    setSpeed(speed) {
        this.speed = speed;
        this.updateVelocity();
    }

    setHeading(heading) {
        this.heading = heading;
        this.updateVelocity();
    }

    updateVelocity() {
        this.velocity = [
            this.speed * Math.sin(this.heading),
            this.speed * Math.cos(this.heading)
        ];
    }

    getHeading() {
        return Math.atan2(this.velocity[0],this.velocity[1]);
    }

    propogate() {
        const dt = 1/this.fps;

        // if acceleration is non-zero, update velocity
        if (this.accelaration.some(i => i)) {
            this.velocity[0] += this.accelaration[0] * dt;
            this.velocity[1] += this.accelaration[1] * dt;
            this.heading = Math.atan2(this.velocity[0], this.velocity[1]);
            this.speed = (this.velocity[0]**2 + this.velocity[1]**2)**0.5;
        }

        this.position[0] += this.velocity[0] * dt;
        this.position[1] += this.velocity[1] * dt;
    }

    drawPosition() {
        this.object.style.top = this.position[0] + 'px';
        this.object.style.left = this.position[1] + 'px';
    }
}
