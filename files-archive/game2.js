// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = document.width-50;
canvas.height = document.height-50;
document.body.appendChild(canvas);

//timer 
var timeLeft = 30;


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
	speed: 50 // movement in pixels per second
};



function monster(ID,spin) {
	this.ID=ID;
	this.spin=spin;
}


var monster = {

	spin: 100 //the variable that degrades with time
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
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
};

// Update game objects
var update = function (modifier) {
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

	//is the monster within range?
	if (
		hero.x <= (monster.x + hero.range)
		&& monster.x <= (hero.x + hero.range)
		&& hero.y <= (monster.y + hero.range)
		&& monster.y <= (hero.y + hero.range)
	) {
		monster.spin+=0.2;
	}

	monster.spin-=0.1;
	if (monster.spin <=0){
		monster.spin=100;
		--monstersCaught;
		if (monstersCaught <=0){
			monstersCaught = 3;
			timeLeft = 30;
			alert("You lost! Click to play again :)")
		}
		reset();
	}
	if (monster.spin >100){
		monster.spin = 100;
		// ++monstersCaught;
		// reset();
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
		ctx.drawImage(monsterImage, monster.x, monster.y);
		ctx.fillStyle = "rgba(255,102,51,0.5)";
		ctx.fillRect(monster.x - monster.spin/2, monster.y - monster.spin/2, monster.spin, monster.spin);
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
	update(delta / 1000);
	render();
	then = now;
};


// the timer function
var timeLapse = function (){
	timeLeft-=1;
	if (timeLeft < 0){
		alert("Time up! You had " + monstersCaught + " lives left.");
		monstersCaught = 3;
		timeLeft = 30;
		reset();
	}
}

// Let's play this game!
reset();
var then = Date.now();
setInterval(main, 1); // Execute as fast as possible
setInterval(timeLapse, 1000);

