
const tScale =0.65;
const mScale = 1;
const g = 9.81

const airDensity = 1.225;

const airDensityOffset = 0.8;
const airDensityMultiplier = 2000;
const airDensityC = -0.002;

const responsiveness = 1.1;
const pitchResponsiveness = 5;


let plane;
let canvas;

let boxImg;
let planeImg;


function preload(){

    boxImg = loadImage('box.png');
    planeImg = loadImage('F35.png');
}

function setup() {

    canvas = createCanvas(innerWidth, innerHeight);

    plane = new Plane(350, height-40, 0.05);

}




function draw() {

    var rotation = 0;


    if (keyIsDown(RIGHT_ARROW)) {


        rotation =  Math.max(0.005, rotation * pitchResponsiveness)
        plane.rotate(rotation);
    
    } else if (keyIsDown(LEFT_ARROW)) {

        rotation =  Math.min(-0.005, rotation * pitchResponsiveness)
        plane.rotate(rotation);

    } else{
        rotation = 0;
    }
    
    if (keyIsDown(UP_ARROW)) {

        plane.throttle = Math.min(100, plane.throttle + 1);

    } else if (keyIsDown(DOWN_ARROW)) {

        plane.throttle = Math.max(0, plane.throttle - 1);
    }

    if (keyIsDown(83)){

        plane.brake = Math.min(100, Math.max(responsiveness, plane.brake * responsiveness));

    } else {

        plane.brake = 0;
    }

    if (keyIsDown(65)){

        plane.flaps = Math.min(100, Math.max(responsiveness, plane.flaps * responsiveness));

    } else {

        plane.flaps = 0;
    }

    if (keyIsDown(87)){

        plane.afterBurn = Math.min(100, Math.max(responsiveness, plane.afterBurn * responsiveness));

    } else {

        plane.afterBurn = 0;
    }

    if (keyIsDown(68)){

        plane.spoiler = Math.min(100, Math.max(responsiveness, plane.spoiler * responsiveness));

    } else {

        plane.spoiler = 0;
    }

    plane.update();

    background(255);
    translate(innerWidth/2, innerHeight/2);
    rotate(-plane.angle * 1);
    translate(-innerWidth/2, -innerHeight/2);

    translate(-plane.position.x + (innerWidth/2), -plane.position.y+ (innerHeight/2));


    line(-width * 1000, height, width * 10000, height)

    plane.show();


}

