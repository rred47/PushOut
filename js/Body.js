var Body = window.Body = function (physics, details) {
	//this.physics = physics;
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

  this.body = physics.world.CreateBody(this.definition);

  this.fixtureDef = new b2FixtureDef();
  for (var l in this.fixtureDefaults) {
    this.fixtureDef[l] = details[l] || this.fixtureDefaults[l];
  }

 // this.fixtureDef.filter = details.filter || this.fixtureDef.filter;

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

//  this.body.CreateFixture(this.fixtureDef);
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