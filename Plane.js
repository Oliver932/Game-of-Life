

class Plane {

    constructor(x, y){

        this.throttle = 0;
        this.brake = 0;
        this.flaps = 0;
        this.afterBurn = 0;
        this.spoiler = 0;

        this.w = 16;
        this.h = 4.5;

        this.Thrust = 191000;
        this.coreExhaustVelocity = 400;
        this.afterBurnerAddition = 200;
        this.fanExhaustVelocity = 540;



        this.intakeDiameter = 1.5;
        this.fuelRatio = 0.02;
        this.bypassRatio = 0.55;

        this.suction = this.Thrust / (((this.intakeDiameter ** 2)/4) * PI * (1/(airDensityOffset) + airDensityC) * (this.coreExhaustVelocity* (1 + this.fuelRatio)));
        console.log(this.suction);

        this.minDrag = 0.016;

        this.brakeMultiplier = 1.2;
        this.brakeArea = 6;

        this.dragMultiplier = 2/3;

        this.flapLift = 1;
        this.flapDrag = 1.3;

        this.spoilerLift = 0.3;
        this.spoilerDrag = 1.05;

        this.mass = 21000;
        this.wingArea = 45;
        this.frontalArea = 5;

        this.maxAngle = 1;
        this.stabilityRange = 1;


        this.position = new p5.Vector(x, y)
        this.velocity = new p5.Vector(0, 0);
        this.angle = 0;

    
    }

    update(){


        angleMode(RADIANS)

        this.velocityAngle = this.velocity.heading();


        this.altitude = height - this.position.y

        this.airDensity = Math.max(0, 1/((this.altitude / airDensityMultiplier) + airDensityOffset) + airDensityC);


        if (this.velocity.mag() > 0){

            var force = p5.Vector.fromAngle(this.angle, 1);

            this.angleOfAttack = force.angleBetween(this.velocity);

            this.speed = this.velocity.mag()
            this.airSpeed = (cos(this.angleOfAttack) * this.speed);

            this.dragCoefficient = this.dragMultiplier * (1- cos(2* this.angleOfAttack)) + this.minDrag + (this.flapDrag * this.flaps / 100) + (this.spoilerDrag * this.spoiler / 100)

            this.drag = Math.min(Math.abs(this.airDensity * this.dragCoefficient * this.frontalArea * ((this.speed ** 2) / 2), Math.abs(this.speed * this.mass)));

            var A = degrees(this.angleOfAttack);
            if (this.angleOfAttack < 0){
                A += 180
            }

            this.liftCoefficient = (1.5599376454047093 / (10 ** 18)) * (A ** 10) - (1.2817626387384176 / (10 ** 15)) * (A ** 9) + (4.3711814292424807 / (10 ** 13)) * (A ** 8) - (7.9320282453665939 / (10 ** 11)) * (A ** 7) + (8.0646679763492981 / (10 ** 9)) * (A ** 6) - (4.2358155634570111 / (10 ** 7)) * (A ** 5) + (5.9484212356433018 / (10 ** 6)) * (A ** 4) + (4.4487443870946638 / (10 ** 4)) * (A ** 3) - (2.1180232557629925 / (10 ** 2)) * (A ** 2) + (2.9684208383947552 / (10)) * (A) + (3.5589068758850130 / (10 ** 2)) + (this.flapLift * this.flaps / 100) - (this.spoilerLift * this.spoiler / 100)
            
            this.lift = this.airDensity * this.liftCoefficient * this.wingArea * (this.speed  ** 2) / 2;

            if (this.brake > 0){
                this.brakeCoefficient = (1 - cos(2* this.angleOfAttack - PI)) * this.brakeMultiplier * (this.brake/100)

                this.braking = Math.min(Math.abs(this.airDensity * this.brakeCoefficient * this.brakeArea * (this.speed  ** 2) / 2), Math.abs(this.speed * this.mass));
            } else{

                this.brakeCoefficient = 0;
                this.braking = 0;
            }
    

        } else {

            this.speed = 0;
            this.airSpeed = 0; 
            this.angleOfAttack = 0;
            this.velocityAngle = 0;
            this.dragCoefficient = 0;
            this.drag = 0
            this.liftCoefficient = 0;
            this.lift = 0;
            this.brakeCoefficient=0;
            this.braking=0;
    
        }

        if (this.airSpeed > -this.suction){ 

            this.massFlowRate = Math.max(0, this.airDensity * (this.intakeDiameter ** 2)/4 * PI * (this.airSpeed + this.suction));

            this.thrust = Math.max(0, this.massFlowRate* Math.max(0,((this.coreExhaustVelocity + (this.afterBurnerAddition * this.afterBurn /100))* (1 + this.fuelRatio) * (this.throttle / 100) ) - Math.max(0, this.airSpeed)))

        } else{

            this.massFlowRate = 0;

            this.thrust = 0;
        }

        var dragV = p5.Vector.fromAngle(this.velocityAngle, -this.drag * (tScale ** 2) / this.mass);
        var liftV = p5.Vector.fromAngle(this.velocityAngle - PI/2 , this.lift * (tScale ** 2)  / this.mass);
        var thrustV = p5.Vector.fromAngle(this.angle, this.thrust * (tScale ** 2)  /this.mass);


        var combination = thrustV.add(dragV.add(liftV))


        if (this.altitude > 0){

            combination.add(new p5.Vector(0, Math.min(g * (tScale ** 2), this.altitude)));
        } 

        if (this.brake > 0){

            combination.add(p5.Vector.fromAngle(this.velocityAngle, -this.braking * (tScale ** 2)  /this.mass));

        }

        combination.add(new p5.Vector(0, Math.min(g * (tScale ** 2), -1 * (this.velocity.y + combination.y) + this.altitude)));
        

        this.acceleration = combination.mag() / g
        this.accelerationAngle = combination.heading();


        this.velocity.add(combination);

        // stabilise
        var force = p5.Vector.fromAngle(this.angle, 1);
        var newAA = force.angleBetween(this.velocity);

        if (Math.sign(newAA) != Math.sign(this.angleOfAttack) && this.angleOfAttack!= 0 && newAA != 0){

            this.velocity = p5.Vector.fromAngle(this.angle, cos(newAA) * this.velocity.mag());
            this.angleOfAttack = 0;
        }


        this.position.add(this.velocity);



        // create Trail
        if (this.throttle > 0){
            createTrails(this.position.x, this.position.y, this.velocity.x, this.velocity.y)
        }

        // calculations for indicator rings


        this.gAngle = -this.angle + PI/2;
        this.vAngle =  this.velocityAngle - this.angle;
        this.aAngle = this.accelerationAngle - this.angle;




    }


    rotate(angle){

        this.angle += angle;

    }

    show(){
    


        const pos = this.position;
        const angle = this.angle; 

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
        text('AirDensity: ' + round(this.airDensity,2) + 'Kg/m**3 \nAirSpeed: ' + round(this.airSpeed,2)  + 'm/s \nDc: ' + round(this.dragCoefficient,2) + ' \nDrag: ' + round(this.drag / 1000,2)  + 'kN \nLc: ' + round(this.liftCoefficient,2) + ' \nLift: ' + round(this.lift/1000,2)  + 'kN \nMFR: ' + round(this.massFlowRate,2) + 'kg/s \nThrust: ' + round(this.thrust / 1000,2) + 'kN\nBc: ' + round(this.brakeCoefficient,2) + '\nBraking: ' + round(this.braking/1000,2) + 'kN', -width/2 +10, height/2 - 160);


        text('Throttle: ' + round(this.throttle)  + '% \nBraking: ' + round(this.brake)  + '% \nFlaps: ' + round(this.flaps)  + '% \nAfterBurn: ' + round(this.afterBurn)  + '% \nSpoiler: ' + round(this.spoiler)  + '% \n', width/2 -100, height/2 - 160);

        noFill();
        strokeWeight(10);

        stroke(0, 0, 255);
        arc(0 , 0, 700, 700, this.gAngle-0.2, this.gAngle + 0.2);

        push()
        noStroke();
        fill(0, 0, 255)
        textSize(20)
        textAlign(CENTER);
        rotate(this.gAngle - PI / 2)
        text(round(this.altitude / 1000,2) + 'km', 0, 750 / 2)
        pop()

        const vWidth = 0.03


        stroke(0, 100, 0);
        if (Math.abs(this.vAngle) > vWidth){


            if(this.vAngle < 0){
                arc(0 , 0, 500, 500, this.vAngle, 0);
            } else {
                arc(0 , 0, 500, 500, 0, this.vAngle);
            }

            push()
            noStroke();
            fill(0, 100, 0)
            textSize(20)
            textAlign(CENTER);
            rotate(0 - PI/2)
            text(round(degrees(this.angleOfAttack)) , 0, 550 / 2)
            pop()

        }

        push()
        noStroke();
        fill(0, 255, 0)
        textSize(20)
        textAlign(CENTER);
        rotate(this.vAngle - PI / 2)

        if (this.speed < vSound){
            text(round(this.speed) + 'm/s', 0, 550 / 2)
        } else {
            text('Mach ' + round(this.speed / vSound, 1), 0, 550 / 2)
        }
        pop()

        stroke(0, 255, 0);
        arc(0 , 0, 500, 500, this.vAngle - vWidth, this.vAngle + vWidth);

        stroke(255, 0, 0);
        arc(0 , 0, 600, 600, this.aAngle - vWidth, this.aAngle + vWidth);

        push()
        noStroke();
        fill(255, 0, 0)
        textSize(20)
        textAlign(CENTER);
        rotate(this.aAngle - PI / 2)
        text(round(this.acceleration,2) + 'g', 0, 650 / 2)
        pop()

        stroke(255);

        if (Math.abs(this.angle) > 0.005){
            if (this.angle < 0){
                arc(0 , 0, 400, 400, 0, -this.angle);
            } else if (this.angle > 0){
                arc(0 , 0, 400, 400, -this.angle, 0);
            }

        }

        push()
        noStroke();
        fill(255)
        textSize(20)
        textAlign(CENTER);
        rotate(0 - PI / 2)
        text(round(degrees(this.angle * -1)) , 0, 450 / 2)
        pop()


        pop();
    }
}