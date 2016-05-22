//função que devolve valores aleatórios entre a(inclusive) e b(exclusive)
function rnd(a, b) {
    return (Math.floor(Math.random() * (b - a) + a));
}
//Constantes
var COLS = 26,
    ROWS = 26,
    MULT = 20;
//Valores das Células
var EMPTY=0,
    SNAKE=1,
    FRUIT=2;
//Direções
var LEFT=0,UP=1,RIGHT=2,DOWN=3;
//Códigos das teclas
var KEY_LEFT=37, KEY_UP=38, KEY_RIGHT=39, KEY_DOWN=40, R=82;

//Grelha
var grid = {
    width: undefined,
    height: undefined,
    grid: undefined,
    
    init: function(d, columns, rows) {
        this.width = columns;
        this.height = rows;
        this.grid = [];
        for (var x=0; x < columns; x++){
            this.grid.push([]);
            for (var y=0; y < rows; y++){
                this.grid[x].push(d);
            };
        };
    },
    
    set: function(val, x, y) {
        this.grid[x][y] = val;
    },
    
    get: function(x,y){
        return this.grid[x][y];
    }
};

var snake = {
    direction: undefined,
    queue: undefined,
    last: undefined,
    
    init: function(d, x, y) {
        this.direction = d;
        this.queue = [];
        this.insert(x,y);
    },
    
    insert: function(x,y){
        this.queue.unshift({x:x,y:y});
        this.last = this.queue[0];
    },
    
    remove: function(){
        return this.queue.pop();
    }
};

function setFood() {
    var empty = [];
    for (var x=0; x < grid.width; x++){
        for (var y=0; y < grid.width; y++){
            if (grid.get(x,y) == EMPTY){
                empty.push({x:x,y:y});
            }
        }
    }
    var randPos = empty[rnd(0,empty.length)];
    grid.set(FRUIT, randPos.x, randPos.y);
}

//Game Objects
var canvas, ctx, keystate, frames, score, gameover;

function main() {
    canvas = document.createElement("canvas");
    canvas.width = COLS*MULT;
    canvas.height = ROWS*MULT;
    ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);
    
    createHighScore(null);
    
    document.addEventListener("keydown", function(evt) {
        if (evt.keyCode === KEY_UP    ||
            evt.keyCode === KEY_RIGHT ||
            evt.keyCode === KEY_LEFT  ||
            evt.keyCode === KEY_DOWN){
                keystate = evt.keyCode;
        }else if(evt.keyCode === R){
            gameover = true;
            restart(document.getElementById("end"));
        }
    });
    
    init();
}

function init() {
    
    score = 0;
    frames = 0;
    gameover = false;
    
    grid.init(EMPTY, COLS, ROWS);
    
    keystate = KEY_UP;
    
    var sp = {x: Math.floor(COLS/2), y: ROWS-1};
    snake.init(UP, sp.x, sp.y);
    grid.set(SNAKE,sp.x,sp.y);
    
    setFood();
    
    loop();
}

function loop() {
    update();
    draw();
    
    if (!gameover){
        window.requestAnimationFrame(loop,canvas);
    }else{
        end();
    }
}

function update() {
    frames++;
    
    if (frames%5 == 0){
        if (keystate === KEY_LEFT && snake.direction != RIGHT)
            snake.direction = LEFT;
        if (keystate === KEY_UP && snake.direction != DOWN)
            snake.direction = UP;
        if (keystate === KEY_DOWN && snake.direction != UP)
            snake.direction = DOWN;
        if (keystate === KEY_RIGHT && snake.direction != LEFT)
            snake.direction = RIGHT;
        
        var nx = snake.last.x;
        var ny = snake.last.y;
        
        switch (snake.direction){
            case LEFT:
                nx--;
                break;
            case UP:
                ny--;
                break;
            case RIGHT:
                nx++;
                break;
            case DOWN:
                ny++;
                break;
        }
                                                
        if ( nx < 0 ){
            nx = grid.width - 1;
        }else if (nx >= grid.width) {
            nx = 0;
        }else if (ny < 0) {
            ny = grid.height - 1;
        }else if (ny >= grid.height) {
            ny = 0;
        }
                
        if (grid.get(nx, ny) == SNAKE) {
            gameover = true;
        }
        
        if (grid.get(nx,ny) == FRUIT) {
            score++;
            var tail = {x: nx, y: ny};
            setFood();
        }else{
            var tail = snake.remove();
            grid.set(EMPTY,tail.x,tail.y);
            
            tail.x = nx;
            tail.y = ny;
        }
        
        grid.set(SNAKE,tail.x,tail.y);
        
        snake.insert(tail.x, tail.y);
    }
}

function draw() {
    var tw = canvas.width/grid.width;
    var th = canvas.height/grid.height;
    
    for (var x=0; x < grid.width; x++){
        for (var y=0; y < grid.height; y++){
            switch (grid.get(x,y)) {
                case EMPTY:
                    ctx.fillStyle = "#000";
                    break;
                case SNAKE:
                    ctx.fillStyle = "#00f";
                    break;
                case FRUIT:
                    ctx.fillStyle = "#f00";
                    break;
            }
            ctx.fillRect(x*tw,y*th,tw,th);
        }
    }
    ctx.font = "20px Times";
    ctx.fillStyle = "#0f0";
    ctx.fillText("Score: " + score, 10, canvas.height - 10);
}

function end() {
    ctx.fillStyle = "#0f0";
    
    var endDiv = document.createElement("div");
    endDiv.id = "end";
    
    var text = document.createElement("h2");
    text.id = "endgametext";
    text.innerHTML = "Game Over<br/>Your score was: <br/>" + score;
    endDiv.appendChild(text);
    
    var btnRestart = document.createElement("div");
    btnRestart.id = "restart";
    endDiv.appendChild(btnRestart);
    
    var hRestart = document.createElement("h3");
    hRestart.innerHTML = "Retry";
    btnRestart.appendChild(hRestart);
    
    document.body.appendChild(endDiv);
    
    createHighScore(score);
    
    btnRestart.addEventListener("click", function () {restart(endDiv) ;});
}

function createHighScore (highscore) {
    var scores = [];
    
    for(var i=0; i<10; i++){
       if(window.localStorage.getItem("highscore"+(i+1)) === null){
           break;
       }else{
           scores.push(Number(window.localStorage.getItem("highscore"+(i+1))));
       }
    }
    if(highscore !== null){
        scores.push(highscore);
    }
    scores.sort(function (a, b) {return (b-a)});
    
    var everyThing = document.getElementById("highscore");
    if (everyThing != null) {
        everyThing.removeChild(everyThing.lastChild);
    }else {
        everyThing = document.createElement("div");
        everyThing.id = "highscore";
        
        var title = document.createElement("h2");
        title.innerHTML = "High Scores";
        everyThing.appendChild(title);
    }
        
    var list = document.createElement("ol");
    everyThing.appendChild(list);
    
    for(var i=0; i<10; i++){
        var li = document.createElement("li");
        li.innerHTML = scores[i];
        window.localStorage.setItem("highscore"+(i+1),scores[i]);
        
        list.appendChild(li);
    }
    
    document.body.appendChild(everyThing);
}

function restart (end) {
    end.parentNode.removeChild(end);
    
    init();
}

main();
