	//Lógica do jogo
//Número de colunas e filas da grelha
var COLUMNS=25,
	ROWS=25;
//Valores da grelha
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
//Pontuação
var score,
//O jogo acabou?(true/false)
	gameOver;
//Canvas
var canvas, ctx, frames;
//Tempo que a cobra demora a percorrer uma célula
var TIME=100;
//Função que devolve valores aleatórios entre a(inclusive) e b(exclusive)
function rnd(a,b) {
	return Math.floor(Math.random()*(b-a)+a);
};
//Objetos
//Grelha
var grid = {
	//Variáveis
		//Número de células na horizontal
		width: undefined,
		//Número de células na vertical
		height: undefined,
		//Array 2D que irá guardar os valores de cada célula
		grid: undefined,
	
	//Métodos da grelha
		/*Inicializa a grelha.
		 	*Parâmetros:
		 		*value: valor para todas as células;
				*rows: número de células na horizontal;
				*columns: número de células na vertical.*/
		init: function(value, rows, columns) {
			//Inicializa as variáveis que guardam as dimensões da grelha
			this.width = columns;
			this.height = rows;
			//Inicializa a grelha com um array vazio
			this.grid = [];
			//Cria a grelha com as dimensões e valor pretendidos
			for (var x=0; x < columns; x++){
				//insere uma coluna
				this.grid.push([]);
				//para cada coluna insere as células com o valor
				for (var y=0; y < rows; y++){
					this.grid[x].push(value);
				}
			}
		},
		/*Insere um valor numa célula.
			*value: valor a inserir;
			*x: posição horizontal;
			*y: posição vertical.*/
		set: function (value, x, y){
			this.grid[x][y] = value;
		},
		/*Devolve o valor da célula.
			*x: posição horizontal;
			*y: posição vertical.*/
		get: function (x,y) {
			return this.grid[x][y];
		},
		//Coloca o fruto na grelha numa posição vazia aleatória
		setFood: function () {
			//Array que guarda as posições das células vazias da grelha
			var empty = [];
			//Procura as células vazias da grelha e adiciona-las ao array empty
			for (var x=0; x < this.width; x++){
				for (var y=0; y < this.height; y++){
					if (this.get(x,y) === EMPTY){
						empty.push({x:x,y:y});
					}
				}
			}
			//Escolhe-se uma célula aleatória
			var rndCell = empty[rnd(0,empty.length)];
			//Coloca-se o fruto nessa posição
			this.set(FRUIT, rndCell.x, rndCell.y);
		}
};
//Cobra
var snake = {
	//Variáveis
		//Direção do movimento
		direction: undefined,
		/*Array das posições de cada segmento da cobra.
		A posição de cada segmento será um objeto com as variáveis x, y */
		queue: undefined,
		//Cabeça da cobra
		head: undefined,
		//Último segmento da cobra
		tail: undefined,
	//Métodos
		/*Inicializa a cobra.
			*Parâmetros:
				*dir: direção inicial;
				*x: posição horizontal inicial;
				*y: posição vertical inicial.*/
		init: function(dir, x, y) {
			this.direction = dir;
			this.queue = [];
			this.insert(x,y);
		},
		/*Insere um novo segmento à cobra no início da queue e coloca a head igual a esse segmento
			*Parâmetros:
				*x: posição horizontal;
				*y: posição vertical.*/
		insert: function (x,y) {
			this.queue.unshift({x:x,y:y});
			this.head = this.queue[0];
			grid.set(SNAKE,x,y);
			this.tail = this.queue[this.queue.length-1];
		},
		//Remove o último segmento da cobra, a cauda(tail).
		remove: function () {	
			grid.set(EMPTY,this.tail.x,this.tail.y);
			this.queue.pop();
			this.tail = this.queue[this.queue.length-1];
		}
};
//Objeto que regista o estado das teclas que se consideram
var keyState = {
	//Guarda o valor da última tecla premida
	key: undefined,
	/*Método quando se clica noutra tecla
		*Parâmetros:
			*k: valor da tecla clicada.*/
	update: function (k) {
		if (k === KEY_UP    ||
			k === KEY_RIGHT ||
			k === KEY_LEFT  ||
			k === KEY_DOWN) {
				this.key = k;
		}
	},
	//Verifica se uma tecla é a premida
	isKey: function (k) {
		return (k === this.key);
	}
};
//Função que inicializa os objetos para começar o jogo
function start() {
	score = 0;
	frames = 0;
	gameOver = false;
	grid.init(EMPTY, COLUMNS, ROWS);
	var initPos = {
		x: Math.floor(COLUMNS/2),
		y: ROWS-1
	};
	snake.init(UP, initPos.x, initPos.y);
	grid.setFood();
}
//Função que faz o update dos objetos a cada turno do jogo
function update() {
	//Muda a direção da cobra de acordo com a tecla premida.
	if 		(keyState.isKey(KEY_DOWN) &&
		snake.direction !== UP)
			snake.direction = DOWN;
	else if (keyState.isKey(KEY_LEFT) &&
		snake.direction !== RIGHT)
			snake.direction = LEFT;
	else if (keyState.isKey(KEY_RIGHT) &&
		snake.direction !== LEFT)
			snake.direction = RIGHT;
	else if (keyState.isKey(KEY_UP) &&
		snake.direction !== DOWN)
			snake.direction = UP;
	//Declara variáveis com as coordenadas da cabeça da cobra
	var hx = snake.head.x,
		hy = snake.head.y;
	//Modifica as variáveis das coordenadas da cabeça de acordo com a direção da cobra.
	switch (snake.direction) {
		case LEFT:
			hx--;
			break;
		case UP:
			hy--;
			break;
		case RIGHT:
			hx++;
			break;
		case DOWN:
			hy++;
			break;
		default:
			throw Error("Direção da cobra desconhecida.");
	}
	//Verifica se a cobra saíu da grelha
	if (hx < 0) {
		hx = grid.width - 1;
	}else if (hx >= grid.width) {
		hx = 0;
	}else if (hy < 0) {
		hy = grid.height - 1;
	}else if (hy >= grid.height) {
		hy = 0;
	}
	//Verifica se a cobra chocou consigo própria, terminando o jogo caso afirmativo.
	if (grid.get(hx,hy) === SNAKE) {
		gameOver = true;
	}else {
		//Verifica se a cobra comeu o fruto
		if (grid.get(hx,hy) === FRUIT) {
			score++;
			grid.setFood();
		}else {
			//Remove a cauda da cobra
			snake.remove();
		}
		//Coloca a nova cabeça na cobra, criando a ilusão de movimento
		snake.insert(hx,hy);
	}
}

	//Funções de desenho do jogo no canvas
//Função que desenha no canvas o jogo
function drawCanvas(emptyColor,snakeColor,fruitColor,scoreColor,scoreXPos,scoreYPos) {
		//Largura da célula no canvas
	var cellWidth = canvas.width/grid.width,
		//Altura da célula no canvas
		cellHeight = canvas.height/grid.height;
	//Para cada célula desenha um retângulo com uma cor diferente dependente do seu valor
	for (var x=0; x<grid.width; x++) {
		for (var y=0; y<grid.height; y++) {
			switch (grid.get(x,y)) {
				case EMPTY:
					ctx.fillStyle = emptyColor;
					break;
				case SNAKE:
					ctx.fillStyle = snakeColor;
					break;
				case FRUIT:
					ctx.fillStyle = fruitColor;
					break;
			}
			ctx.fillRect(x*cellWidth, y*cellHeight,cellWidth,cellHeight);
		}
	}
	//Desenha a pontuação no canto inferior esquerdo do canvas
	ctx.fillStyle = scoreColor;
	ctx.fillText("Score: " + score, scoreXPos, scoreYPos);
}
//Função que termina o jogo, mostrando a pontuação obtida
function end() {
	//Parágrafo que mostra a pontuação
	var endp = document.createElement("p");
	endp.id = "gameOver";
	endp.innerHTML = "Game Over<br/>Your score is:<br/>" + score;
	document.body.appendChild(endp);
}
	//Funções que iniciam o jogo
function loop() {
	frames++;
	if (frames%5 === 0) {
		update();
		drawCanvas("#000","#00f","#f00","#0f0",canvas.width*1/100,canvas.height*(1-1/100));
	}
	
	while (!gameOver){	
		window.requestAnimationFrame(loop);
	}
	end(score);
}
function main () {
	canvas = document.createElement("canvas");
	canvas.id = "snakeCanvas";
	ctx = canvas.getContext("2d");
	ctx.font = "20px Times";
	document.body.appendChild(canvas);
	
	document.addEventListener("keydown",keyState.update);
	
	start();
	loop();
}

main();