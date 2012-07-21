// Point

function Point (x, y, color) {
  this.x = x || 0;
  this.y = y || 0;
  this.color = color || "rgb(10,200,10)";
}

Point.prototype.toString = function () {
  return "(" + this.x + ", " + this.y + ")";
}

function drawPoint (p) {
  ctx.fillStyle = p.color;
  ctx.beginPath();
  ctx.arc(p.x, p.y, 4, 0, 2*Math.PI);
  ctx.fill();
}

function ensurePoint (p) {
  if (!(p instanceof Point)) {
    p = new Point(p[0], p[1]);
  }
  return p;
}

// Circle
function Circle (center, radius) {
  this.center = center;
  this.radius = radius;
}

// Vector

COMPASS_ROSE = {
  N   : 270,
  NNE : 292.5,
  NE  : 315,
  ENE : 337.5,
  E   : 0,
  ESE : 22.5,
  SE  : 45,
  SSE : 67.5,
  S   : 90,
  SSW : 112.5,
  SW  : 135,
  WSW : 157.5,
  W   : 180,
  WNW : 202.5,
  NW  : 225,
  NNW : 247.5
}

function Vector (length, direction) {
  if (typeof direction === "string") {
    direction = COMPASS_ROSE[direction.toUpperCase()];
  }

  this.direction = degToRad(direction);
  this.length = length;

  this.x = this.length * Math.cos(this.direction);
  this.y = this.length * Math.sin(this.direction);
}

Vector.prototype.degrees = function() {
  return radToDeg(this.direction);
}

// Limb

function Limb (length, direction, start) {
  this.vectors = [new Vector(length, direction)];
  this._start = ensurePoint(start);
}

Limb.prototype.addJoint = function(percent) {
  percent = 0.5 || percent;
  var current = this.vectors.pop(),
      v1 = new Vector(percent * current.length, current.degrees()),
      v2 = new Vector((1 - percent) * current.length, current.degrees());

  this.vectors.push(v1, v2);
}

Limb.prototype.start = function () {
  return new Point(this._start.x, this._start.y)
}

Limb.prototype.end = function() {
  var i,
      end = this.start();

  for (i = 0; i < this.vectors.length; i++) {
    end.x += this.vectors[i].x;
    end.y += this.vectors[i].y;
  }

  return end;
}

function drawLimb (limb) {
  var i,
      point = limb.start();

  ctx.beginPath();
  ctx.moveTo(point.x, point.y);

  for (i = 0; i < limb.vectors.length; i++) {
    point.x += limb.vectors[i].x;
    point.y += limb.vectors[i].y;

    ctx.lineTo(point.x, point.y);
  }

  ctx.stroke();
  drawPoint(point);
  drawPoint(limb.start());
}

// Head

function Head (size, neck) {
  this.neck = ensurePoint(neck);
  var radius = size / 2,
      center = new Point(this.neck.x, this.neck.y - radius);
  this.circle = new Circle(center, radius);
  console.log(this);
}

function drawHead (head) {
  ctx.beginPath();
  ctx.arc(head.circle.center.x, head.circle.center.y, head.circle.radius,
      0, 2*Math.PI*head.circle.radius, false);
  ctx.stroke();
}



function draw () {
  // Refactor to be less gross
  var canvas = document.getElementById("scene");
  ctx = canvas.getContext("2d");

  torso = new Limb(50, "s", [200, 200]);
  leftLeg = new Limb(50, "ssw", torso.end());
  rightLeg = new Limb(50, "sse", torso.end());
  leftArm = new Limb(30, "sw", torso.start());
  rightArm = new Limb(30, "se", torso.start());
  head = new Head(30, torso.start());

  leftLeg.addJoint(0.5);

  drawLimb(torso);
  drawLimb(leftLeg);
  drawLimb(rightLeg);
  drawLimb(leftArm);
  drawLimb(rightArm);
  drawHead(head);

}



// Utility functions
// TODO: use real library?
// awful
function extend (obj1, obj2) {
  var o = {};
  for (var k in obj1) {
    if (obj1.hasOwnProperty(k)) {
      o[k] = obj1[k];
    }
  }
  for (k in obj2) {
    if (obj2.hasOwnProperty(k)) {
      o[k] = obj2[k];
    }
  }

  return o;
}

function degToRad(deg) {
  return Math.PI*deg/180;
}

function radToDeg(rad) {
  return 180/Math.PI*rad;
}

// TODO: Rewrite to use vectors
/*function getJointPoint (p1, p2, dist) {
  var mid = pointAlongLine(p1, p2, 0.5),
  m = slope(p1, p2),
  np = new Point(mid.x, mid.y),
  err,
  lastErr = Infinity,
  step;

// special behaviour to circumvent div0 error
if (m === 0) {
stepX = 0;
stepY = 0.1;
} else {
stepX = 0.01;
stepY = - 0.01 / m;
}

do {
err = Math.abs((distance(np, p1) - dist) + (distance(np, p2) - dist));
if (err > lastErr) { // reverse direction if error is increasing
stepY *= -1;
stepX *= -1;
}
np.x -= stepX;
np.y -= stepY;
} while (err > 1)

return np;
}

function slope (p1, p2) {
return (p2.y - p1.y) / (p2.x - p1.x);
}

function distance (p1, p2) {
var dy = p2.y - p1.y,
dx = p2.x - p1.x;
return Math.sqrt(dy*dy + dx*dx);
}

function pointAlongLine (p1, p2, percent) {
var dx = p2.x - p1.x,
dy = p2.y - p1.y,
x = p1.x + dx * percent,
y = p1.y + dy * percent;

return new Point(x, y);
}

function rotatePoint(pivot, p, deg) {
var x = p[0]-pivot[0],
y = p[1]-pivot[1],
r = Math.sqrt(x*x + y*y),
newX = r*Math.cos(degToRad(deg)) + pivot[0],
newY = r*Math.sin(degToRad(deg)) + pivot[1];

return [newX, newY];
}

*/


