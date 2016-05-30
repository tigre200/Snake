//função que devolve valores aleatórios entre a(inclusive) e b(exclusive)
function rnd(a, b)
{
    return (Math.floor(Math.random() * (b - a) + a));
}
//Constantes
const COLS = 25,ROWS = 25;
//Valores das Células
const EMPTY=0,SNAKE=1,FRUIT=2,COLLISION=3;
//Direções
const LEFT=0,UP=1,RIGHT=2,DOWN=3;
//Códigos das teclas
const KEY_LEFT=37,KEY_UP=38,KEY_RIGHT=39,KEY_DOWN=40;

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
    
    this.setFruit = function()
    {
        var empty = [];
        for (var x=0; x < width; x++)
            for (var y=0; y < height; y++)
                if (this.get(x,y) == EMPTY)
                    empty.push({x:x,y:y});
        var randPos = empty[rnd(0,empty.length)];
        this.set(FRUIT, randPos.x, randPos.y);
    }
}

function Snake(initialDirection, startX, startY, board)
{
	var direction = initialDirection, queue = [], gameOver = false;
	
	function insert(x,y)
	{
		queue.unshift({x:x,y:y});
		board.set(SNAKE,x,y);
	};
	
	function remove()
	{
		var last = queue.pop();
		board.set(EMPTY,last.x, last.y);
	};
	
	function getSegment(segment)
	{
		if( (segment != NaN) && (segment>=0) && (segment<queue.length) )
			return queue[segment];
		else
			switch(segment)
			{
				case "tail":
				case "last":
					return queue[queue.length-1];
					break;
				case "head":
				case "first":
					return queue[0];
					break;
				default:
					throw "Can't find segment";
			}
	};
	
	function updateDirection(keyPressed)
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
	
	this.move = function(objs)
	{
		var nx = getSegment("head").x,
			ny = getSegment("head").y;
		
		updateDirection(objs.key);
		
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
            nx = board.getWidth() - 1;
		else if (nx >= board.getWidth())
            nx = 0;
		else if (ny < 0)
            ny = board.getHeight() - 1;
		else if (ny >= board.getHeight())
            ny = 0;
		
		bigloop:
		switch(board.get(nx, ny))
		{
			case SNAKE:
				board.set(COLLISION,nx,ny);
            	return true;
				break;
			default:
				switch(board.get(nx,ny))
				{
					case FRUIT:
						objs.score++;
						board.setFruit();
						break;
					case EMPTY:
						remove();
						break;
					default:
						throw "Grid value isn't SNAKE, FRUIT, nor EMPTY!";
						break bigloop;
				}
        		insert(nx, ny);
				return false;
		}
	};
	
	insert(startX,startY);
}

function main()
{
	var gameObjects = {canvas: document.getElementById("snake"),
					   ctx: undefined};
	gameObjects.ctx = gameObjects.canvas.getContext("2d");
	
    highScore.displayHighScores();
    
    init(gameObjects);
}

function init(gameObjects)
{
	gameObjects.score = 0;
	
	gameObjects.frames = 0;
	gameObjects.gameOver = false;
	
	gameObjects.grid = new Grid(EMPTY, COLS, ROWS);
	
	gameObjects.key = KEY_UP;
	
	function setupEventListeners()
	{
    	document.addEventListener("keydown", function(evt) {
    	    if (evt.keyCode === KEY_UP    ||
    	        evt.keyCode === KEY_RIGHT ||
    	        evt.keyCode === KEY_LEFT  ||
    	        evt.keyCode === KEY_DOWN){
    	            gameObjects.key = evt.keyCode;
    	    }
    	});
	}
	setupEventListeners();
	
	var sp = {x: Math.floor(COLS/2), y: ROWS-1};
	gameObjects.snake = new Snake(UP, sp.x, sp.y, gameObjects.grid);
	gameObjects.grid.set(SNAKE,sp.x,sp.y);
	
	function loop()
	{
		if (gameObjects.frames%5 == 0)
		{
			update();
			draw();
		}
		if(gameObjects.gameOver)
			end(gameObjects);
		else
		{
			gameObjects.frames++;
			window.requestAnimationFrame(loop,gameObjects.canvas);
		}
	}
	
	function update()
	{
		gameObjects.gameOver = gameObjects.snake.move(gameObjects);
	}
	
	function draw()
	{
		var tw = gameObjects.canvas.width/gameObjects.grid.getWidth();
		var th = gameObjects.canvas.height/gameObjects.grid.getHeight();
		
		for (var x=0; x < gameObjects.grid.getWidth(); x++)
			for (var y=0; y < gameObjects.grid.getHeight(); y++){
				switch (gameObjects.grid.get(x,y))
				{
					case EMPTY:
						gameObjects.ctx.fillStyle = "#000";
						break;
					case SNAKE:
						gameObjects.ctx.fillStyle = "#00f";
						break;
					case FRUIT:
						gameObjects.ctx.fillStyle = "#f00";
						break;
					case COLLISION:
						gameObjects.ctx.fillStyle = "orange";
				}
				gameObjects.ctx.fillRect(x*tw,y*th,tw,th);
			}
		gameObjects.ctx.font = "20px Times";
		gameObjects.ctx.fillStyle = "#0f0";
		gameObjects.ctx.fillText("Score: " + gameObjects.score, 10, gameObjects.canvas.height - 10);
	}
	
	gameObjects.grid.setFruit();
	
	loop();
}

function end(gameObjects)
{
	var endDiv = document.createElement("div");
	endDiv.id = "end";
	
	var text = document.createElement("h2");
	text.id = "endgametext";
	text.innerHTML = "Game Over<br/>Your score was: <br/>" + gameObjects.score;
	endDiv.appendChild(text);
	
	var btnRestart = document.createElement("div");
	btnRestart.id = "restart";
	endDiv.appendChild(btnRestart);
	
	var hRestart = document.createElement("h3");
	hRestart.innerHTML = "Retry";
	btnRestart.appendChild(hRestart);

	highScore.saveHighScore(gameObjects.score);
	highScore.displayHighScores();
	document.body.insertBefore(endDiv,document.getElementById("highscore"));
	btnRestart.addEventListener("click", function () {restart(endDiv,gameObjects) ;});
	btnRestart.addEventListener("touchend",function(){restart(endDiv,gameObjects);});
}

var highScore = 
{
	getHighScores: function ()
		{
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
		},
	saveHighScore: function (highScore)
		{
			var highscores = this.getHighScores();
			highscores.push(highScore);
			highscores.sort(function(a,b){return b-a;});
			for(var i=0;i<10;i++){
				window.localStorage["score"+i] = highscores[i];
			}
		},
	displayHighScores: function ()
		{
			var highscores = this.getHighScores();
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
};

function createElement(parent, element, id, text)
{
	var node = document.createElement(element);
	if(!hasStrangeValues(id))
		node.id = id;
	if(!hasStrangeValues(text))
		node.innerHTML = text;
	parent.appendChild(node);
	return node;
}

function hasStrangeValues(variable)
{
	return (variable == null ||
			variable == undefined ||
			variable == NaN ||
			variable == "null" ||
			variable == "undefined" ||
			variable == "NaN" ||
			variable.length == 0);
}

function restart (end,gameObjects)
{
    end.parentNode.removeChild(end);
    
    init(gameObjects);
}

main();