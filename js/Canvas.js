//var b2FilterData = Box2D.Dynamics.b2FilterData;
var canvasFilter = new b2FilterData();

canvasFilter.categoryBits = 0;
canvasFilter.maskBits = 0;
canvasFilter.groupIndex = 0;

var Canvas = window.Canvas = function (physics, details) {
  this.physics = physics;
  this.details = details || {};
  this.fixtureDef = {};
  this.fixtureDef.filter = canvasFilter;
  this.prototype = new Body(this.physics, this.details);
  this.prototype.fixtureDef.filter = this.fixtureDef.filter;
  this.prototype.body.CreateFixture(this.prototype.fixtureDef);
};

Canvas.prototype.update = function (startTime, currentTime) {
  var xSpeed = 0.0,
      ySpeed = 0.0,
      angularVelocity = 0.0,
      gameTime = currentTime - startTime,
      linearPeriod = parseInt(gameTime / 1000) % 4,
      angularPeriod = parseInt(gameTime / 1000) % 21; 

  switch (linearPeriod) {
    case 0:
      xSpeed = 7.5 / SCALE;
      ySpeed = -10 / SCALE;
      break;
    case 1:
      xSpeed = -7.5 / SCALE;
      ySpeed = -15 / SCALE;
      break;
    case 2:
      xSpeed = -15 / SCALE;
      ySpeed = 10 / SCALE;
      break;
    case 3:
      xSpeed = 15 / SCALE;
      ySpeed = 15 / SCALE;
      break;
    default:
      xSpeed = 0.0;
      ySpeed = 0.0;
      break;
  }

  ((angularPeriod >= 0 && angularPeriod < 5) || (angularPeriod >= 16 && angularPeriod < 21)) ? angularVelocity = Math.PI / 16 / 5 : angularVelocity = -Math.PI / 8 / 11;


  canvas.prototype.body.SetLinearVelocity(new b2Vec2(xSpeed, ySpeed));
  canvas.prototype.body.SetAngularVelocity(angularVelocity);
};
