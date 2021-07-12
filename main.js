const {Engine, Bodies, MouseConstraint, World, Mouse, Constraint, Body, Vector, Composite} = Matter;
const tScale = 0.5;
const mScale = 1;
const g = 9.81
const airDensity = 1.225;

let ground;
let boxes = [];
let plane;
let world,engine;
let canvas;

let boxImg;
let planeImg;


function preload(){

    boxImg = loadImage('box.png');
    planeImg = loadImage('F35.png');
}

function setup() {

    canvas = createCanvas(innerWidth, innerHeight);
    console.log(Matter);


    const options = {

        gravity:{
            scale:1,
            y:0
        }
    }

    engine = Engine.create(options);
    world = engine.world;


    ground = new Ground(0, height+100, width * 2000, 200);

    // for (let u=0; u<4; u++){

    //     for (let i=0; i<8; i++){
    //         boxes.push(new Box(1000 + u * 65, height - (i * 60), 60, 60));
    //     }
    // }

    plane = new Plane(350, height-10, 0.05);

}

// function keyPressed(){

//     if (keyCode == LEFT_ARROW){

//         while (keyIsPressed === true){

//             plane.rotate(-0.05);
//         }
//     }
// }


function draw() {


    if (keyIsDown(RIGHT_ARROW)) {

        plane.rotate(0.001);
    
    } else if (keyIsDown(LEFT_ARROW)) {

        plane.rotate(-0.001);

    } 
    
    if (keyIsDown(UP_ARROW)) {

        plane.throttle = Math.min(100, plane.throttle + 1);

    } else if (keyIsDown(DOWN_ARROW)) {

        plane.throttle = Math.max(0, plane.throttle - 1);
    }

    if (keyIsDown(83)){

        plane.brake = 100;

    } else {

        plane.brake = 0;
    }

    if (keyIsDown(65)){

        plane.flaps = 100;

    } else {

        plane.flaps = 0;
    }

    // }  else if (keyIsDown(ENTER)){

    //     plane.update();
    //     Engine.update(engine);
    // }

    Engine.update(engine);
    plane.update();

    background(255);
    translate(innerWidth/2, innerHeight/2);
    rotate(-plane.body.angle * 1);
    translate(-innerWidth/2, -innerHeight/2);

    translate(-plane.body.position.x + (innerWidth/2), -plane.body.position.y+ (innerHeight/2));


    ground.show();
    for (let box of boxes){
        box.show();
    }

    plane.show();


}

