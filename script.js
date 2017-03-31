// canvas settings
const width = 600;
const height = 600;

// point settings
const numPoints = 64000;
const pointWidth = 2;
const pointMargin = 2;

// animation settings
const duration = 8000;
const ease = d3.easeCubic;
let timer;
let currLayout = 0;

// create set of points
const points = createPoints(numPoints, pointWidth, width, height);

var flower_f = [
  76,
  68,58,66,84,94,86,
  78,60,50,40,48,56,74,92,102,112,104,96,
  70,52,42,32,22,30,38,46,64,82,100,110,120,130,122,114,106,88,
  80,62,44,34,24,14,4,12,20,28,36,54,72,90,108,118,128,138,148,140,132,124,116,98
];

var radius  = (height / 10) - 0.4 * pointWidth;

var gridXOffset = Math.sqrt(Math.pow(radius,2) - (Math.pow((radius /2),2)));
var gridYOffset = radius / 2.0;

var matrix = []
for (var k=1.0; k<18.0; k++) {
  for (var j=1.0; j<10.0; j++) {
     var x = j * (gridXOffset);
     var y = k * (gridYOffset);
     matrix.push([x,y])
  }
}

var flower_1 = flower_f.slice(0, 1);
var flower_2 = flower_f.slice(0, 7);
var flower_3 = flower_f.slice(0, 19);
var flower_4 = flower_f.slice(0, 37);

// wrap layout helpers so they only take points as an argument
const toFlower_f = (points) => flowerLayout(points, pointWidth + pointMargin, width, height, matrix, flower_f, radius);
const toFlower_1 = (points) => flowerLayout(points, pointWidth + pointMargin, width, height, matrix, flower_1, radius);
const toFlower_2 = (points) => flowerLayout(points, pointWidth + pointMargin, width, height, matrix, flower_2, radius);
const toFlower_3 = (points) => flowerLayout(points, pointWidth + pointMargin, width, height, matrix, flower_3, radius);
const toFlower_4 = (points) => flowerLayout(points, pointWidth + pointMargin, width, height, matrix, flower_4, radius);

var tree_radius  = (height / 30);
var tree_circles = [
  76,60,56,92,96,112,4,24,20,148
];
const toTree = (points) => treeLayout(points, pointWidth + pointMargin, width, height, matrix, tree_circles, tree_radius);

var meta_circles = [
  76,76,60,44,56,36,92,108,96,116,112,148,40,4
];
const toMeta = (points) => metaLayout(points, pointWidth + pointMargin, width, height, matrix, meta_circles, radius);

const toPhyllotaxis = (points) => phyllotaxisLayout(points, pointWidth + pointMargin, width / 2, height / 2);

// store the layouts in an array to sequence through
const layouts = [toTree, toPhyllotaxis, toFlower_f, toPhyllotaxis, toMeta];

// draw the points based on their current layout
function draw() {
  const ctx = canvas.node().getContext('2d');
  ctx.save();

  // erase what is on the canvas currently
  ctx.clearRect(0, 0, width, height);

  // draw each point as a rectangle
  for (let i = 0; i < points.length; ++i) {
    const point = points[i];
    //ctx.beginPath();
    //ctx.arc(point.x, point.y, pointWidth/2, 0, Math.PI*2, false);
    //ctx.fillStyle = point.color;
    //ctx.fill();
    ctx.fillStyle = point.color;
    ctx.fillRect(point.x, point.y, pointWidth, pointWidth);
  }

  ctx.restore();
}

// animate the points to a given layout
function animate(layout) {
  // store the source position
  points.forEach(point => {
    point.sx = point.x;
    point.sy = point.y;
  });

  // get destination x and y position on each point
  layout(points);

  // store the destination position
  points.forEach(point => {
    point.tx = point.x;
    point.ty = point.y;
  });

  timer = d3.timer((elapsed) => {
    // compute how far through the animation we are (0 to 1)
    const t = Math.min(1, ease(elapsed / duration));

    // update point positions (interpolate between source and target)
    points.forEach(point => {
      point.x = point.sx * (1 - t) + point.tx * t;
      point.y = point.sy * (1 - t) + point.ty * t;
    });

    // update what is drawn on screen
    //requestAnimationFrame( draw );
    draw();

    // if this animation is over
    if (t === 1) {
      // stop this timer for this layout and start a new one
      timer.stop();

      // update to use next layout
      currLayout = (currLayout + 1) % layouts.length;

      // start animation for next layout
      animate(layouts[currLayout]);
    }
  });
}

// create the canvas
const screenScale = window.devicePixelRatio || 1;
const canvas = d3.select('body').append('canvas')
  .attr('width', width * screenScale)
  .attr('height', height * screenScale)
  .style('width', `${width}px`)
  .style('height', `${height}px`)
  .on('click', function () {
    d3.select('.play-control').style('display', '');
    timer.stop();
  });
canvas.node().getContext('2d').scale(screenScale, screenScale);

// start off as phyllotaxis
toPhyllotaxis(points);
draw();

d3.select('body').append('div')
  .attr('class', 'play-control')
  .text('PLAY')
  .on('click', function () {
    // start the animation
    animate(layouts[currLayout]);

    // remove the play control
    d3.select(this).style('display', 'none');
  });

