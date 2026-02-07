// =========================
// CONFIG
// =========================
let cursorPoly;
let staticPolys = [];

let graphHeight = 200;
let samples = 150;
let totalArea = 0;
let scale = 120;
let totalOverlap = 0;

// =========================
// SETUP
// =========================
function setup() {
  createCanvas(900, 500);

  // Cursor polygon (triangle)
  cursorPoly = createRectangle(0,0, 300, 200)

  // Static polygons
  staticPolys.push([
    { x: 300, y: (height - graphHeight)/2 },
    { x: 550, y: (height - graphHeight)/2 - 90},
    { x: 550, y: (height - graphHeight)/2 + 90}])

  for (let poly of staticPolys) {
    totalArea+= polygonArea(poly);
  }
}

// =========================
// DRAW
// =========================
function draw() {
  background(250);

  // Draw static shapes
  stroke(0);
  noFill();
  for (let poly of staticPolys) {
    drawPolygon(poly);
  }

  // Cursor-following polygon
  let cursor = translatePolygon(cursorPoly, mouseX - 300, mouseY - 100);

  stroke(60, 60, 60);
  fill(40, 40, 40, 40);
  drawPolygon(cursor);

  // Compute total intersection area
  totalOverlap = 0;
  for (let poly of staticPolys) {
    let clipped = polygonClip(cursor, poly);
    if (clipped.length > 0) {
      stroke(60, 60, 60);
      fill(80, 80, 80, 80);
      drawPolygon(clipped);
      totalOverlap += polygonArea(clipped);
    }
  }

  fill(0);
  noStroke();
  //text("Age: " + (totalOverlap / totalArea * scale).toFixed(1), 10, 20);

  // Draw convolution
  drawConvolution(mouseY);
}

// =========================
// CONVOLUTION
// =========================
function drawConvolution(yPos) {
  let values = [];
  let maxVal = 0;

  for (let i = 0; i < samples; i++) {
    let x = map(i, 0, samples - 1, 0, width);
    let cursor = translatePolygon(cursorPoly, x - 300, yPos - 100);

    let sum = 0;
    for (let poly of staticPolys) {
      let clipped = polygonClip(cursor, poly);
      if (clipped.length > 0) {
        sum += polygonArea(clipped);
      }
    }

    values.push(sum);
    maxVal = max(maxVal, sum);
  }

  let baseY = height - 20;
  let topY = baseY - graphHeight;

  noStroke();
  fill(240);
  rect(0, topY, width, graphHeight);

  stroke(0);
  noFill();
  beginShape();
  for (let i = 0; i < samples; i++) {
    let x = map(i, 0, samples - 1, 0, width);
    let y = map(values[i], 0, totalArea, baseY, topY);
    vertex(x, y);
  }
  endShape();

  let cursor = translatePolygon(cursorPoly, mouseX - 300, mouseY - 100);

    let sum = 0;
    for (let poly of staticPolys) {
        let clipped = polygonClip(cursor, poly);
        if (clipped.length > 0) {
        sum += polygonArea(clipped);
        }
    }

    fill(255);
  circle(mouseX, map(sum, 0, totalArea, baseY, topY), 5);
  noStroke();
  fill (20);
  text("Age: " + (totalOverlap / totalArea * scale).toFixed(1), mouseX + 6, map(sum, 0, totalArea, baseY, topY) - 3);

  fill(0);
  noStroke();
  //text("Overlap distribution at y = " + int(yPos), 10, topY - 5);
}

// =========================
// GEOMETRY UTILITIES
// =========================

// Shoelace formula
function polygonArea(poly) {
  let area = 0;
  for (let i = 0; i < poly.length; i++) {
    let j = (i + 1) % poly.length;
    area += poly[i].x * poly[j].y - poly[j].x * poly[i].y;
  }
  return abs(area) / 2;
}

// Sutherland–Hodgman clipping
function polygonClip(subject, clip) {
  let output = subject;

  for (let i = 0; i < clip.length; i++) {
    let A = clip[i];
    let B = clip[(i + 1) % clip.length];
    let input = output;
    output = [];

    for (let j = 0; j < input.length; j++) {
      let P = input[j];
      let Q = input[(j + 1) % input.length];

      if (inside(Q, A, B)) {
        if (!inside(P, A, B)) {
          output.push(intersection(P, Q, A, B));
        }
        output.push(Q);
      } else if (inside(P, A, B)) {
        output.push(intersection(P, Q, A, B));
      }
    }
  }

  return output;
}

function inside(p, a, b) {
  return (b.x - a.x) * (p.y - a.y) -
         (b.y - a.y) * (p.x - a.x) >= 0;
}

function intersection(p1, p2, a, b) {
  let d1x = p2.x - p1.x;
  let d1y = p2.y - p1.y;
  let d2x = b.x - a.x;
  let d2y = b.y - a.y;

  let det = d1x * d2y - d1y * d2x;
  if (abs(det) < 0.00001) return p2;

  let t = ((a.x - p1.x) * d2y - (a.y - p1.y) * d2x) / det;
  return {
    x: p1.x + t * d1x,
    y: p1.y + t * d1y
  };
}

// =========================
// SHAPE BUILDERS
// =========================
function createRegularPolygon(cx, cy, sides, r) {
  let poly = [];
  for (let i = 0; i < sides; i++) {
    let angle = TWO_PI * i / sides - HALF_PI;
    poly.push({
      x: cx + cos(angle) * r,
      y: cy + sin(angle) * r
    });
  }
  return poly;
}

function createRectangle(cx, cy, w, h) {
  return [
    { x: cx - w / 2, y: cy - h / 2 },
    { x: cx + w / 2, y: cy - h / 2 },
    { x: cx + w / 2, y: cy + h / 2 },
    { x: cx - w / 2, y: cy + h / 2 }
  ];
}

function translatePolygon(poly, x, y) {
  return poly.map(p => ({
    x: p.x - poly[0].x + x,
    y: p.y - poly[0].y + y
  }));
}

function drawPolygon(poly) {
  beginShape();
  for (let p of poly) vertex(p.x, p.y);
  endShape(CLOSE);
}
