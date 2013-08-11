var Physics = window.Physics = function (element, scale) {
  this.world = new b2World(GRAVITY, true);
  this.element = element;
  this.context = element.getContext("2d");
  this.scale = scale || SCALE;
  this.dtRemaining = 0;
  this.timeStep = TIME_STEP;

  var img = new Image();
  img.src = 'img/red.png';

  this.context.drawImage(img, 0, 0, 300, 300);
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