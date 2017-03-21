/**
 * Given a set of points, lay them out in a phyllotaxis layout.
 * Mutates the `points` passed in by updating the x and y values.
 *
 * @param {Object[]} points The array of points to update. Will get `x` and `y` set.
 * @param {Number} pointWidth The size in pixels of the point's width. Should also include margin.
 * @param {Number} xOffset The x offset to apply to all points
 * @param {Number} yOffset The y offset to apply to all points
 *
 * @return {Object[]} points with modified x and y
 */
function phyllotaxisLayout(points, pointWidth, xOffset = 0, yOffset = 0, iOffset = 0) {
  // theta determines the spiral of the layout
  const theta = Math.PI * (3 - Math.sqrt(5));

  const pointRadius = pointWidth / 2.8;

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
 *
 * @param {Object[]} points The array of points to update. Will get `x` and `y` set.
 * @param {Number} pointWidth The size in pixels of the point's width. Should also include margin.
 * @param {Number} width The width of the area to place them in
 * @param {Number} height The height of the area to place them in
 *
 * @return {Object[]} points with modified x and y
 */
function randomLayout(points, pointWidth, width, height) {
  points.forEach((point, i) => {
    point.x = Math.random() * (width - pointWidth);
    point.y = Math.random() * (height - pointWidth);
  });

  return points;
}

/**
 * Given a set of points, lay them out in a spiral.
 * Mutates the `points` passed in by updating the x and y values.
 *
 * @param {Object[]} points The array of points to update. Will get `x` and `y` set.
 * @param {Number} pointWidth The size in pixels of the point's width. Should also include margin.
 * @param {Number} width The width of the area to place them in
 * @param {Number} height The height of the area to place them in
 *
 * @return {Object[]} points with modified x and y
 */
function spiralLayout(points, pointWidth, width, height) {
  const amplitude = 0.3 * (height / 2);
  const xOffset = width / 2;
  const yOffset = height / 2;
  const periods = 20;

  const rScale = d3.scaleLinear()
    .domain([0, points.length -1])
    .range([0, Math.min(width / 2, height / 2) - pointWidth]);

  const thetaScale = d3.scaleLinear()
    .domain([0, points.length - 1])
    .range([0, periods * 2 * Math.PI]);

  points.forEach((point, i) => {
    point.x = rScale(i) * Math.cos(thetaScale(i)) + xOffset
    point.y = rScale(i) * Math.sin(thetaScale(i)) + yOffset;
  });

  return points;
}

/**
 * Generate an object array of `numPoints` length with unique IDs
 * and assigned colors
 */
function createPoints(numPoints, pointWidth, width, height) {
  const colorScale = d3.scaleSequential(d3.interpolateViridis)
    .domain([numPoints - 1, 0]);

  const points = d3.range(numPoints).map(id => ({
    id,
    color: colorScale(id),
  }));

  return randomLayout(points, pointWidth, width, height);
}

/**
 * Given a set of points, lay them out in a spiral.
 * Mutates the `points` passed in by updating the x and y values.
 *
 * @param {Object[]} points The array of points to update. Will get `x` and `y` set.
 * @param {Number} pointWidth The size in pixels of the point's width. Should also include margin.
 * @param {Number} width The width of the area to place them in
 * @param {Number} height The height of the area to place them in
 *
 * @return {Object[]} points with modified x and y
 */
function circleLayout(points, pointWidth, width, height) {

  var xOffset = width / 2;
  var yOffset = height / 2;
  const periods = 40;

  const thetaScale = d3.scaleLinear()
    .domain([0, points.length - 1])
    .range([0, periods * 2 * Math.PI]);

  var sCount = 3;
  var sSize = 1000;

  var radius  = (height / 2) - 0.5 * pointWidth;
  for (i = 0; i < (sSize * sCount); i++) {
    points[i].x = radius * Math.cos(thetaScale(i)) + xOffset;
    points[i].y = radius * Math.sin(thetaScale(i)) + yOffset;
  }

  var radius  = (height / 8) - 0.2 * pointWidth;
  xOffset = radius / 2 + 3;
  yOffset = radius / 2 + 5;
  //sinOffset = -1.0 * Math.sin(60) * radius;
  //cosOffset = -1.0 * Math.cos(60) * radius;
  cosOffset = Math.sqrt(Math.pow(radius,2) - (Math.pow((radius /2),2)));

  var matrix = []
  for (k=1.0; k<8.0; k++) { 
    for (j=1.0; j<17.0; j++) { 
       x = j * (radius / 2.0);
       y = k * (cosOffset);
       matrix.push([x,y])    
    }
  }

  var flower = [3,5,7,9,18,20,22,24,26,33,35,37,39,41,43,48,50,52,54,56,58,60,65,67,69,71,73,75,82,84,86,88,90,99,101,103,105];
  flower.map( function(m) {
    for (i = (sCount * sSize); i < ((sCount + 1) * sSize); i++) {
      points[i].x = radius * Math.cos(thetaScale(i)) + xOffset + matrix[m][0];
      points[i].y = radius * Math.sin(thetaScale(i)) + yOffset + matrix[m][1];
    }
    sCount++;
  });


  console.log(i);
  console.log(sCount);
  return points;
}

