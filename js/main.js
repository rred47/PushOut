var canvasPosition = new b2Vec2(CANVAS.width / SCALE / 2, CANVAS.height / SCALE / 2);

var physics,
    lastFrame = new Date().getTime(),
    player1 = window.player1 = null,
    player2 = window.player2 = null,
    canvas = window.canvas = null;


function khandle(e) {
  e = e || event;
  if (document.forms.keyform[e.type + 'Ignore'].checked) return;
   
  var evt = e.type;
  while (evt.length < 10) evt += ' '
  console.log(evt + 
    ' keyCode=' + e.keyCode + 
    ' which=' + e.which + 
    ' charCode=' + e.charCode +
    ' fromCharCode=' + String.fromCharCode(e.keyCode || e.charCode) +
    (e.shiftKey ? ' +shift' : '') +
    (e.ctrlKey ? ' +ctrl' : '') +
    (e.altKey ? ' +alt' : '') +
    (e.metaKey ? ' +meta' : '') +
    (e.repeat ? ' +repeat' : ''), 'key'
  )
  
  if (document.forms.keyform[e.type + 'Stop'].checked) {
    e.preventDefault ? e.preventDefault() : (e.returnValue = false);
  }
}



ent_press=0;

document.onkeydown = function(event){
  events = event || window.event;
  ent_press = events.keyCode == 13;
  }
document.onkeyup = function(){
  ent_press = 0;
  }

function process(){
  if (!ent_press) return;
  console.log("sds");
  }
setInterval(process,100)

function didSimulationPhysics() {
 // khandle(event);
 //console.log(event.keyCode);

}



window.gameLoop = function () {
  var currentTime = new Date().getTime();
  requestAnimationFrame(gameLoop);
  var dt = (currentTime - lastFrame) / 1000;
  if (dt > 1 / 15) { dt = 1 / 15; }
  physics.step(dt);

  didSimulationPhysics();

  lastFrame = currentTime;
}




function init() {
  var red = new Image();
	var green = new Image();
	var canvasImage = new Image();
	red.src = "img/red.png";
	green.src = "img/green.png";
  canvasImage.src = "img/canvas.png";

 physics = new Physics(CANVAS);

  new Body(physics, { type: "static", x: 0, y: 0, height: 38.4, width: 1 });
  new Body(physics, { type: "static", x: 19.2, y: 0, height: 38.4, width: 1 });
  new Body(physics, { type: "static", x: 0, y: 0, height: 1, width: 38.4 });
  new Body(physics, { type: "static", x: 0, y: 19.2, height: 1, width: 38.4 });

 

    
  player1 = new Player(physics, { image: red, x: canvasPosition.x + PLAYER_DISTANCE, y: canvasPosition.y - PLAYER_DISTANCE , angularVelocity: Math.PI, fixedRotation: true , shape: "circle", height: 2, width: 2 });
  player2 = new Player(physics, { image: green, x: canvasPosition.x - PLAYER_DISTANCE, y: canvasPosition.y + PLAYER_DISTANCE , angularVelocity: Math.PI, fixedRotation: true , shape: "circle", height: 2, width: 2});
  canvas = new Canvas(physics, {image: canvasImage, type: "kinematic", x: canvasPosition.x, y: canvasPosition.y, height: 12.5, width: 12.5 });

  physics.debug();
  requestAnimationFrame(gameLoop);

};

window.addEventListener("load", init);


