//função que devolve valores aleatórios entre a(inclusive) e b(exclusive)
function rnd(a,b) {
	return Math.floor(Math.random()*(b-a)+a);
};
//Valores das Células
var EMPTY=0,
	SNAKE=1,
	FRUIT=2;
//Direções
var LEFT=0,
	UP=1,
	RIGHT=2,
	DOWN=3;
//Códigos das teclas
var KEY_LEFT=37,
	KEY_UP=38,
	KEY_RIGHT=39,
	KEY_DOWN=40;

function grid(emptyValue, snakeValue, fruitValue, width, height) {
	this.grid = [];
	for(var x=0; x<width; x++){
		this.grid.push([]);
		for(var y=0; y<height; y++){
			this.grid[x].push(emptyValue);
		}
	}
	
	this.set = function(value, x, y){
		this.grid[x][y] = value;
	};
	
	this.get = function(x,y){
		return this.grid[x][y];
	}
	
	this.setFood = function(){
		var emptyCells = [];
		for(var x=0; x<width; x++){
			for(var y=0; y<height; y++){
				if(this.get(x,y) === emptyValue){
					emptyCells.push({x:x,y:y});
				}
			}
		}
		var randPos = emptyCells[rnd(0,emptyCells.length)];
		grid.set(fruitValue,randPos.x, randPos.y);
	};
};

function snake(direction, x, y, snakeValue, emptyValue, grid){
	this.direction = direction;
	
	this.queue = [];
	
	this.insert = function(x,y){
		this.queue.unshift({x:x,y:y});
		this.last = this.queue[0];
		grid.set(snakeValue,x,y);
	};
	this.insert(x,y);
	
	this.remove = function(){
		var tail = this.queue.pop();
		grid.set(emptyValue,tail.x,tail.y);
		return tail;
	};
};