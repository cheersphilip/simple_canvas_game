// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 300//document.width-50;
canvas.height = 300//document.height-50;
document.body.appendChild(canvas);

//timer 
var timeLeft = 30;
var countUp = 0;


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
monsterImage.src = "images/monster.png";

// Game objects
var hero = {
	range: 100,
	speed: 20 // movement in pixels per second
};



function monster(spin) {
	this.spin=spin;
}


var monstersArray = [];

//generate monsters
for (var i = 0; i <= Math.floor(Math.random() + 3); i++) {
	var newMonster = new monster(100);
	monstersArray.push(newMonster);
};

var monstersCaught = 3;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

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
		console.log(countUp);
	if (countUp >= 1) {
		countUp = 0;
		timeLeft-=1;
		if (timeLeft < 0){
			alert("Time up! You had " + monstersCaught + " lives left.");
			monstersCaught = 3;
			timeLeft = 30;
			reset();
		}
	};

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

	// Are they touching?
	// if (
	// 	hero.x <= (monster.x + 32)
	// 	&& monster.x <= (hero.x + 32)
	// 	&& hero.y <= (monster.y + 32)
	// 	&& monster.y <= (hero.y + 32)
	// ) {
	// 	++monstersCaught;
	// 	reset();
	// }

	//are any monsters within range?

	for (i = 0; i < monstersArray.length; i++) {
		if (
			hero.x <= (monstersArray[i].x + hero.range)
			&& monstersArray[i].x <= (hero.x + hero.range)
			&& hero.y <= (monstersArray[i].y + hero.range)
			&& monstersArray[i].y <= (hero.y + hero.range)
		) {
			monstersArray[i].spin+=0.2;
		}

		monstersArray[i].spin-=0.1;
		if (monstersArray[i].spin <=0){
			monstersArray[i].spin=100;
			--monstersCaught;
			if (monstersCaught <=0){
				monstersCaught = 3;
				timeLeft = 30;
				alert("You lost! Click to play again :)")
			}
			reset();
		}
		if (monstersArray[i].spin >= 100){
			monstersArray[i].spin = 100;
			// ++monstersCaught;
			// reset();
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

		// Throw the monsters somewhere on the screen randomly
		for (i = 0; i < monstersArray.length; i++) {
			ctx.drawImage(monsterImage, monstersArray[i].x, monstersArray[i].y);
			ctx.fillStyle = "rgba(255,102,51,0.5)";
			ctx.fillRect(
				monstersArray[i].x - monstersArray[i].spin/2, 
				monstersArray[i].y - monstersArray[i].spin/2, 
				monstersArray[i].spin, 
				monstersArray[i].spin);
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
	update(delta / 1000); //delta gives an integer of roughly 8 - 24
	render();
	then = now;
};


// the timer function 

// Change this function to be included in the update function, such that a var
// iterates by delta on each interval. When the var reaches 1000 then timeLeft-=1, 
// and the var resets to 0.
// This is more robust when it comes to changing scenes etc.

// var timeLapse = function (){
// 	timeLeft-=1;
// 	if (timeLeft < 0){
// 		alert("Time up! You had " + monstersCaught + " lives left.");
// 		monstersCaught = 3;
// 		timeLeft = 30;
// 		reset();
// 	}
// };

// Let's play this game!
reset();
var then = Date.now();
setInterval(main, 1); // Execute as fast as possible
//setInterval(timeLapse, 1000);

