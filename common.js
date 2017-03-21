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
  const periods = 200;

  const thetaScale = d3.scaleLinear()
    .domain([0, points.length - 1])
    .range([0, periods * 2 * Math.PI]);

  var sCount = 3;
  var sSize = 1000;

/**
  var radius  = (height / 2) - 0.5 * pointWidth;
  for (i = 0; i < (sSize * sCount); i++) {
    points[i].x = radius * Math.cos(thetaScale(i)) + xOffset;
    points[i].y = radius * Math.sin(thetaScale(i)) + yOffset;
  }

  var radius  = (height / 8 * 3.94) - 0.5 * pointWidth;
  for (i = (sCount * sSize); i < (sSize * (sCount + 3)); i++) {
    points[i].x = radius * Math.cos(thetaScale(i)) + xOffset;
    points[i].y = radius * Math.sin(thetaScale(i)) + yOffset;
  }
  sCount = sCount + 3;
*/

  radius = (height / 8.0);
  xOffset = radius;
  yOffset = radius;
  sinOffset = -1.0 * Math.sin(60) * radius;
  cosOffset = -1.0 * Math.cos(60) * radius;

console.log(radius);
console.log(sinOffset);
console.log(cosOffset);

  var matrix = []
  for (k=0; k<6; k++) { 
    for (j=0; j<20; j++) { 
       x = j * (cosOffset / 2);
       y = k * (radius / 2);
       matrix.push([x,y])    
    }
  }

  var flower = [0,2,4,6,8,41,43,45]
  //var flower = [0,20,40];
  flower.map( function(m) {
    for (i = (sCount * sSize); i < ((sCount + 1) * sSize); i++) {
      points[i].x = radius * Math.cos(thetaScale(i)) + xOffset + matrix[m][0];
      points[i].y = radius * Math.sin(thetaScale(i)) + yOffset + matrix[m][1];
    }
    sCount++;
  });
/**
  for (j=0; j<6; j++) { 
    for (i = (sCount * sSize); i < ((sCount + 1) * sSize); i++) {
      points[i].x = radius * Math.cos(thetaScale(i)) + xOffset + Math.cos(j * Math.PI / 3) * radius;
      points[i].y = radius * Math.sin(thetaScale(i)) + yOffset + Math.sin(j * Math.PI / 3) * radius;
    }
    sCount++;

    secondxOffset = xOffset + Math.cos(j * Math.PI / 3) * radius 
    secondyOffset = xOffset + Math.sin(j * Math.PI / 3) * radius 

    var x = [j, j+1].map( function(k) {
      for (i = (sCount * sSize); i < ((sCount + 1) * sSize); i++) {
        points[i].x = radius * Math.cos(thetaScale(i)) + secondxOffset +  Math.cos(k * Math.PI / 3) * radius;
        points[i].y = radius * Math.sin(thetaScale(i)) + secondyOffset +  Math.sin(k * Math.PI / 3) * radius;
      }
      sCount++;
      var t1 = [1, 3, 5]
      var t = [];
      if (t1.indexOf(k) >= 0) {
        t = [k];
      } else {
        t = [k, k+1];
      }
      thirdxOffset = secondxOffset + Math.cos(k * Math.PI / 3) * radius 
      thirdyOffset = secondyOffset + Math.sin(k * Math.PI / 3) * radius 
      var x = [k, k+1].map( function(l) {
        for (i = (sCount * sSize); i < ((sCount + 1) * sSize); i++) {
          points[i].x = radius * Math.cos(thetaScale(i)) + thirdxOffset +  Math.cos(l * Math.PI / 3) * radius;
          points[i].y = radius * Math.sin(thetaScale(i)) + thirdyOffset +  Math.sin(l * Math.PI / 3) * radius;
        }
        sCount++;
      });
    });
  }
*/

  console.log(i);
  console.log(sCount);
  return points;
}

