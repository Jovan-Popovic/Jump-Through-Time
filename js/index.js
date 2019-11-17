let canvas = document.getElementById("canvas");

canvas.width = window.innerWidth*3/5;
canvas.height = window.innerHeight;

let ctx = canvas.getContext("2d");

let sections = 8;
let direction;
let leftPressed = false;
let rightPressed = false;
let characterDimension = 30;
let characterX = canvas.width/2 - characterDimension/2;
let characterY = canvas.height - 30  - characterDimension;
let moves = 0;
let brickY= canvas.height-120;
let counter = 0;
let brickPosition = [];
let blockMargin = 20;
let brickWidth = canvas.width/8-2*blockMargin;
let brickHeight = 20;

document.addEventListener("keydown" , keyDownHandler);
document.addEventListener("keyup" , keyUpHandler);

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

function drawSection(){
    for(let i=0; i<sections ;i++){
    ctx.beginPath();
    ctx.rect(i*canvas.width/sections, 0, canvas.width/sections, canvas.height);
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.closePath();}
}

drawSection();

function draw(){
    let random = Math.floor(Math.random()*sections);
    let brickX = random*canvas.width/8+blockMargin;
    
    ctx.beginPath();
    ctx.rect(brickX, brickY, brickWidth, brickHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
    brickY -= 120;

    brickPosition[counter] = [brickX , brickY];
    requestAnimationFrame(draw);
}

draw();

/*let colision = false;
let fail = false;
function colisionDetection(){
    for(let i=0; i<sections ; i++){
        if((characterX >= brickPosition[i][0] && characterX <=brickPosition[i][0]+brickWidth && characterY >= brickPosition[i][1] && characterY <= brickPosition[i][1] + brickHeight)
        || (characterX + characterHeight >= brickPosition[i][0] && characterX + characterHeight<=brickPosition[i][0]+brickWidth && characterY-characterHeight >= brickPosition[i][1] && characterY-characterHeight <= brickPosition[i][1] + brickHeight)){
            colision = true;
        }
        else{
            colision=false;
        }
        console.log(colision);
    }
   
} */

function drawCharacter(){
    ctx.clearRect(characterX, characterY, characterDimension, characterDimension);
    ctx.beginPath();
    ctx.rect(characterX, characterY, characterDimension, characterDimension);
    ctx.strokeStyle = "#0095DD";
    ctx.stroke();
    ctx.closePath();
    if(moves >= 0 && moves <= 20){
        characterY -= 5;
    }
    else if(moves <= 40){
        characterY += 5;
    }
    else{
        moves = 0;
    }

    if(rightPressed && characterX < canvas.width - characterDimension) {
        characterX += 10;
    }
    else if(leftPressed && characterX > 0) {
        characterX -= 10;
    }
    moves++;
    requestAnimationFrame(drawCharacter);
}

drawCharacter();

function drawGround(){
    ctx.beginPath();
    ctx.rect(0, canvas.height-30, canvas.width, 30);
    ctx.fillStyle = "darkgreen";
    ctx.fill();
    ctx.closePath();
}
drawGround();