var b2Vec2 = Box2D.Common.Math.b2Vec2,
    b2BodyDef = Box2D.Dynamics.b2BodyDef,
    b2Body = Box2D.Dynamics.b2Body,
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
    b2Fixture = Box2D.Dynamics.b2Fixture,
    b2World = Box2D.Dynamics.b2World,
    b2MassData = Box2D.Collision.Shapes.b2MassData,
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
    b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

var gravity = new b2Vec2(0, 9.8);

var Physics = window.Physics = function (element, scale) {
  this.world = new b2World(gravity, true);
  this.element = element;
  this.context = element.getContext("2d");
  this.scale = scale || 12;
  this.dtRemaining = 0;
  this.stepAmount = 1 / 60;
};

Physics.prototype.step = function (dt) {
  this.dtRemaining += dt;
  while (this.dtRemaining > this.stepAmount) {
    this.dtRemaining -= this.stepAmount;
    this.world.Step(this.stepAmount, 8, 3);
  }
  if (this.debugDraw) {
    this.world.DrawDebugData();
  }
}

Physics.prototype.debug = function() {
    this.debugDraw = new b2DebugDraw();
    this.debugDraw.SetSprite(this.context);
    this.debugDraw.SetDrawScale(this.scale);
    this.debugDraw.SetFillAlpha(0.3);
    this.debugDraw.SetLineThickness(1.0);
    this.debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    this.world.SetDebugDraw(this.debugDraw);
};

var physics,
    lastFrame = new Date().getTime();

window.gameLoop = function() {
	var tm = new Date().getTime();
	requestAnimationFrame(gameLoop);
	var dt = (tm - lastFrame) / 1000;
	if (dt > 1/15) { dt = 1/15;}
	physics.step(dt);
	lastFrame = tm;
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
	this.definition.type = details.type == "static" ? b2Body.b2_staticBody : b2Body.b2_dynamicBody;
	
	this.body = physics.world.CreateBody(this.definition);
	
	this.fixtureDef = new b2FixtureDef();
	for (var l in this.fixtureDefaults) {
		this.fixtureDef[l] = details[l] || this.fixtureDefaults[l];
	}
	
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
	width: 5,
	height: 5,
	radius: 2.5
};

Body.prototype.fixtureDefaults = {
	density: 2,
	friction: 1,
	restitution: 0.2
}

Body.prototype.definitionDefaults = {
	active: true,
	allowSleep: true,
	angle: 0,
	angularVelocity: 0,
	awake: true,
	bullet: false,
	fixedRotation: false
}


function init() {
	physics = new Physics(document.getElementById("canvas"));
	
	 new Body(physics, { type: "static", x: 0, y: 0, height: 128,  width: 1 });
    new Body(physics, { type: "static", x: 64, y: 0, height: 128,  width: 1});
    new Body(physics, { type: "static", x: 0, y: 0, height: 1, width: 128 });
    new Body(physics, { type: "static", x: 0, y: 64, height: 1, width: 128 });
 
    window.body = new Body(physics, { x: 5, y: 8,  angularVelocity: Math.PI, fixedRotation: true});
		for(var i = 0; i<10; i++) {
			new Body(physics, { x: i*5, y: 1 , shape: "circle"});
		}
    //new Body(physics, { x: 13, y: 8 });
   // new Body(physics, { x: 8, y: 3 });
	physics.debug();
	requestAnimationFrame(gameLoop);
}

window.addEventListener("load", init);