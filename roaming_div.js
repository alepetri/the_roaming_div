class RoamingDiv {
    ROAM_DIRECTIONS = {
        LEFT: -1,
        STRAIGHT: 0,
        RIGHT: 1,
    }

    constructor(obj, container, fps=60, speed=100, heading_init=Math.PI, deg_to_turn=2, chance_to_change=0.1) {
        this.object = obj;
        this.container = container;

        this.object.style.position = 'relative';

        this.fps = fps;
        this.base_speed = speed;
        this.speed = this.base_speed;
        this.heading = heading_init;
        this.deg_to_turn = deg_to_turn;
        this.chance_to_change = chance_to_change;

        this.timestamp = null;

        this.roam_direction = this.ROAM_DIRECTIONS['STRAIGHT']

        const move_space = this.getMovableDimensions();
        this.accel_padding = [move_space[0]/10, move_space[1]/10];

        this.position = [move_space[0]/2, move_space[1]/2]; // pixel (top-left of div relative to top-left of container)
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

                this.roam();
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

    roam(){
        const rand = Math.random();

        if (this.roam_direction === this.ROAM_DIRECTIONS['STRAIGHT']) {
            if (rand < 1-this.chance_to_change) {
                this.roam_direction = this.ROAM_DIRECTIONS['STRAIGHT'];
            }
            else if (rand < 1-this.chance_to_change/2) {
                this.roam_direction = this.ROAM_DIRECTIONS['LEFT'];
            }
            else {
                this.roam_direction = this.ROAM_DIRECTIONS['RIGHT'];
            }
        }
        else if (this.roam_direction === this.ROAM_DIRECTIONS['LEFT']) {
            if (rand < 1-this.chance_to_change) {
                this.roam_direction = this.ROAM_DIRECTIONS['LEFT'];
            }
            else if (rand < 1-this.chance_to_change/3) {
                this.roam_direction = this.ROAM_DIRECTIONS['STRAIGHT'];
            }
            else {
                this.roam_direction = this.ROAM_DIRECTIONS['RIGHT'];
            }
        }
        else {
            if (rand < 1-this.chance_to_change) {
                this.roam_direction = this.ROAM_DIRECTIONS['RIGHT'];
            }
            else if (rand < 1-this.chance_to_change/3) {
                this.roam_direction = this.ROAM_DIRECTIONS['STRAIGHT'];
            }
            else {
                this.roam_direction = this.ROAM_DIRECTIONS['LEFT'];
            }
        }
        
        if (this.roam_direction === this.ROAM_DIRECTIONS['LEFT']) {
            this.setHeading(this.heading - this.deg_to_turn * Math.PI / 180)
        }
        if (this.roam_direction === this.ROAM_DIRECTIONS['RIGHT']) {
            this.setHeading(this.heading + this.deg_to_turn * Math.PI / 180)
        }
    }
}
