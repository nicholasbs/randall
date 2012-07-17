function Graph() {}

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
}




function draw () {
  var canvas = document.getElementById("scene"),
      ctx = canvas.getContext("2d");

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

    var bp = this.getBreakPoint(p1, p2, percent),
        newpoint = rotatePoint(bp, p2, deg);

    this.drawLine(p1, bp);
    this.drawLine(bp, newpoint);
  }

  // create wrapper, just p1 instead?
  Stickfigure.prototype.drawLine = function(p1, p2) {
    ctx.beginPath();
    ctx.moveTo(p1[0], p1[1]);
    ctx.lineTo(p2[0], p2[1]);
    ctx.stroke();
  }

  Stickfigure.prototype.drawCircle = function(point, radius) {
    ctx.arc(point[0], point[1], radius, 0, 2*Math.PI*radius, false);
  }

  Stickfigure.prototype.getBreakPoint = function(p1, p2, percent) {
    var dx = p2[0] - p1[0],
        dy = p2[1] - p1[1],
        x = p1[0] + dx * percent,
        y = p1[1] + dy * percent;

    return [x, y];
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

  var s1 = new Stickfigure();
  s1.draw();
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

