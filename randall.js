function draw () {
  var canvas = document.getElementById("scene"),
      ctx = canvas.getContext("2d"),
      center = [canvas.width/2, canvas.height/2];

  function degToRad(deg) {
    return Math.PI*deg/180;
  }

  function rotateLine(p1, p2, deg) {
    var x = p2[0]-p1[0],
        y = p2[1]-p1[1],
        r = Math.sqrt(x*x + y*y),
        newX = r*Math.cos(degToRad(deg)) + p1[0],
        newY = r*Math.sin(degToRad(deg)) + p1[1];

    return [newX, newY];
  }

  DEFAULT_ROTATIONS = {
    leftarm: 65,
    rightarm: 120,
    leftleg: 65,
    rightleg: 120
  }

  function stickfigure (rotations) {
    var TORSO_BOTTOM = center,
        TORSO_TOP = [center[0], center[1] - 50],
        LEFT_LEG = [TORSO_BOTTOM[0], TORSO_BOTTOM[1] + 50],
        RIGHT_LEG = [TORSO_BOTTOM[0], TORSO_BOTTOM[1] + 50],
        HEAD_RADIUS = 20,
        LEFT_ARM = [TORSO_TOP[0]+20, TORSO_TOP[1] + 40],
        RIGHT_ARM = [TORSO_TOP[0]-20, TORSO_TOP[1] + 40],
        p,
        rotations = extend(DEFAULT_ROTATIONS, rotations);

    ctx.beginPath();
    ctx.moveTo(TORSO_BOTTOM[0], TORSO_BOTTOM[1]);
    ctx.lineTo(TORSO_TOP[0], TORSO_TOP[1]);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(TORSO_BOTTOM[0], TORSO_BOTTOM[1]);
    p = rotateLine(TORSO_BOTTOM, LEFT_LEG, rotations.leftleg);
    ctx.lineTo(p[0], p[1]);

    ctx.moveTo(TORSO_BOTTOM[0], TORSO_BOTTOM[1]);
    p = rotateLine(TORSO_BOTTOM, RIGHT_LEG, rotations.rightleg);
    ctx.lineTo(p[0], p[1]);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(TORSO_TOP[0], TORSO_TOP[1] - HEAD_RADIUS, HEAD_RADIUS, 0, 2*Math.PI*HEAD_RADIUS, false);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(TORSO_TOP[0], TORSO_TOP[1]);
    p = rotateLine(TORSO_TOP, LEFT_ARM, rotations.leftarm);
    ctx.lineTo(p[0], p[1]);

    ctx.moveTo(TORSO_TOP[0], TORSO_TOP[1]);
    p = rotateLine(TORSO_TOP, RIGHT_ARM, rotations.rightarm);
    ctx.lineTo(p[0], p[1]);
    ctx.stroke();

  }

  // DSL BEGINS
  stickfigure({leftleg: -20, rightleg: 100, leftarm: 8, rightarm: 35});
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

