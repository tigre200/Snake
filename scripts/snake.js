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
//Pontuação
var score,
//O jogo acabou?(true/false)
	gameOver;
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
		insert: function(x,y){
			this.queue.unshift({x:x,y:y});
			this.head = this.queue[0];
			grid.set(SNAKE,x,y);
		},
		//Remove o último segmento da cobra, a cauda(tail).
		remove: function () {
			var tail = this.queue.pop();
			grid.set(EMPTY,tail.x,tail.y);
		}
};
//Função que inicializa os objetos para começar o jogo
function init() {
	score = 0;
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
function update() {}