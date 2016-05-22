var ctx;

var main = function(){
	canvas = $("#snake");
	
	$(document).keydown(function(event){
		if (event.which === KEY_UP    ||
            event.which === KEY_RIGHT ||
            event.which === KEY_LEFT  ||
            event.which === KEY_DOWN){
                keystate = event.which;
        }
	});
						
	displayHighScore();
						
	init();
};

var gameOverDisplay = function(score){
	addHighScore(score);
	displayHighScore();
	
	var $endDiv = $("<div></div>");
	$("canvas#snake").append($endDiv);
	
	var $text = "<h3>Game Over<br/>Your score was:<br/>" + score;
	$endDiv.append($text);
	
	var $divRestart = "<div></div>";
	$endDiv.append($divRestart);
	
	var $textRestart = "<h4>Retry</h4>";
	$divRestart.append($textRestart);
	
	$divRestart.click(function(){
		$endDiv.remove();
	
		init();
	});
}

var displayHighScore = function(){
	var $list = $("div#highscore ol");
	$list.empty();
	
	for(var i=0; i<10; i++){
		var item = localStorage.getItem("highscore"+(i+1));
		if(item !== undefined && item !== null && item !== NaN && item !== ""){
			$list.append("<li>"+item+"</li>");
		}
	}
}

var addHighScore = function(score){
	var highscores = [score];
	for(var i=0; i<10; i++){
		var item = window.localStorage.getItem("highscore"+(i+1));
		if(item !== undefined && item !== null && item !== NaN && item !== ""){
			highscores.push(Number(item));
		}else{
			break;
		}
	}
	highscores.sort(function (a, b) {return (b-a)});
	
	for(var i=0; i<10; i++){
		if(highScores[i] !== NaN && i < highscores.length){
			window.localStorage.setItem("highscore"+(i+1),String(highScores[i]));
		}else{
			window.localStorage.removeItem("highscore"+(i+1));
		}
	}
}

$(document).ready(main);