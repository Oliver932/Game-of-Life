

class Plane {

    constructor(x, y, scale){

        this.throttle = 0;

        this.w = 16;
        this.h = 4.5;

        this.thrust = 180000;
        this.coreExhaustVelocity = 540;
        this.fanExhaustVelocity = 540;
        this.offset = 5


        this.intakeDiameter = 1.5;
        this.fuelRatio = 0.02;
        this.bypassRatio = 0.55;

        this.minDrag = 0.016;

        this.mass = 21000;
        this.wingArea = 50;
        this.frontalArea = 5;

        const options = {
            frictionAir:0,
            friction:0,
            restitution:0.5
        }

        this.body = Bodies.rectangle(x, y, this.w, this.h, options);
        
        Body.setMass(this.body, this.mass)
        Composite.add(world, this.body)


        // Body.setVelocity(this.body, {x:3, y:0});
    
    }

    update(){

        angleMode(RADIANS)

        var velocity = new p5.Vector(this.body.velocity.x, this.body.velocity.y)

        this.altitude = height - this.body.position.y - this.h/2

        if (velocity.mag() > 0){

            const force = p5.Vector.fromAngle(this.body.angle, 1);

            this.angleOfAttack = force.angleBetween(velocity);


            this.airSpeed = (cos(this.angleOfAttack) * velocity.mag());
            this.speed = this.body.speed

            this.dragCoefficient = 1- cos(2* this.angleOfAttack) + this.minDrag

            
            console.log(this.body.speed, this.body.inertia);
            this.drag = Math.min(Math.abs(airDensity * this.dragCoefficient * this.frontalArea * ((this.speed ** 2) / 2), Math.abs(this.speed * this.mass)));

            var A = degrees(this.angleOfAttack);
            if (this.angleOfAttack < 0){
                A += 180
            }

            this.liftCoefficient = (1.5599376454047093 / (10 ** 18)) * (A ** 10) - (1.2817626387384176 / (10 ** 15)) * (A ** 9) + (4.3711814292424807 / (10 ** 13)) * (A ** 8) - (7.9320282453665939 / (10 ** 11)) * (A ** 7) + (8.0646679763492981 / (10 ** 9)) * (A ** 6) - (4.2358155634570111 / (10 ** 7)) * (A ** 5) + (5.9484212356433018 / (10 ** 6)) * (A ** 4) + (4.4487443870946638 / (10 ** 4)) * (A ** 3) - (2.1180232557629925 / (10 ** 2)) * (A ** 2) + (2.9684208383947552 / (10)) * (A) + (3.5589068758850130 / (10 ** 2))
        
            this.lift = airDensity * this.liftCoefficient * this.wingArea * (this.speed  ** 2) / 2

    

        } else {


            this.airSpeed = 0; 
            this.angleOfAttack = 0;
            this.dragCoefficient = 0;
            this.drag = 0
            this.liftCoefficient = 0;
            this.lift = 0;
    
        }

        if (this.airSpeed > -this.offset){ 

            this.massFlowRate = Math.max(0, airDensity * (this.intakeDiameter ** 2)/4 * (this.airSpeed + this.offset));

            this.thrust = Math.max(0, this.massFlowRate*((this.coreExhaustVelocity * (1 + this.fuelRatio) * (this.throttle / 100)) - this.airSpeed))

        } else{

            this.massFlowRate = 0;

            this.thrust = 0;
        }

        var dragV = p5.Vector.fromAngle(this.body.angle - this.angleOfAttack, -this.drag * (tScale ** 2) / this.mass);
        var liftV = p5.Vector.fromAngle(this.body.angle - this.angleOfAttack - PI/2 , this.lift * (tScale ** 2)  / this.mass);
        var thrustV = p5.Vector.fromAngle(this.body.angle, this.thrust * (tScale ** 2)  /this.mass);

        if (this.altitude > 0){
            var gV = new p5.Vector(0, g );
        } else {
            var gV = new p5.Vector(0, 0);
        }

        var combination = thrustV.add(dragV.add(liftV.add(gV)))
        this.acceleration = combination.mag() / g

        Body.setVelocity(this.body, velocity.add(combination));


    }

    rotate(angle){

        Body.rotate(this.body, angle, this.body.position);
    }

    show(){
    


        const pos = this.body.position;
        const angle = this.body.angle; 

        push();

        //DrawPlane

        translate(pos.x, pos.y);
        rotate(angle);

        fill(255);
        imageMode(CENTER);
        image(planeImg, 0, 0, this.w, this.h);

        //DrawStats


        textSize(10);
        stroke(0)
        fill(0)
        text('Throttle: ' + this.throttle  + '\nAA: ' + round(degrees(this.angleOfAttack),2) + ' \nAirSpeed: ' + round(this.airSpeed,2)  + 'm/s \nDc: ' + round(this.dragCoefficient,2) + ' \nDrag: ' + round(this.drag,2)  + ' \nLc: ' + round(this.liftCoefficient,2) + ' \nLift: ' + round(this.lift,2)  + ' \nAltitude: ' + round(this.altitude,2) + 'm \nMFR: ' + round(this.massFlowRate,2) + ' \nThrust: ' + round(this.thrust / 1000,2) + 'kN\n ACC: ' + round(this.acceleration,2) + 'g', -width/2 +10, height/2 - 140);




        pop();
    }
}