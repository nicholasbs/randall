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

// Limb
function Limb (length, direction, start) {
  if (!(start instanceof Point)) {
    start = new Point(start[0], start[1]);
  }
  this.vector = new Vector(length, direction);
  this.start = start;
  this.end = new Point(start.x + this.vector.x, start.y + this.vector.y);
}


function draw () {
  // Refactor to be less gross
  canvas = document.getElementById("scene");
  ctx = canvas.getContext("2d");

  torso = new Limb(50, "s", [200, 200]);
  leftLeg = new Limb(50, "ssw", torso.end);
  rightLeg = new Limb(50, "sse", torso.end);
  leftArm = new Limb(30, "sw", torso.start);
  rightArm = new Limb(30, "se", torso.start);

  drawLimb(torso);
  drawLimb(leftLeg);
  drawLimb(rightLeg);
  drawLimb(leftArm);
  drawLimb(rightArm);

  function drawLimb (limb) {
    ctx.beginPath();
    ctx.moveTo(limb.start.x, limb.start.y);
    ctx.lineTo(limb.end.x, limb.end.y);
    ctx.stroke();

    drawPoint(limb.start);
    drawPoint(limb.end);
  }

  /*Stickfigure.prototype.drawCircle = function(point, radius) {
    ctx.arc(point[0], point[1], radius, 0, 2*Math.PI*radius, false);
  }

  Stickfigure.prototype.drawHead = function() {
    ctx.beginPath();
    this.drawCircle(rotatePoint(this.TORSO_TOP, [this.TORSO_TOP[0], this.TORSO_TOP[1] - this.HEAD_RADIUS], this.options.head), this.HEAD_RADIUS);
    ctx.stroke();
  }*/
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


