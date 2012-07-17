function Point (x, y) {
  this.x = x || 0;
  this.y = y || 0;

  this.color = "rgb(10,200,10)";
}

Point.prototype.toString = function () {
  return "(" + this.x + ", " + this.y + ")";
}

function slope (p1, p2) {
  return (p2.y - p1.y) / (p2.x - p1.x);
}

function distance (p1, p2) {
  var dy = p2.y - p1.y,
      dx = p2.x - p1.x;
  return Math.sqrt(dy*dy + dx*dx);
}

function getJointPoint (p1, p2, dist) {
  var mid = pointAlongLine(p1, p2, 0.5),
      m = slope(p1, p2),
      np = new Point(mid.x, mid.y),
      err,
      lastErr = Infinity,
      step;

  if (m === 0) {
    stepX = 0;
    stepY = 0.1;
  } else {
    stepX = 0.01;
    stepY = - 0.01 / m;
  }

  do {
    err = Math.abs((distance(np, p1) - dist) + (distance(np, p2) - dist));
    if (err > lastErr) {
      // Reverse direction if error is increasing
      stepY *= -1;
      stepX *= -1;
    }
    np.x -= stepX; // how to choose direction? i.e., + or -
    np.y -= stepY;
  } while (err > 1)

  return np;
}

function pointAlongLine (p1, p2, percent) {
    var dx = p2.x - p1.x,
        dy = p2.y - p1.y,
        x = p1.x + dx * percent,
        y = p1.y + dy * percent;

    return new Point(x, y);
}
/*(function Graph() {}

// each node has a position (x, y) and a set of edges
// keep edge distance fixed
function moveNode(node, pos, graph) {
  oldpos = graph.node.pos();
  neighbors = all nodes directly connected to our node;
  graph.node.pos(pos);

  // moved point, now solve length constraint
  adjustGraphWithConstraint(new_graph);
}

// takes 3 points, incl the new point, also two lengths to preserve
function adjustGraph...(g, seg1, seg2) {

  //calc middle point position by preserving the two segs len

// pseudo point finder
// def: p1, bp, p2, p1 into np (new point)
// 
  
}
  // graph: 5 nodes

  for each neighbor n of node:
    for each neighbor f of n:
      // find new loc of n, given dist(np y) == dist(n y)

  node([x y], [& edges])
}*/

function drawPoint (p) {
  ctx.fillStyle = p.color;
  ctx.beginPath();
  ctx.arc(p.x, p.y, 4, 0, 2*Math.PI);
  ctx.fill();
}

function draw () {
  // Refactor to be less gross
  canvas = document.getElementById("scene");
  ctx = canvas.getContext("2d");

  var torsoBottom = new Point(200, 250),
      leftLeg = new Point(170, 340),
      rightLeg = new Point(230, 340),
      legLen = distance(torsoBottom, leftLeg),
      torsoTop = new Point(200, 175),
      leftArm = new Point(170, 185),
      rightArm = new Point(230, 185),
      armLen = distance(torsoTop, leftArm);

  torsoBottom.y += 50;
  torsoTop.y += 50;

  var leftKnee = getJointPoint(torsoBottom, leftLeg, legLen/2),
      rightKnee = getJointPoint(torsoBottom, rightLeg, legLen/2);

  torsoBottom.color = "rgb(10, 10, 200)";

  drawLine(torsoBottom, leftKnee);
  drawLine(leftKnee, leftLeg);

  drawLine(torsoBottom, rightKnee);
  drawLine(rightKnee, rightLeg);

  drawLine(torsoTop, torsoBottom);

  drawLine(torsoTop, leftArm);
  drawLine(torsoTop, rightArm);

  function degToRad(deg) {
    return Math.PI*deg/180;
  }

  function rotatePoint(pivot, p, deg) {
    var x = p[0]-pivot[0],
        y = p[1]-pivot[1],
        r = Math.sqrt(x*x + y*y),
        newX = r*Math.cos(degToRad(deg)) + pivot[0],
        newY = r*Math.sin(degToRad(deg)) + pivot[1];

    return [newX, newY];
  }

  // distance between all joint pairs is fixed
  // later xyz depth


  DEFAULT_OPTIONS = {
    position: [canvas.width/2, canvas.height/2], // defaults to center
    leftarm: 65,
    rightarm: 120,
    leftleg: 65,
    rightleg: 120,
    head: 270
  }

  function Stickfigure (options) {

    this.options = extend(DEFAULT_OPTIONS, options);

    this.TORSO_BOTTOM = this.options.position;
    this.TORSO_TOP = [this.options.position[0], this.options.position[1] - 50];
    this.LEFT_LEG = [this.TORSO_BOTTOM[0], this.TORSO_BOTTOM[1] + 50];
    this.RIGHT_LEG = [this.TORSO_BOTTOM[0], this.TORSO_BOTTOM[1] + 50];
    this.HEAD_RADIUS = 20;
    this.LEFT_ARM = [this.TORSO_TOP[0]+20, this.TORSO_TOP[1] + 40];
    this.RIGHT_ARM = [this.TORSO_TOP[0]-20, this.TORSO_TOP[1] + 40];
  }

  // p2 is end of leg assuming you don't bend your knee
  Stickfigure.prototype.drawBone = function(p1, p2, deg, percent) {
    deg = deg || 0;
    //this.getAngle(p1, p2);
    percent = percent || .5;

    var bp = pointAlongLine(p1, p2, percent),
        newpoint = rotatePoint(bp, p2, deg);

    this.drawLine(p1, bp);
    this.drawLine(bp, newpoint);
  }

  // create wrapper, just p1 instead?
  function drawLine(p1, p2) {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();

    drawPoint(p1);
    drawPoint(p2);
  }

  Stickfigure.prototype.drawCircle = function(point, radius) {
    ctx.arc(point[0], point[1], radius, 0, 2*Math.PI*radius, false);
  }

  Stickfigure.prototype.drawHead = function() {
    ctx.beginPath();
    this.drawCircle(rotatePoint(this.TORSO_TOP, [this.TORSO_TOP[0], this.TORSO_TOP[1] - this.HEAD_RADIUS], this.options.head), this.HEAD_RADIUS);
    ctx.stroke();
  }

  Stickfigure.prototype.drawTorso = function() {
    this.drawLine(this.TORSO_BOTTOM, this.TORSO_TOP);
  }

  // TORSO_BOTTOM, LEFT_LEG (leftleg) - map?
  Stickfigure.prototype.drawLeftLeg = function() {
    // good refactor?
    var footPoint = rotatePoint(this.TORSO_BOTTOM, this.LEFT_LEG, this.options.leftleg);
    this.drawBone(this.TORSO_BOTTOM, footPoint); // default angle is same as direction
  }

  Stickfigure.prototype.drawRightLeg = function() {
    this.drawLine(this.TORSO_BOTTOM, rotatePoint(this.TORSO_BOTTOM, this.RIGHT_LEG, this.options.rightleg));
  }

  Stickfigure.prototype.drawLeftArm = function() {
    this.drawLine(this.TORSO_TOP, rotatePoint(this.TORSO_TOP, this.LEFT_ARM, this.options.leftarm));
  }

  Stickfigure.prototype.drawRightArm = function() {
    this.drawLine(this.TORSO_TOP, rotatePoint(this.TORSO_TOP, this.RIGHT_ARM, this.options.rightarm));
  }

  Stickfigure.prototype.draw = function() {

    this.drawHead();
    this.drawTorso();
    this.drawLeftLeg();
    this.drawRightLeg();
    this.drawLeftArm();
    this.drawRightArm();
  }

  // DSL BEGINS
  //var s1 = new Stickfigure({leftleg: -18, rightleg: 100, leftarm: 8, rightarm: 35, head: 290});
  //var s2 = new Stickfigure({position: [100, 200]});

  //var s1 = new Stickfigure();
  //s1.draw();
}

// use real library
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

