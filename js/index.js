const canvas = document.getElementById("canvas");

canvas.width = window.innerWidth * 2 / 5;
canvas.height = window.innerHeight ;

const ctx = canvas.getContext("2d");

let level = 1;
let background = new Image();//For each level change background
let images = ["assets/img/bg1.png", "assets/img/bg2.jpg", "assets/img/bg3.jpg", "assets/img/bg.jbg"];

const sections = 7;//Inside sections will be drawned all our bricks 
let leftPressed = false;
let rightPressed = false;
const size = 30;
let brickNumber = 12;

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
let colisionNumber=0;
//If character jupm on block,start jumping from there-Need improvment!!
function detectColision(){
    for(let i=0;i<brickNumber-1;i++){
        if(character.y +size> brickPosition[i][1] && character.y + size< brickPosition[i][1] + brickHeight){
        if((character.x > brickPosition[i][0] && character.x < brickPosition[i][0] + brickWidth || character.x + size >= brickPosition[i][0] && character.x + size <= brickPosition[i][0] + brickWidth))
        {
          colision = true; 
          moves=0;
          colisionNumber++;
        }
    }
        else{
            colision=false;       
        }
    }    
}

//ground colision
let colisionGround=false;
function detectColisionGround(){
        if(character.y + size>= canvas.height-size && character.y + size<= canvas.height){
          if((character.x +3>= 0 && character.x +3<= canvas.width - size || 
              character.x + size -3>= 0+size && character.x + size -3<= canvas.width)){
             colisionGround = true; 
             moves=0;
          }
          else {
              colisionGround = false;
          }
       }
        else{
            colisionGround=false;
        }
    
}

//Draw sections for bricks
function drawSection(){
    for(let i = 0; i < sections ;i++){
    ctx.beginPath();
    ctx.rect(i*canvas.width/sections, 0, canvas.width/sections, canvas.height);
    ctx.strokeStyle = "#000000";
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
    ctx.strokeStyle = "darkgreen";
    ctx.stroke();
    ctx.closePath();
}

//Save brick position in brickPosition,so bricks will always be drawned in same place after clearRect
let brickPosition = [];

//Save bricks positions
function brickPositionDeclaration(){
    for(let i = 0; i < brickNumber-1; i++){
    let random = Math.floor(Math.random() * sections);
    let brickX = random * canvas.width / sections + brickMargin;
    brickPosition[i]=[brickX , brickY];
    brickY -= difference;
    }
}
brickPositionDeclaration();
//Draw bricks
function drawBrick(){
    for(let i = 0; i < brickNumber-1; i++){
    ctx.beginPath();
    ctx.rect(brickPosition[i][0], brickPosition[i][1], brickWidth, brickHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
    }
  
}

let lastY = character.y;
//Main function
function draw(){
    background.src = `${images[level-1/*brojac nasih levela*/]}`;
    //Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //Call all functions inside draw function
    ctx.drawImage(background,0,0,canvas.width,canvas.height);   
    drawCharacter();
    //drawGround();
    drawBrick();
    detectColision();
    detectColisionGround();
    //This loop is moving character from top to bottom(auto-jumping)

        if(moves <= 42 ){
            character.y -= 4;
        }
        else if(moves <= 84 || colision!= true){
            character.y += 4;
        }    
        else{
            moves = 0;
        }
        moves++;

    //Move character right
    if(rightPressed && character.x < canvas.width - size) {
        character.x += 4;
    }
    //Move character left
    else if(leftPressed && character.x > 0) {
        character.x -= 4;
    }
    //If character go of the canvas from right,move him to the left
    else if(rightPressed && character.x < canvas.width){
        character.x = - size + 1;
        character.x += 4;
    }
    //If character go of the canvas from left,move him to the right
    else if(leftPressed && character.x < 0){
        character.x = canvas.width - 1;
        character.x += 4;
    }

    if(level == 4){
    alert("you win");
    document.location.reload();

    }
    if(character.y <= -size){
        alert("level up");
        character.y = canvas.height - 2*size;
        character.x = canvas.width/2 + size/2;
        level++;
        lastY = character.y;
        colisionNumber = 0;

        //new bricks
        for(let i = 0; i < brickNumber-1; i++){
            brickPosition[i]=[];
            }
        brickY = canvas.height - difference;
        brickPositionDeclaration();
    }

    ctx.fillStyle = "white";
    ctx.font = "30px Changa one";
    ctx.fillText(`Level ${level}` ,30,50);

    if(colisionGround === true && colisionNumber > 0){
        alert("GAME OVER");
        document.location.reload();
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

//main function
draw();
