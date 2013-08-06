var b2Vec2 = Box2D.Common.Math.b2Vec2,
    b2BodyDef = Box2D.Dynamics.b2BodyDef,
    b2Body = Box2D.Dynamics.b2Body,    
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
    b2Fixture = Box2D.Dynamics.b2Fixture,
    b2FilterData = Box2D.Dynamics.b2FilterData,
    b2World = Box2D.Dynamics.b2World,
    b2MassData = Box2D.Collision.Shapes.b2MassData,
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
    b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

var GRAVITY = new b2Vec2(0, 0),
    SCALE = 40,
    TIME_STEP = 1 / 60,
    VELOCITY_ITERATIONS = 8,
    POSITION_ITERATIONS = 3,
    PLAYER_DISTANCE = 150 / SCALE,
    CANVAS = document.getElementById("canvas");

var canvasPosition = new b2Vec2(CANVAS.width / SCALE / 2, CANVAS.height / SCALE / 2);


var Physics = window.Physics = function (element, scale) {
  this.world = new b2World(GRAVITY, true);
  this.element = element;
  this.context = element.getContext("2d");
  this.scale = scale || SCALE;
  this.dtRemaining = 0;
  this.timeStep = TIME_STEP;
};

Physics.prototype.step = function (dt) {
  this.dtRemaining += dt;
  while (this.dtRemaining > this.timeStep) {
    this.dtRemaining -= this.timeStep;
    this.world.Step(this.timeStep, VELOCITY_ITERATIONS, POSITION_ITERATIONS);
  }
  if (this.debugDraw) {
    this.world.DrawDebugData();
  } else {
    this.context.clearRect(0, 0, this.element.width, this.element.height);

    var obj = this.world.GetBodyList();

    this.context.save();
    this.context.scale(this.scale, this.scale);
    while (obj) {
      var body = obj.GetUserData();
      if (body) {
        body.draw(this.context);
      }
      obj = obj.GetNext();
    }
    this.context.restore();
  }
}

Physics.prototype.debug = function () {
  this.debugDraw = new b2DebugDraw();
  this.debugDraw.SetSprite(this.context);
  this.debugDraw.SetDrawScale(this.scale);
  this.debugDraw.SetFillAlpha(0.3);
  this.debugDraw.SetLineThickness(1.0);
  this.debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
  this.world.SetDebugDraw(this.debugDraw);
};

var physics,
    lastFrame = new Date().getTime(),
    player1 = window.player1 = null,
    player2 = window.player2 = null,
    canvas = window.canvas = null;

window.gameLoop = function () {
  var currentTime = new Date().getTime();
  requestAnimationFrame(gameLoop);
  var dt = (currentTime - lastFrame) / 1000;
  if (dt > 1 / 15) { dt = 1 / 15; }
  physics.step(dt);
  lastFrame = currentTime;
}

var Body = window.Body = function (physics, details) {
  this.details = details = details || {};
  this.definition = new b2BodyDef();

  for (var k in this.definitionDefaults) {
    this.definition[k] = details[k] || this.definitionDefaults[k];
  }
  this.definition.position = new b2Vec2(details.x || 0, details.y || 0);
  this.definition.linearVelocity = new b2Vec2(details.vx || 0, details.vy || 0);
  this.definition.userData = this;

  switch (details.type) {
    case "static":
      this.definition.type = b2Body.b2_staticBody;
      break;
    case "dynamic":
      this.definition.type = b2Body.b2_dynamicBody;
      break;
    case "kinematic":   
    this.definition.type = b2Body.b2_kinematicBody;  
    default:
      this.definition.type = b2Body.b2_dynamicBody;
      break;
  }
 


  //this.definition.type = details.type == "static" ? b2Body.b2_staticBody : b2Body.b2_dynamicBody;

  this.body = physics.world.CreateBody(this.definition);

  this.fixtureDef = new b2FixtureDef();
  for (var l in this.fixtureDefaults) {
    this.fixtureDef[l] = details[l] || this.fixtureDefaults[l];
  }

  this.fixtureDef.filter = details.filter || this.fixtureDef.filter;


  /*var filter = b2FilterData;
  filter.categoryBits = 0;
  filter.maskBits = 0;
  filter.groupIndex = 0;*/

  details.shape = details.shape || this.defaults.shape;

  switch (details.shape) {
    case "circle":
      details.radius = details.radius || this.defaults.radius;
      this.fixtureDef.shape = new b2CircleShape(details.radius);

      break;
    case "polygon":
      this.fixtureDef.shape = new b2PolygonShape();
      this.fixtureDef.shape.SetAsArray(details.points, details.points.length);
      break;
    case "block":
      details.width = details.width || this.defaults.width;
      details.height = details.height || this.defaults.height;

      this.fixtureDef.shape = new b2PolygonShape();
      this.fixtureDef.shape.SetAsBox(details.width / 2, details.height / 2);
      break;
  }



  this.body.CreateFixture(this.fixtureDef);
};

Body.prototype.defaults = {
  shape: "block",
  width: 2,
  height: 2,
  radius: 1
};

Body.prototype.fixtureDefaults = {
  density: 2,
  friction: 0.5,
  restitution: 0.2
};

Body.prototype.definitionDefaults = {
  active: true,
  allowSleep: true,
  angle: 0,
  angularVelocity: 0,
  awake: true,
  bullet: false,
  fixedRotation: false
};


Body.prototype.draw = function (context) {
    var pos = this.body.GetPosition(),
        angle = this.body.GetAngle(); 

    context.save(); 
    
    context.translate(pos.x, pos.y);
    context.rotate(angle);  

    if (this.details.color) {
        context.fillStyle = this.details.color;
 
        switch (this.details.shape) {
            case "circle":
                context.beginPath();
                context.arc(0, 0, this.details.radius, 0, Math.PI * 2);
                context.fill();
                break;
            case "polygon":
                var points = this.details.points;
                context.beginPath();
                context.moveTo(points[0].x, points[0].y);
                for (var i = 1; i < points.length; i++) {
                    context.lineTo(points[i].x, points[i].y);
                }
                context.fill();
                break;
            case "block":
                context.fillRect(-this.details.width / 2, -this.details.height / 2,
                this.details.width,
                this.details.height);
            default:
                break;
        }
    } 

    if (this.details.image) {
        context.drawImage(this.details.image, -this.details.width / 2, -this.details.height / 2,
        this.details.width,
        this.details.height); 
    } 
    context.restore(); 
};


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

  var filter = window.filter = new b2FilterData();
    filter.categoryBits = 0;
    filter.maskBits = 0;
    filter.groupIndex = 0;

    
  player1 = new Body(physics, { image: red, x: canvasPosition.x + PLAYER_DISTANCE, y: canvasPosition.y - PLAYER_DISTANCE , angularVelocity: Math.PI, fixedRotation: true , shape: "circle", height: 2, width: 2 });
  player2 = new Body(physics, { image: green, x: canvasPosition.x - PLAYER_DISTANCE, y: canvasPosition.y + PLAYER_DISTANCE , angularVelocity: Math.PI, fixedRotation: true , shape: "circle", height: 2, width: 2});
   canvas = new Body(physics, {image: canvasImage, type: "kinematic", filter: filter, x: canvasPosition.x, y: canvasPosition.y, height: 12.5, width: 12.5 });

  physics.debug();
  requestAnimationFrame(gameLoop);

};

window.addEventListener("load", init);


