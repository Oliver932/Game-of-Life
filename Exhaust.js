
const pointNum = 1000;
const pointsPerFrame = Math.max(1, 40 * dScale)

const trailThickness = 3;
const clarityDecrement = 1;
const thicknessIncrement = 1;
const deceleration = 30;



function createPoints(x, y, planeV, airV, throttle) {

    var dx = planeV.x / (pointsPerFrame)
    var dy = planeV.y / (pointsPerFrame)

    var startX = x - planeV.x;
    var startY = y - planeV.y;
    var time = 1;

    for (let index = 0; index < pointsPerFrame; index++) {

        var pos = new p5.Vector(startX, startY);

        time -= 1/ (pointsPerFrame);
        startX += dx
        startY += dy

        new Point(pos, time, airV, throttle)


    }
}


let Points = []

class Point{

    constructor(pos, t, u, throttle){

        this.pos = pos
        this.u = u;
        this.t = t;

        this.throttle = throttle;

        this.prevS = 0;

        Points.push(this);
        if (Points.length  > pointNum) {

            Points.shift();
        }
    }

    update(){

        var s = (this.u.mag() * this.t) - (deceleration  * (this.t ** 2)/ 2)

        if (s > this.prevS){

            this.sV = p5.Vector.fromAngle(this.u.heading(), s - this.prevS)
            this.pos.add(this.sV)


            this.prevS = s;
            this.t += 1
        }

    }
}

function drawPoints(){

    if (Points.length > 1){

        for (let index = Points.length - 1; index > 0; index--) {
            
            var point = Points[index];

            point.update();
        }

        var colour = color(255);

        push()
        noFill();

        var thickness = trailThickness;
        var clarity =  255;


        stroke(255);

        for (let index = Points.length - 1; index > 0; index--) {

            var point = Points[index];


            colour.setAlpha(clarity * point.throttle / 100)
            stroke(colour);
            strokeWeight(thickness * point.throttle / 100);

            const nextPoint = Points[index - 1];
            
            line(point.pos.x, point.pos.y, nextPoint.pos.x, nextPoint.pos.y)

            clarity -= clarityDecrement
            thickness += thicknessIncrement
        }

        pop();

    }
}

