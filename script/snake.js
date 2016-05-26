//função que devolve valores aleatórios entre a(inclusive) e b(exclusive)
function rnd(a, b) {
    return (Math.floor(Math.random() * (b - a) + a));
}
//Constantes
const COLS = 25,ROWS = 25;
//Valores das Células
const EMPTY=0,SNAKE=1,FRUIT=2;
//Direções
const LEFT=0,UP=1,RIGHT=2,DOWN=3;
//Códigos das teclas
const KEY_LEFT=37,KEY_UP=38,KEY_RIGHT=39,KEY_DOWN=40;

//Grelha
var grid, snake;
//Construtor da grelha
function Grid(initialValue, numCols, numRows)
{
	var board, width, height;
	function init(d, columns, rows)
	{
        width = columns;
        height = rows;
        board = [];
        for (var x=0; x < columns; x++){
            board.push([]);
            for (var y=0; y < rows; y++){
                board[x].push(d);
            };
        };
    };
	init(initialValue,numCols,numRows);
	
	this.set = function(value, x, y)
	{
		board[x][y] = value;
	}
	
	this.get = function(x,y)
	{
		return board[x][y];
	}
	
	this.getWidth = function()
	{
		return width;
	}
	
	this.getHeight = function()
	{
		return height;
	}
}

function Snake(initialDirection, startX, startY, grid)
{
	var direction = initialDirection, queue = [], gameOver = false;
	
	this.insert = function(x,y)
	{
		queue.unshift({x:x,y:y});
	};
	
	this.remove = function()
	{
		return queue.pop();
	};
	
	this.getNumberOfSegments = function()
	{
		return queue.length;
	};
	
	this.getSegment = function(segment)
	{
		if( (segment != NaN) && (segment>=0) && (segment<queue.length) )
			return queue[segment];
		else
			switch(segment)
			{
				case "tail":
				case "last":
					return queue[this.getNumberOfSegments()-1];
					break;
				case "head":
				case "first":
					return queue[0];
					break;
				default:
					throw "Can't find segment";
			}
	};
	
	this.getDirection = function()
	{
		return direction;
	};
	
	this.setDirection = function(d)
	{
		switch(d)
		{
			case LEFT:
			case UP:
			case RIGHT:
			case DOWN:
				direction = d;
				break;
			default:
				throw "Invalid direction";
		}
	};
	
	this.updateDirection = function(keyPressed)
	{
		if (keyPressed === KEY_LEFT && direction != RIGHT)
            direction = LEFT;
        else 
			if (keyPressed === KEY_UP && direction != DOWN)
            	direction = UP;
        	else 
				if (keyPressed === KEY_DOWN && direction != UP)
            		direction = DOWN;
        		else
					if (keyPressed === KEY_RIGHT && direction != LEFT)
            			direction = RIGHT;
	};
	
	this.move = function(scoreFunction)
	{
		var nx = this.getSegment("head").x,
			ny = this.getSegment("head").y;
		
		switch (direction)
		{
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
			default:
				throw "Don't know this direction";
        }
		
		if ( nx < 0 )
		{
            nx = grid.getWidth() - 1;
        }
		else if (nx >= grid.getWidth())
		{
            nx = 0;
        }
		else if (ny < 0)
		{
            ny = grid.getHeight() - 1;
        }
		else if (ny >= grid.getHeight())
		{
            ny = 0;
        }
		
		bigloop:
		switch(grid.get(nx, ny))
		{
			case SNAKE:
            	return true;
				break;
			default:
				switch(grid.get(nx,ny))
				{
					case FRUIT:
						scoreFunction(1);
						setFood();
						break;
					case EMPTY:
						var tail = snake.remove();
						grid.set(EMPTY,tail.x,tail.y);
						break;
					default:
						throw "Grid value isn't SNAKE, FRUIT, nor EMPTY!";
						break bigloop;
				}
				grid.set(SNAKE,nx,ny);
        		snake.insert(nx, ny);
				return false;
		}
	};
	
	this.insert(startX,startY);
}

function setFood() {
    var empty = [];
    for (var x=0; x < grid.getWidth(); x++){
        for (var y=0; y < grid.getHeight(); y++){
            if (grid.get(x,y) == EMPTY){
                empty.push({x:x,y:y});
            }
        }
    }
    var randPos = empty[rnd(0,empty.length)];
    grid.set(FRUIT, randPos.x, randPos.y);
}

//Game Objects
var canvas, ctx, keystate;

function main() {
    canvas = document.getElementById("snake");
    ctx = canvas.getContext("2d");
    
    displayHighScores();
    
    document.addEventListener("keydown", function(evt) {
        if (evt.keyCode === KEY_UP    ||
            evt.keyCode === KEY_RIGHT ||
            evt.keyCode === KEY_LEFT  ||
            evt.keyCode === KEY_DOWN){
                keystate = evt.keyCode;
        }
    });
    
	$("#snake").on("swipeup",function(){keystate=KEY_UP;});
	$("#snake").on("swipedown",function(){keystate=KEY_DOWN;});
	$("#snake").on("swipeleft",function(){keystate=KEY_LEFT;});
	$("#snake").on("swiperight",function(){keystate=KEY_RIGHT;});
	
    init();
}

function init() {
    
    var score = 0;
	function increaseScore(amount)
	{
		score += amount;
	}
	
    var frames = 0;
    var gameover = false;
	
    grid = new Grid(EMPTY, COLS, ROWS);
    
    keystate = KEY_UP;
    
    var sp = {x: Math.floor(COLS/2), y: ROWS-1};
    snake = new Snake(UP, sp.x, sp.y, grid);
    grid.set(SNAKE,sp.x,sp.y);
    
	function loop()
	{
    	if (frames%5 == 0){
			update();
    		draw();
			if(gameover)
			{
				end(score);
				return;
			}
		}
		frames++;
   		window.requestAnimationFrame(loop,canvas);
	}
	
	function update()
	{
		snake.updateDirection(keystate);
		gameover = snake.move(increaseScore);
	}
		
	function draw()
	{
		var tw = canvas.width/grid.getWidth();
		var th = canvas.height/grid.getHeight();
		
		for (var x=0; x < grid.getWidth(); x++){
			for (var y=0; y < grid.getHeight(); y++){
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
		
    setFood();
    
    loop(score,frames, gameover);
}

function end(score) {
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
    
    saveHighScore(score);
	displayHighScores();
    
    btnRestart.addEventListener("click", function () {restart(endDiv) ;});
	btnRestart.addEventListener("touchend",function(){restart(endDiv);});
}

function saveHighScore(highScore){
    var highscores = getHighScores();
    highscores.push(highScore);
    highscores.sort(function(a,b){return b-a;});
    for(var i=0;i<10;i++){
        window.localStorage["score"+i] = highscores[i];
    }
}
function getHighScores(){
    var scores = [];
    for(var i=0;i<10;i++){
        var item = window.localStorage.getItem("score"+i);
        if (!hasStrangeValues(item)) {
            scores.push(parseInt(item));
        }else{
            scores.push(-1);
			window.localStorage.setItem("score"+i,-1);
        }
    }
    return scores;
}
function displayHighScores(){
	var highscores = getHighScores();
	var div = document.getElementById("highscore");
	if (div == null)
	{
		div = createElement(document.body,"div","highscore");
		var title = createElement(div,"h2",null,"High Scores");
	}
	else
		if (div.lastChild.nodeName.toLowerCase() == "ol")
			div.removeChild(div.lastChild);
	
	var highscoresList = createElement(div,"ol");
	for (var i = 0; i < highscores.length; i++)
	{
		var s = highscores[i];
		if(s!=-1)
			createElement(highscoresList,"li",null,s.toString());
	}
}

function createElement(parent, element, id, text){
	var node = document.createElement(element);
	if(!hasStrangeValues(id))
		node.id = id;
	if(!hasStrangeValues(text))
		node.innerHTML = text;
	parent.appendChild(node);
	return node;
}

function hasStrangeValues(variable){
	return (variable == null ||
			variable == undefined ||
			variable == NaN ||
			variable == "null" ||
			variable == "undefined" ||
			variable == "NaN" ||
			variable.length == 0);
}

function restart (end) {
    end.parentNode.removeChild(end);
    
    init();
}

main();