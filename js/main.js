var canvasPosition = new b2Vec2(CANVAS.width / SCALE / 2, CANVAS.height / SCALE / 2);

var physics = {},
    physycsFunctions = [],
    startTime = new Date().getTime(),
    lastFrame = new Date().getTime(), 
    player1 = {},
    player2 = {},   
    canvas = null;

function update(currentTime) {
 // player1.prototype.body.SetPosition(canvasPosition);
  canvas.update(startTime, currentTime);
  player1.update(canvas);  
  player2.update(canvas);  
};

window.gameLoop = function () {
  var currentTime = new Date().getTime();
  requestAnimationFrame(gameLoop);
  var dt = (currentTime - lastFrame) / 1000;
  if (dt > 1 / 15) { dt = 1 / 15; }
  physics.step(dt);
  update(currentTime);
  lastFrame = currentTime;
};

function init() {
  var red = new Image();
	var green = new Image();
	var canvasImage = new Image();





	red.src = 'img/blue1.png';
	green.src = 'img/green1.png';
  canvasImage.src = 'img/canvas1.png';

 physics = new Physics(CANVAS);

  new Body(physics, { type: "static", x: 0, y: 0, height: 38.4, width: 1 });
  new Body(physics, { type: "static", x: 19.2, y: 0, height: 38.4, width: 1 });
  new Body(physics, { type: "static", x: 0, y: 0, height: 1, width: 38.4 });
  new Body(physics, { type: "static", x: 0, y: 19.2, height: 1, width: 38.4 });
    
  player1 = new Player(physics, { image: red, x: canvasPosition.x + PLAYER_DISTANCE, y: canvasPosition.y - PLAYER_DISTANCE , angularVelocity: Math.PI, fixedRotation: true , shape: "circle", height: 2, width: 2 });
  player2 = new Player(physics, { image: green, x: canvasPosition.x - PLAYER_DISTANCE, y: canvasPosition.y + PLAYER_DISTANCE , angularVelocity: Math.PI, fixedRotation: true , shape: "circle", height: 2, width: 2});
  canvas = new Canvas(physics, {image: canvasImage, type: "kinematic", x: canvasPosition.x, y: canvasPosition.y, height: 12.5, width: 12.5 });

 // physics.debug();

  requestAnimationFrame(gameLoop);
};

window.addEventListener("load", init);


