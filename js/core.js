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

const GRAVITY = new b2Vec2(0, 0),
      SCALE = 40,
      TIME_STEP = 1 / 60,
      VELOCITY_ITERATIONS = 8,
      POSITION_ITERATIONS = 3,
      PLAYER_DISTANCE = 150 / SCALE,
      CANVAS = document.getElementById("canvas");

function extend(Child, Parent) {
    var F = function() { }
    F.prototype = Parent.prototype
    Child.prototype = new F()
    Child.prototype.constructor = Child
    Child.superclass = Parent.prototype
}

var physics = window.physics = {};