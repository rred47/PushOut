//var b2FilterData = Box2D.Dynamics.b2FilterData;
var canvasFilter = new b2FilterData();

canvasFilter.categoryBits = 0;
canvasFilter.maskBits = 0;
canvasFilter.groupIndex = 0;

var Player = window.Player = function (physics, details) {	
	this.physics = physics;
  this.details = details || {};	
	//this.details.filter = canvasFilter;
//	this.fixtureDef = {};
	//this.fixtureDef.filter = canvasFilter;
			
//	extend(Canvas, new Body(this.physics, this.details));

	this.prototype = new Body(this.physics, this.details);	
//	this.prototype.fixtureDef.filter = this.fixtureDef.filter;
	this.prototype.body.CreateFixture(this.prototype.fixtureDef);
	
};

//Canvas.prototype = new Body();//(canvas.physics, canvas.details);

//extend(Canvas, Body);

//Canvas.super.details = Canvas.details;
//Canvas.prototype = new Body();

    
    // this.fixtureDef.filter = canvasFilter || this.fixtureDef.filter;
 

 
