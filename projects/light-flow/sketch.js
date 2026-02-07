let gridSize = 24;      // Spacing to check flow
// Lower = more info but slower
let ignoreThresh = 16;  // Ignore movements below this level

let cachedZones = [];     // final averaged flow field
let analyzing = true;
let frameIndex = 0;

const SAMPLE_EVERY = 4;   // sample every N frames
const MAX_SAMPLES = 60;   // total frame pairs to analyze

let flow;               // Calculated flow for entire image
let previousPixels;     // Copy of previous frame
let video;
let particles = [];

let holder;
let canvas;

function preload() {
  video = createVideo("video.mp4");
}

function setup() {
  holder = document.getElementById('sketch-holder');

  let w = holder.clientWidth;
  let h = holder.clientHeight;

  canvas = createCanvas(w, h);
  canvas.parent('sketch-holder');

  video.size(w, h);

  // Set up flow calculator
  flow = new FlowCalculator(gridSize);
  video.elt.onloadedmetadata = () => {
    video.loop();
  };

}

function draw() {
  video.loadPixels();
  if (video.pixels.length === 0) return;

  if (analyzing) {
    analyzeFlow();
    background(0);
    fill(255);
    text("Analyzing flow… " + frameIndex, 20, 20);
    return;
  }

  // ---- PLAYBACK MODE ----
  tint(100, 20);
  image(video, 0, 0);
  noTint();

  // draw frozen flow field
  //stroke(255, 120);
  // for (let z of cachedZones) {
  //   push();
  //   translate(z.pos.x, z.pos.y);
  //   rotate(z.angle);
  //   line(0, 0, z.mag, 0);
  //   pop();
  // }

  // particles
  noStroke();
  fill(random(180,225));
  for (let p of particles) {
    if (p.x < 0) { p.x = width - 1 }
    if (p.x > width ) { p.x = width - 1; }
    if (p.y >  height) { p.y = 1; }
    if (p.y < 0) { p.y = height - 1; }
    let f = sampleFlow(p.x, p.y);
    p.vx = lerp(p.vx, f.vx, 0.85);
    p.vy = lerp(p.vy, f.vy, 0.85);
    p.x += p.vx;
    p.y += p.vy;
    circle(p.x, p.y, 8);

  }

  if (particles.length < 300 && frameCount % 20 == 0) {
    for (let i = 0; i < height; i += 20) {
      let flow = sampleFlow(width - 1, i);
      particles.push({
        x: width - 1,
        y: i,
        vx: flow.vx,
        vy: flow.vy
      });
    }
  }

  if (particles.length > 500) { particles=particles.slice(10); }
}

let zoneAccum = {};  // key → { x, y, vx, vy, count }

function analyzeFlow() {
  if (!previousPixels) {
    previousPixels = copyImage(video.pixels, previousPixels);
    return;
  }

  if (frameIndex % SAMPLE_EVERY !== 0) {
    frameIndex++;
    previousPixels = copyImage(video.pixels, previousPixels);
    return;
  }

  flow.calculate(previousPixels, video.pixels, video.width, video.height);

  if (flow.zones) {
    for (let z of flow.zones) {
      let key = z.pos.x + "," + z.pos.y;

      if (!zoneAccum[key]) {
        zoneAccum[key] = {
          x: z.pos.x,
          y: z.pos.y,
          vx: 0,
          vy: 0,
          count: 0
        };
      }

      zoneAccum[key].vx += z.movement.x;
      zoneAccum[key].vy += z.movement.y;
      zoneAccum[key].count++;
    }
  }

  frameIndex++;
  previousPixels = copyImage(video.pixels, previousPixels);

  if (frameIndex > MAX_SAMPLES * SAMPLE_EVERY) {
    finalizeFlow();
  }
}

function finalizeFlow() {
  cachedZones = [];

  for (let key in zoneAccum) {
    let z = zoneAccum[key];
    let vx = z.vx / z.count;
    let vy = z.vy / z.count;

    let mag = sqrt(vx * vx + vy * vy);
    let angle = atan2(vy, vx);

    cachedZones.push({
      pos: createVector(z.x, z.y),
      movement: createVector(vx, vy),
      mag: mag,
      angle: angle
    });
  }

  analyzing = false;

  console.log("Flow analysis complete:", cachedZones.length, "zones");
}

function mouseDragged() {
  let flow = sampleFlow(mouseX, mouseY);

  particles.push({
    x: mouseX,
    y: mouseY,
    vx: flow.vx,
    vy: flow.vy
  });
}

function sampleFlow(x, y) {
  let vx = 0;
  let vy = 0;
  let wSum = 0;

  const RADIUS = 100;   // influence radius

  for (let f of cachedZones) {
    let d = dist(x, y, f.pos.x, f.pos.y);

    if (d < RADIUS && d > 0.001) {
      let w = 1.0 / d;      // inverse distance weight
      vx += f.movement.x * w;
      vy += f.movement.y * w;
      wSum += w;
    }
  }

  if (wSum === 0) return { vx: 0, vy: 0 };

  return {
    vx: vx / wSum,
    vy: vy / wSum
  };
}