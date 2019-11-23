const canvas = document.getElementById("canvas");

canvas.width = window.innerWidth * 3 / 5;
canvas.height = window.innerHeight * 4;

const ctx = canvas.getContext("2d");

const sections = 7;//Inside sections will be drawned all our bricks 
let leftPressed = false;
let rightPressed = false;
const size = 30;
let brickNumber = 22;

let character = {
    x: canvas.width / 2 - size / 2,
    y: canvas.height - 2 * size,
}

let moves = 0; //For auto jumping
const difference = canvas.height / brickNumber;//Difference between each block
let brickY = canvas.height - difference;
let counter = 0;

let brickMargin = 15;
let brickWidth = canvas.width/sections - 2 * brickMargin;
let brickHeight = 20;

//Colision
let colision = false;
//If character jupm on block,start jumping from there-Need improvment!!
function detectColision(){
    for(let i=0;i<brickNumber;i++){
        if(character.x > brickPosition[i][0] && character.x < brickPosition[i][0] + brickWidth 
        && character.y + size>  brickPosition[i][1] && character.y + size< brickPosition[i][1] + brickHeight){
        colision = true; 
        moves=0;
        }
    }
}
//If portal is detected-you passed level-Need improvment!
function detectColisionPortal(){
    for(let i=0;i<brickNumber;i++){
        if(character.x > canvas.width/2-35 && character.x < canvas.width/2-35 + 70 
            && character.y + size> 60 && character.y + size< 150){
        console.log("You win");
        }
    }
}



//Draw sections for bricks
function drawSection(){
    for(let i = 0; i < sections ;i++){
    ctx.beginPath();
    ctx.rect(i*canvas.width/sections, 0, canvas.width/sections, canvas.height);
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.closePath();
    }
}

//Draw character
function drawCharacter(){    
    ctx.beginPath();
    ctx.rect(character.x, character.y, size, size);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
}

//Draw ground
function drawGround(){
    ctx.beginPath();
    ctx.rect(0, canvas.height - size, canvas.width, size);
    ctx.fillStyle = "darkgreen";
    ctx.fill();
    ctx.closePath();
}

//Save brick position in brickPosition,so bricks will always be drawned in same place after clearRect
let brickPosition = [];

//Save bricks positions
function brickPositionDeclaration(){
    for(let i = 0; i < brickNumber; i++){
    let random = Math.floor(Math.random() * sections);
    let brickX = random * canvas.width / sections + brickMargin;
    brickY -= 100;
    brickPosition[i]=[brickX , brickY];
    }
}
brickPositionDeclaration();
//Draw bricks
function drawBrick(){
    for(let i = 0; i < brickNumber; i++){
    ctx.beginPath();
    ctx.rect(brickPosition[i][0], brickPosition[i][1], brickWidth, brickHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
    }
}

//Main function
function draw(){
    //Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //Call all functions inside draw function
    drawSection();
    drawCharacter();
    drawGround();
    drawBrick();
    detectColision();
    detectColisionPortal();

    //This loop is moving character from top to bottom(auto-jumping)
    for(let i = 0; i < 160;i++){
        if(moves <= 80 ){
            character.y -= 3;
        }
     
        else if(moves <= 160 ){
            character.y += 3;
        }    
        else{
            moves = 0;
        }
        moves++;
    }
    //Move character right
    if(rightPressed && character.x < canvas.width - size) {
        character.x += 2.3;
    }
    //Move character left
    else if(leftPressed && character.x > 0) {
        character.x -= 2.3;
    }
    //If character go of the canvas from right,move him to the left
    else if(rightPressed && character.x < canvas.width){
        character.x = - size + 1;
        character.x += 2.3;
    }
    //If character go of the canvas from left,move him to the right
    else if(leftPressed && character.x < 0){
        character.x = canvas.width - 1;
        character.x += 2.3;
    }
    requestAnimationFrame(draw);
}

//Event Listeners
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e){
    if(e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}
function keyUpHandler(e){
    if(e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}
draw();