/**
 * Mutates the `points` passed in by updating the x and y values.
 *
 * @param {Object[]} points The array of points to update. Will get `x` and `y` set.
 * @param {Number} pointWidth The size in pixels of the point's width. Should also include margin.
 * @param {Number} xOffset The x offset to apply to all points
 * @param {Number} yOffset The y offset to apply to all points
 *
 * @return {Object[]} points with modified x and y
 */

/**
 * Given a set of points, lay them out in a phyllotaxis layout.
 * Mutates the `points` passed in by updating the x and y values.
 */
function phyllotaxisLayout(points, pointWidth, xOffset=0 , yOffset=0, iOffset=0) {
  // theta determines the spiral of the layout
  const theta = Math.PI * (3 - Math.sqrt(5));

  const pointRadius = pointWidth / 3.42;

  points.forEach((point, i) => {
    const index = (i + iOffset) % points.length;
    const phylloX = pointRadius * Math.sqrt(index) * Math.cos(index * theta);
    const phylloY = pointRadius * Math.sqrt(index) * Math.sin(index * theta);

    point.x = xOffset + phylloX - pointRadius;
    point.y = yOffset + phylloY - pointRadius;
  });

  return points;
}

/**
 * Given a set of points, lay them out randomly.
 * Mutates the `points` passed in by updating the x and y values.
 */
function randomLayout(points, pointWidth, width, height) {
  points.forEach((point, i) => {
    point.x = Math.random() * (width - pointWidth);
    point.y = Math.random() * (height - pointWidth);
  });

  return points;
}

/**
 * Generate an object array of `numPoints` length with unique IDs
 * and assigned colors
 */
function createPoints(numPoints, pointWidth, width, height) {
  const colorScale = d3.scaleSequential(d3.interpolateRainbow)
    .domain([numPoints - 1, 0]);

  const points = d3.range(numPoints).map(id => ({
    id,
    color: colorScale(id),
  }));

  return randomLayout(points, pointWidth, width, height);
}

/**
 * Given a set of points, lay them out in a flower of life.
 * Mutates the `points` passed in by updating the x and y values.
 */
function flowerLayout(points, pointWidth, width, height, matrix, symbol, radius) {

  const periods = 64;

  const thetaScale = d3.scaleLinear()
    .domain([0, points.length - 1])
    .range([0, periods * 2 * Math.PI]);

  var sCount = 0;
  var sSize = 1000;

  var xOffset = 42;
  var yOffset = 32;

  symbol.map( function(m) {
    for (var i = (sCount * sSize); i < ((sCount + 1) * sSize); i++) {
      points[i].x = radius * Math.cos(thetaScale(i)) + xOffset + matrix[m][0];
      points[i].y = radius * Math.sin(thetaScale(i)) + yOffset + matrix[m][1];
    }
    sCount++;
  });

  xOffset = width / 2;
  yOffset = height / 2;
  radius  = (height / 2) - 0.5 * pointWidth;

  for (var i =(sCount * sSize); i < ((sCount + 3) * sSize); i++) {
    points[i].x = radius * Math.cos(thetaScale(i)) + xOffset;
    points[i].y = radius * Math.sin(thetaScale(i)) + yOffset;
  }
  sCount = sCount + 3;

  return points;
}

/**
 * Given a set of points, lay them out in a tree of life.
 * Mutates the `points` passed in by updating the x and y values.
 */
function treeLayout(points, pointWidth, width, height, matrix, symbol, radius) {

  const periods = 64;

  const thetaScale = d3.scaleLinear()
    .domain([0, points.length - 1])
    .range([0, periods * 2 * Math.PI]);

  var sCount = 0;
  var sSize = 1000;

  var xOffset = 42;
  var yOffset = 32;

  symbol.map( function(m) {
    for (var i = (sCount * sSize); i < ((sCount + 2) * sSize); i++) {
      points[i].x = radius * Math.cos(thetaScale(i)) + xOffset + matrix[m][0];
      points[i].y = radius * Math.sin(thetaScale(i)) + yOffset + matrix[m][1];
    }
    sCount = sCount + 2;
  });

/** Treematrix small
4  40,
3  48,50,
1  66,68,
m  76,
1  84,86,
2  94,
4  112
*/

/** Treematrix big
4  4,
3  20,24,
1  56,60,
m  76,
1  92,96,
2  112,
4  148
*/

/** small
  var lines = [
    [40,48],[40,50],[48,50],
    [48,66],[50,68],[66,68],
    [40,76],[48,76],[50,76],
    [66,76],[68,76],[66,84],
    [68,86],[84,76],[86,76],
    [84,86],[76,94],[84,94],
    [86,94],[84,112],[86,112],
    [94,112]
  ];
*/

  var lines = [
    [4,20],[4,24],[20,24],
    [20,56],[24,60],[56,60],
    [4,76],[20,76],[24,76],
    [56,76],[60,76],[56,92],
    [60,96],[92,76],[96,76],
    [92,96],[76,112],[92,112],
    [96,112],[92,148],[96,148],
    [112,148]
  ];

  lines.map( function(m) {

    var width  = matrix[m[1]][0] - matrix[m[0]][0];
    var height = matrix[m[1]][1] - matrix[m[0]][1];

    var xScale = d3.scaleLinear()
      .domain([0, 2000])
      .range([0, width]);
    var yScale = d3.scaleLinear()
      .domain([0, 2000])
      .range([0, height]);

    var j = 0;
    for (var i = (sCount * sSize); i < ((sCount + 2) * sSize); i++) {
      points[i].x = matrix[m[0]][0] + xScale(j) + xOffset;
      points[i].y = matrix[m[0]][1] + yScale(j) + yOffset;
      j++;
    }
    sCount = sCount + 2;
  });
  
  return points;
}

/**
 * Given a set of points, lay them out in a tree of life.
 * Mutates the `points` passed in by updating the x and y values.
 */
function metaLayout(points, pointWidth, width, height, matrix, symbol, radius) {

  const periods = 64;

  const thetaScale = d3.scaleLinear()
    .domain([0, points.length - 1])
    .range([0, periods * 2 * Math.PI]);

  var sCount = 0;
  var sSize = 1000;

  var xOffset = 42;
  var yOffset = 32;

  symbol.map( function(m) {
    for (var i = (sCount * sSize); i < ((sCount + 1) * sSize); i++) {
      points[i].x = radius * Math.cos(thetaScale(i)) + xOffset + matrix[m][0];
      points[i].y = radius * Math.sin(thetaScale(i)) + yOffset + matrix[m][1];
    }
    sCount = sCount + 1;
  });

  xOffset = width / 2;
  yOffset = height / 2;
  radius  = (height / 2) - 0.5 * pointWidth;

  for (var i =(sCount * sSize); i < ((sCount + 6) * sSize); i++) {
    points[i].x = radius * Math.cos(thetaScale(i)) + xOffset;
    points[i].y = radius * Math.sin(thetaScale(i)) + yOffset;
  }
  sCount = sCount + 6;

  var xOffset = 42;
  var yOffset = 32;

  var lines = [
    [4,20],[20,36],
    [4,24],[24,44],
    [36,40],[40,44],
    [36,72],[72,108],
    [44,80],[80,116],
    [56,60],[92,96],
    [4,92],[4,96],
    [36,112],[36,148],
    [44,112],[44,148],
    [36,60],[36,76],
    [44,56],[44,76],
    [56,112],[40,92],
    [60,112],[40,96],
    [108,96],[108,76],
    [116,92],[116,76],
    [108,112],[112,116],
    [4,76],[76,148],
    [108,4],[108,40],
    [116,4],[116,40],
    [108,148],[56,148],
    [116,148],[60,148],
    [56,92],[60,96]
  ];

  lines.map( function(m) {

    var width  = matrix[m[1]][0] - matrix[m[0]][0];
    var height = matrix[m[1]][1] - matrix[m[0]][1];

    var xScale = d3.scaleLinear()
      .domain([0, 1000])
      .range([0, width]);
    var yScale = d3.scaleLinear()
      .domain([0, 1000])
      .range([0, height]);

    var j = 0;
    for (var i = (sCount * sSize); i < ((sCount + 1) * sSize); i++) {
      points[i].x = matrix[m[0]][0] + xScale(j) + xOffset;
      points[i].y = matrix[m[0]][1] + yScale(j) + yOffset;
      j++;
    }
    sCount = sCount + 1;
  });

  console.log(sCount);
  
  return points;
}

