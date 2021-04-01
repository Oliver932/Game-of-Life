
var cellSize = 3;
var columns = Math.floor(innerWidth / cellSize);
var rows = Math.floor(innerHeight / cellSize);

var perlinScale = 0.04
var perlinThreshold = 0.5;

function setup() {

    createCanvas(columns * cellSize, rows * cellSize);
    createCells();

}


function draw() {

    background(200);

    drawGrid();

    for (let index = 0; index < Cells.length; index++) {
        const cell = Cells[index];

        cell.draw();
        
    }

}


var Cells = [];

class Cell {

    constructor(x, y) {

        this.x = x;
        this.y = y;

        Cells.push(this);

    }

    draw(){

        fill(0);
        noStroke();
        rect(this.x * cellSize, this.y * cellSize, cellSize, cellSize)
    }
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

function createCells() {

    for (let x = 0; x < columns; x++) {

        for (let y = 0; y < rows; y++) {

            var val = noise(x * perlinScale, y * perlinScale)

            if (val > perlinThreshold) {

                new Cell(x, y);
            }
        }
    }
}




