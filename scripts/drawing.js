	//Funções de desenho do jogo no canvas
//Função que desenha no canvas o jogo
function drawCanvas(canvas /*canvas onde se desenha o jogo*/,
			   ctx /*contexto do canvas para desenhar*/,
				snakeGrid,
				snakeScore,
			   emptyColor,
			   snakeColor,
			   fruitColor,
			   scoreColor,
			   scoreXPos,
			   scoreYPos) {
		//Largura da célula no canvas
	var cellWidth = canvas.width/snakeGrid.width,
		//Altura da célula no canvas
		cellHeight = canvas.height/snakeGrid.height;
	//Para cada célula desenha um retângulo com uma cor diferente dependente do seu valor
	for (var x=0; x<snakeGrid.width; x++) {
		for (var y=0; y<snakeGrid.height; y++) {
			switch (snakeGrid.get(x,y)) {
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
	ctx.fillText("Score: " + snakeScore, scoreXPos, scoreYPos);
}
//Função que termina o jogo, mostrando a pontuação obtida
function end(snakeScore) {
	//Parágrafo que mostra a pontuação
	var endp = document.createElement("p");
	endp.innerHTML = "Game Over<br/>Your score is:<br/>" + snakeScore;
	document.body.appendChild(endp);
}