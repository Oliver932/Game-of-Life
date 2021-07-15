

const trailThickness = 2;
const trailNum = 1000;
const clarityDecrement = 30;
const thicknessIncrement = 6;
const trailPerIter = 20;

let Trails = [];

function createTrails(x, y, dx, dy) {

    var ddx = dx / trailPerIter;
    var ddy = dy / trailPerIter;

    for (let index = 0; index < trailPerIter; index++) {

        var thickness = trailThickness + ((trailPerIter - index) * (thicknessIncrement / trailPerIter));
        var clarity = 255 - ((trailPerIter - index) * (clarityDecrement / trailPerIter));
        new Trail((x - dx) + (ddx * index), (y - dy) + (ddy * index), ddx, ddy, thickness, clarity)
        
    }
}

class Trail{

    constructor(x, y, dx, dy, thickness, clarity){

        this.x1 = x;
        this.x2 = x + dx;
        this.y1 = y;
        this.y2 = y + dy;

        this.thickness = thickness;
        this.clarity = clarity;

        Trails.push(this);
        if (Trails.length  > trailNum) {

            Trails.shift();
        }
    }

    show() {

        if (this.clarity > 0){

            push()

            this.colour = color(255);
            this.colour.setAlpha(this.clarity);

            stroke(this.colour);
            strokeWeight(this.thickness);
            line(this.x1, this.y1, this.x2, this.y2);
            pop()

            this.thickness += thicknessIncrement
            this.clarity = Math.max(0, this.clarity - clarityDecrement)

            if (this.clarity == 0){
                Trails.splice(Trails.indexOf(this), 1);

                return true;
            } else {
                return false;
            }
        }
    }
}