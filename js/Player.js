var Player = window.Player = function (physics, details) {
  this.physics = physics;
  this.details = details || {};
  this.relativePosition = new b2Vec2(0, 0);
  this.prototype = new Body(this.physics, this.details);
  this.prototype.body.CreateFixture(this.prototype.fixtureDef); 
};

Player.prototype.update = function (parrent) {
  var linearVelocity = parrent.prototype.body.GetLinearVelocity();
  this.prototype.body.SetLinearVelocity(linearVelocity); 
};
