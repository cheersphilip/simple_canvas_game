// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 500//document.width-50;
canvas.height = 350//document.height-50;
document.getElementById("main").appendChild(canvas);

//game scene
var scene = 0;
var level = 1;
var maxLevel = 0;


//timer 
var timeLeft = 15;
var countUp = 0;

//number of lives, etc.
var score = 0;
var maxScore = 0;
var lives = 3;

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monstersprite.png";

// Game objects
var hero = {
	range: 100,
	speed: 20 // movement in pixels per second
};

function monster(spin) {
	this.spin=spin;
	this.sx=0;
	this.sy=0;
	this.sw=30;
	this.sh=32;

	this.dw=30;
	this.dh=32;
}

var monstersArray = [];
var deadMonsters = [];


// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);



// Reset the game when the player loses all their lives or time runs out
var reset = function () {

	keysDown = {};

	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	timeLeft = 15;
	lives = 3;

	//reset the monster arrays
	monstersArray = [];
	deadMonsters = [];

	//generate monsters
	for (var i = 0; i < level + 2; i++) {
		var newMonster = new monster(100);
		monstersArray.push(newMonster);
	};


	// Throw the monsters somewhere on the screen randomly
	for (i = 0; i < monstersArray.length; i++) {
		monstersArray[i].x = 32 + (Math.random() * (canvas.width - 64));
		monstersArray[i].y = 32 + (Math.random() * (canvas.height - 64));
		monstersArray[i].spin = 100;
	}
};


var scoreBoard = function() {
	if (score > maxScore) {
		maxScore = score;
	};
	if (level > maxLevel) {
		maxLevel = level;
	};
}

// Update game objects
var update = function (modifier) {

	if (scene==0) {

		if (160 in keysDown || 32 in keysDown) { // Player holding space
			scene = 1;
			reset();
		};

	}

	else 

	{

		// timing bit

		countUp += modifier;

		if (countUp >= 1) {
			countUp = 0;
			timeLeft-=1;

			//has the time run out?

			if (timeLeft <= 0){
				var r = confirm("Job done!\nYou saved " + monstersArray.length + " cups with " + lives + " lives left\nReady for next level?")
				if (r==true) {
					score += monstersArray.length + lives;
					level++;
				} else {
					score += monstersArray.length + lives;
					scoreBoard();
					level = 1;
					scene = 0;
				}
				reset();
			}
		};


		//are any keys being pressed?

		if (38 in keysDown || 87 in keysDown || 119 in keysDown) { // Player holding up, W or w
			hero.y -= hero.speed * modifier * 4;
			hero.x += hero.speed * modifier * 7;
		}
		if (40 in keysDown || 83 in keysDown || 115 in keysDown) { // Player holding down, S or s
			hero.y += hero.speed * modifier * 4;
			hero.x -= hero.speed * modifier * 7;
		}
		if (37 in keysDown || 65 in keysDown || 97 in keysDown) { // Player holding left, A or a
			hero.x -= hero.speed * modifier * 7;
			hero.y -= hero.speed * modifier * 4;
		}
		if (39 in keysDown || 68 in keysDown || 100 in keysDown) { // Player holding right, D or d
			hero.x += hero.speed * modifier * 7;
			hero.y += hero.speed * modifier * 4;
		}

		if (88 in keysDown || 120 in keysDown || 27 in keysDown) { // Player holding X, x or Esc
			var q = confirm("You pressed 'escape'.\nDo you really want to quit?")
			if (q==true) {
				scene = 0;
				reset();
			} else {
				keysDown = {};
			}
		};

		// make sure the hero has not gone out of bounds

		if (hero.x > canvas.width - 30) {
			hero.x = canvas.width - 30;
		};
		if (hero.x < 0) {
			hero.x = 0;
		};
		if (hero.y > canvas.height - 32) {
			hero.y = canvas.height - 32;
		};
		if (hero.y < 0) {
			hero.y = 0;
		};


		//what are the monsters up to?

		for (i = 0; i < monstersArray.length; i++) {
			
			//are any monsters within range of the hero?
			
			if (
				hero.x <= (monstersArray[i].x + hero.range)
				&& monstersArray[i].x <= (hero.x + hero.range)
				&& hero.y <= (monstersArray[i].y + hero.range)
				&& monstersArray[i].y <= (hero.y + hero.range)
			) {
				//if they are, increase their life meter, up to 100
				monstersArray[i].spin+=0.2;
				if (monstersArray[i].spin >= 100){
					monstersArray[i].spin = 100;
				}

			} else {
				//if not, decrease it
				monstersArray[i].spin-=0.1;
			
				//has a monster lost all its life?
				if (monstersArray[i].spin <= 0) {
					--lives;
					deadMonsters.push(monstersArray[i]);
					monstersArray.splice(i,1);
					
					//have all the hero's lives gone?
					if (lives==0) {
						scoreBoard();
						level = 1;
						scene = 0;
						alert("You dead!\nBreak all my CUP");
						reset();
					} 

				}

			}
			
		}

	}; //end of 'else'

};




// Draw everything
var render = function () {

	if (bgReady) {
		//ctx.drawImage(bgImage, 0, 0 );
	}

	//start page

	if (scene==0) {

		//title
		ctx.fillStyle = "rgb(0, 0, 0)";
		ctx.font = "48px Helvetica";
		ctx.textAlign = "center";
		ctx.textBaseline = "top";
		ctx.fillText("Choka", 250, 20);
		ctx.fillText("Mocha", 250, 80);

		//subtitle
		ctx.fillStyle = "rgb(0, 0, 0)";
		ctx.font = "18px Helvetica";
		ctx.textAlign = "center";
		ctx.textBaseline = "top";
		ctx.fillText("Don't drop the cups!", 250, 140);


		//instructions
		ctx.fillStyle = "rgb(0, 0, 0)";
		ctx.font = "24px Helvetica";
		ctx.textAlign = "center";
		ctx.textBaseline = "top";
		ctx.fillText("Arrow keys or WASD to move", 250, 240);
		ctx.fillText("SPACE to start, Esc or X to pause", 250, 270);

		//credits
		ctx.fillStyle = "rgb(0, 0, 0)";
		ctx.font = "18px Helvetica";
		ctx.textAlign = "center";
		ctx.textBaseline = "top";
		ctx.fillText("A game by cheersphilip.", 250, 310);

		//high scores
		if (maxScore >= 1) {
			ctx.fillStyle = "rgb(0, 0, 0)";
			ctx.font = "18px Helvetica";
			ctx.textAlign = "right";
			ctx.textBaseline = "top";
			ctx.fillText("High Score: " + maxScore, 480, 170);
			ctx.fillText("Max level: " + maxLevel, 480, 195);

		};
	
	} 

	else //run the actual game

	{

		// Score
		ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
		ctx.font = "24px Helvetica";
		ctx.textBaseline = "top";
		ctx.textAlign = "left";
		ctx.fillText("level: " + level, 30, 10);
		ctx.fillText("score: " + score, 30, 30);
		ctx.textAlign = "right";
		//go red if only one life left
		if (lives==1) {
			ctx.fillStyle = "rgba(255, 0, 0, 0.8)";			
		};
		ctx.fillText("lives: " + lives, 480, 10);
		ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
		//go red if time nearly up
		if (timeLeft <= 5) {
			ctx.fillStyle = "rgba(255, 0, 0, 0.8)";
			if (countUp >= 0.5) {
				ctx.fillStyle = "rgba(255,240,240,0.8)";
			};
		};
		ctx.fillText("timer: " + timeLeft, 480, 30);


		if (monsterReady) {

			for (i = 0; i < monstersArray.length; i++) {
				
				//aminate the walking
				if (countUp <= 0.5) {
					monstersArray[i].sx = 30;
				} else {
					monstersArray[i].sx = 0;
				}

				//change colour if life is low
				if (monstersArray[i].spin <= 40) {
					monstersArray[i].sx += 60;
				}


				//draw the progress/life/spin bar thing above the monster
				ctx.drawImage(monsterImage, monstersArray[i].sx, monstersArray[i].sy, monstersArray[i].sw, monstersArray[i].sh, monstersArray[i].x, monstersArray[i].y, 30, 32);
				ctx.fillStyle = "rgba(255,102,51,0.5)";
				ctx.fillRect(monstersArray[i].x, monstersArray[i].y - 10, monstersArray[i].spin / 3, 5);
			}


			//draw any dead monsters

			if (deadMonsters.length > 0) {
				for (var j = 0; j < deadMonsters.length; j++) {
					ctx.drawImage(monsterImage, 120, 0, 30, 32, deadMonsters[j].x, deadMonsters[j].y, 30, 32);
				};
			}

		}

		if (heroReady) {
			ctx.drawImage(heroImage, hero.x, hero.y);
		}

	}; //end of 'else'

};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;
	canvas.width = canvas.width;
	update(delta / 1000); //delta gives an integer of roughly 8 - 24, depending on CPU speed
	render();
	then = now;
};



// Let's play this game!


reset();
var then = Date.now();
setInterval(main, 1); //execute as fast as possible

