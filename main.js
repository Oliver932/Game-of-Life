
var cellSize = 3;
var columns = Math.floor(innerWidth / cellSize);
var rows = Math.floor(innerHeight / cellSize);


function setup() {

    createCanvas(columns * cellSize, rows * cellSize);


}


function draw() {

    background(200);

    drawGrid();

}



function drawGrid(){

    stroke(0);
    strokeWeight(cellSize / 5)

    for (let x = 0; x <= columns; x++) {
        
        line(x * cellSize, 0, x * cellSize, innerHeight)
    }

    for (let y = 0; y <= rows; y++) {

        line(0, y * cellSize, innerWidth, y * cellSize)
    }


}




