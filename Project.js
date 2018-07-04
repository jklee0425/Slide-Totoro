// variables
let dif = document.getElementById("difficulty"),
    name = document.getElementById("name"),
    canvas = document.getElementById("totoro"),
    info = document.getElementById("info"),
    sW = document.getElementById("stopWatch"),
    startGame = document.getElementById("start"),
    size = document.getElementById("totoro").width;

let ctx = canvas.getContext("2d"),
    level, display, puzzle, pieceSize,
    solved = false,
    m = 0, s = 0;

let pieces = new Array,
    emptyLo = new Object,
    clickLo = new Object,
    tempLo = new Object;

// set image
let totoro = new Image(500, 500);
totoro.src = 'totoro.jpg';

// load the image in the page
window.onload = function(){
    ctx.drawImage(totoro, 0, 0);
}
// give puzzle pieces location
function puzzleLo(){
    for(let i=0; i<dif.value; i++){
        pieces[i] = new Array;
        for(let j=0; j<dif.value; j++){
            pieces[i][j] = new Location(i, j);
        }
    }
    emptyLo = new Location(Math.floor(Math.random()*dif.value), Math.floor(Math.random()*dif.value));
}
// reload the canvas
function drawPuzzle(){
    ctx.clearRect(0, 0, size, size);
    for(let i=0; i<dif.value; i++){
        for(let j=0; j<dif.value; j++){
            if(i != emptyLo.x || j != emptyLo.y){
                ctx.drawImage(totoro, pieces[i][j].x * pieceSize, pieces[i][j].y * pieceSize, pieceSize, pieceSize,
                                                   i * pieceSize, j * pieceSize, pieceSize, pieceSize);
            }
        } 
    }
}
// slide a piece to "to" location
function slide(to){
    if(!(solved)){
        tempLo = JSON.parse(JSON.stringify(pieces[to.x][to.y]));
        pieces[to.x][to.y] = new Location(pieces[emptyLo.x][emptyLo.y].x, pieces[emptyLo.x][emptyLo.y].y);
        pieces[emptyLo.x][emptyLo.y] = new Location(tempLo.x, tempLo.y);
        emptyLo = new Location(to.x, to.y);
    }
}
// randomly distribute the pieces
function randomPuzzle(n){
    for(let i = 0; i < n; i++){
        let r = Math.floor(Math.random() * 4);
        let container = new Object;
        if(r == 0 && emptyLo.x > 0){
            container = new Location(emptyLo.x - 1, emptyLo.y);
        }else if(r == 1 && emptyLo.x < dif.value - 1){
            container = new Location(emptyLo.x + 1, emptyLo.y);
        }else if(r == 2 && emptyLo.y > 0){
            container = new Location(emptyLo.x, emptyLo.y - 1);
        }else if(r == 3 && emptyLo.y < dif.value - 1){
            container = new Location(emptyLo.x, emptyLo.y + 1);
        }else{
            continue;
        }
        slide(container);
    }
}
// check if the game is completed
function checkSolved(){
    solved = true;
    for(let i=0; i<dif.value; i++){
        for(let j=0; j<dif.value; j++){
            if(pieces[i][j].x != i || pieces[i][j].y != j){
                if(pieces[i][j].x == emptyLo.x && pieces[i][j].y == emptyLo.y){
                    continue;
                }
                solved = false;
            }
        }
    }
    if(solved){
        ctx.drawImage(totoro, 0, 0);
        if(m <= 5){
            setTimeout(function(){
                let moreRound = confirm("That's under 5 minutes, nailed it!, one more round?");
                if(moreRound){
                    window.location.reload();
                }
            }, 500);
        }else{
            setTimeout(function(){alert("Nice job!");}, 500);
       }
    }
}
// return true if they are adjacent, return false otherwise
function distance(a, b){
    if(Math.abs(a.x - b.x) + Math.abs(a.y - b.y) == 1){
        return true;
    } else {
        return false;
    }
}
// set location
function Location(x, y){
    this.x = x;
    this.y = y;
}

function stopWatch(){
    setInterval(time, 1000);
}
// calculate time
function time(){
    s++;
    if(s >= 60){
        s = 0;
        m++;
    }
    display = (m ? (m > 9 ? m : "0" + m) : "00") + ":" + (s > 9 ? s : "0" + s);
    sW.innerHTML = display;
}
// start the game if the start button is clicked
startGame.addEventListener('click', function(){
    pieceSize = size / dif.value;
    puzzleLo();
    stopWatch();
    level = (dif.value == 5 ? "Hard" : (dif.value == 4 ? "Medium" : "Easy"));
    info.innerHTML = "Player: " + name.value + "<br>" + "Difficulty: " + level;
    sW.innerHTML = "00:00";
    startGame.style.display = "none";
    randomPuzzle(dif.value * 10);
    drawPuzzle();
});
// get the clicked location when the canvas is clicked
canvas.addEventListener('click', function(){
    if(event.offsetX < size / dif.value){
        clickLo.x = 0;
    } else if(event.offsetX < 2 * size / dif.value){
        clickLo.x = 1;
    } else if(event.offsetX < 3 * size / dif.value){
        clickLo.x = 2;
    } else if(event.offsetX < 4 * size / dif.value){
        clickLo.x = 3;
    } else {
        clickLo.x = 4;
    }
    if(event.offsetY < size / dif.value){
        clickLo.y = 0;
    } else if(event.offsetY < 2 * size / dif.value){
        clickLo.y = 1;
    } else if(event.offsetY < 3 * size / dif.value){
        clickLo.y = 2;
    } else if(event.offsetY < 4 * size / dif.value){
        clickLo.y = 3;
    } else {
        clickLo.y = 4;
    }
});
// slide the puzzle piece accordingly
canvas.addEventListener('click', function(){
    if(distance(clickLo, emptyLo)){
        slide(clickLo);
        drawPuzzle();
    }
   checkSolved();
});