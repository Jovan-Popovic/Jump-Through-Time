const canvas = document.getElementById("canvas");

canvas.width = window.innerWidth * 2 / 5;
canvas.height = window.innerHeight ;

const ctx = canvas.getContext("2d");

//Declare variables for images
let brickImg = new Image();
let characterImg = new Image();
let background = new Image();

//Declare variables for sound effects
let dead = new Audio();
let jump = new Audio();
let win = new Audio();
let music = new Audio();

//Add sources for images and sound effects (background source is added in draw function)
brickImg.src = "assets/img/brick.png"
characterImg.src = "assets/img/character.png"
dead.src = "assets/audio/dead.mp3";
jump.src = "assets/audio/jump.mp3";
win.src = "assets/audio/win.mp3";
music.src = "assets/audio/music.mp3";

music.volume = 0.4;//Sound volume

//Array for all background image sources
let images = ["assets/img/bg1.png", "assets/img/bg2.jpg", "assets/img/bg3.jpg"];

const sections = 7;//Inside sections will be drawned all our bricks 
let leftPressed = false;
let rightPressed = false;
const size = 35;
let brickNumber = 12;
const speed = 4;
let level = 1;

let character = {
    x: canvas.width / 2 - size / 2,
    y: canvas.height - 2 * size,
}

let moves = 0; //For auto jumping
const difference = canvas.height / brickNumber;//Difference between each block
let brickY = canvas.height - difference;

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
          if((character.x > brickPosition[i][0] && character.x < brickPosition[i][0] + brickWidth || character.x + size >= brickPosition[i][0] && character.x + size <= brickPosition[i][0] + brickWidth)){
            colision = true; 
            moves=0;
            colisionNumber++;
            jump.play();
          }
        }
        else{
            colision=false;
        }
    }
}

//Brick movement-random
let ability = [];
let counter = 0;
function abilityGiven(){
    for(let i = 0 ; i < brickNumber-1 ; i++){
       let chance = Math.floor(Math.random()*6);
       if(chance == 5){
         ability[i] = true;
         counter++;
       }
       else{
         ability[i] = false;
       }
    }
}

//Ground colision-important for game over
let colisionGround = false;
function detectColisionGround(){
    if(character.y + size >= canvas.height-size && character.y + size <= canvas.height){
      if((character.x + 3 >= 0 && character.x + 3 <= canvas.width - size || 
          character.x + size -3 >= size && character.x + size -3 <= canvas.width)){
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
    ctx.rect(i * canvas.width / sections, 0, canvas.width / sections, canvas.height);
    ctx.strokeStyle = "#000000";
    ctx.stroke();
    ctx.closePath();
    }
}


//Draw ground
function drawGround(){
    ctx.beginPath();
    ctx.rect(0, canvas.height - size, canvas.width, size);
    ctx.stroke();
    ctx.closePath();
}

//Save brick position in brickPosition,so bricks will always be drawned in same place after clearRect
let brickPosition = [];
    abilityGiven();
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
    ctx.drawImage(brickImg , brickPosition[i][0] , brickPosition[i][1] , brickWidth , brickHeight);
    }
}

//Move special bricks to right and then teleport them to left side
function specialBrickMovement(){
    for(let i = 0; i < brickNumber; i++){
        if(ability[i]){
            if(brickPosition[i][0]+brickWidth <= canvas.width){
                brickPosition[i][0] += speed;
            }
            else {
                while(brickPosition[i][0] >= 0 ){
                brickPosition[i][0] -= speed;
                }
            }
        }
    }
}

//Move character
function moveCharacter(){
    //Move character right
    if(rightPressed && character.x < canvas.width - size) {
        character.x += speed;
    }
    //Move character left
    else if(leftPressed && character.x > 0) {
        character.x -= speed;
    }
    //If character go of the canvas from right,move him to the left
    else if(rightPressed && character.x < canvas.width){
        character.x = - size + 1;
        character.x += speed;
    }
    //If character go of the canvas from left,move him to the right
    else if(leftPressed && character.x < 0){
        character.x = canvas.width - 1;
        character.x += speed;
    }
}

//Draw level in top left corner
function drawLevel(){
    ctx.fillStyle = "white";
    ctx.font = "30px Changa one";
    ctx.fillText(`Level ${level}` ,size, size);
}

//Auto jumping
function autoJump(){
    //This loop is moving character from top to bottom(auto-jumping)
    if(moves <= 42 ){
        character.y -= speed;
    }
    else if(moves <= 84 || colision != true){
        character.y += speed;
    }     
    else{
        moves = 0;
    }
    moves++;
}

//Level up-call when character jump out of the canvas
function levelUp(){
    if(character.y <= - 2 * size && level <= 3){
        alert("Next level!");
        character.y = canvas.height - 2 * size;
        character.x = canvas.width / 2 + size / 2;
        level++;
        colisionNumber = 0;

        //Declare new positions for bricks for new levels
        for(let i = 0; i < brickNumber-1; i++){
            brickPosition[i]=[];
            }
        brickY = canvas.height - difference;
        j=0;
        abilityGiven();
        brickPositionDeclaration();
    }
}

//Game over-call when character fall on ground after first colision
function gameOver(){
    if(colisionGround === true && colisionNumber > 0){
        music.pause();
        dead.play();
        alert("GAME OVER");
        document.location.reload();
    }
}

//Win game-call when you finish last level
function winGame(){
    if(level >= 4){
        music.pause();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        alert("YOU WIN!");
        win.play();
        document.location.reload();
    }
}

//Main function
function draw(){
    setInterval(() => {music.play();}, 2000);//Play backgroud music
    background.src = `${images[level-1]}`;//Change background for each level
    ctx.clearRect(0, 0, canvas.width, canvas.height);//Clear canvas
    ctx.drawImage(background,0,0,canvas.width,canvas.height);//Draw our background
    //Call functions inside draw function
    drawBrick();
    detectColision();
    detectColisionGround();
    moveCharacter();
    autoJump();
    ctx.drawImage(characterImg, character.x, character.y, size, size);
    specialBrickMovement();
    levelUp();
    gameOver();
    winGame();
    drawLevel();
    requestAnimationFrame(draw);
}

//Event Listeners for left and right arrow
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
//Calling draw function
draw();
