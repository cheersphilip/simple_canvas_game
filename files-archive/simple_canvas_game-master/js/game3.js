// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 500//document.width-50;
canvas.height = 350//document.height-50;
document.getElementById("main").appendChild(canvas);

//timer 
var timeLeft = 30;
var countUp = 0;

//number of lives
var monstersCaught = 3;

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
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	//reset the monster arrays
	monstersArray = [];
	deadMonsters = [];

	//generate monsters
	for (var i = 0; i <= 2; i++) {
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


// Update game objects
var update = function (modifier) {

	// timing bit

	countUp += modifier;
		//console.log(countUp);

	if (countUp >= 1) {
		countUp = 0;
		timeLeft-=1;

		//has the time run out?

		if (timeLeft <= 0){
			alert("Time up! Well done, you had " + monstersCaught + " lives left.");
			monstersCaught = 3;
			timeLeft = 30;
			reset();
		}
	};


	//are any keys being pressed?

	if (38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier * 4;
		hero.x += hero.speed * modifier * 7;
	}
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier * 4;
		hero.x -= hero.speed * modifier * 7;
	}
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier * 7;
		hero.y -= hero.speed * modifier * 4;
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier * 7;
		hero.y += hero.speed * modifier * 4;
	}


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
		}
		

		//has a monster lost all its life?
		if (monstersArray[i].spin <= 0) {
			--monstersCaught;
			deadMonsters.push(monstersArray[i]);
			monstersArray.splice(i,1);
		}

		//have all the hero's lives gone?
		if (monstersCaught == 0) {
			monstersCaught = 3;
			timeLeft = 30;
			alert("You lost! Click to play again :)");
			reset();
		} 

		
	}

};

// Draw everything
var render = function () {

	if (bgReady) {
		//ctx.drawImage(bgImage, 0, 0 );
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {

		for (i = 0; i < monstersArray.length; i++) {
			
			//aminate the walking
			if (countUp <= 0.5) {
				monstersArray[i].sx = 30;
			} else {
				monstersArray[i].sx = 0;
			}

			//change colour if life is low
			if (monstersArray[i].spin <= 30) {
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
				ctx.drawImage(monsterImage, 120, 0, 30, 32, deadMonsters[i].x, deadMonsters[i].y, 30, 32);
			};
		}

	}

	// Score
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Lives: " + monstersCaught, 32, 10);
	ctx.fillText("timer: " + timeLeft, 32, 30);
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

