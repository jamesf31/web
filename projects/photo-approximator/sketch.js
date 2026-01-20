let img;
let holder;
let canvas;
let marksPerFrame = 50;

function preload() {
  console.log("preload started");
  img = loadImage(
    'image.jpg',
    () => console.log("image loaded"),
    () => console.error("image failed to load")
  );
}

function setup() {
  holder = document.getElementById('sketch-holder');

  let w = holder.clientWidth;
  let h = holder.clientHeight;

  canvas = createCanvas(w, h);
  canvas.parent('sketch-holder');

  background(255);
  img.resize(w, h);
  img.loadPixels();
}

function draw() {
  for (let i = 0; i < marksPerFrame; i++) {
   addMark();
  }
}

function addMark() {
  let x = floor(random(img.width));
  let y = floor(random(img.height));

  let index = 4 * (y * img.width + x);
  let r = img.pixels[index];
  let g = img.pixels[index + 1];
  let b = img.pixels[index + 2];

  let t = frameCount * 0.0001;
    let size = random(
    lerp(40, 3, t),
    lerp(300, 15, t)
    );

  // opacity inversely proportional to size
  let alpha = map(size, 1, 150, 255, 1);

  noStroke();
  fill(r, g, b, alpha);

  drawRandomShape(x, y, size);
}

function drawRandomShape(x, y, size) {
  let choice = floor(random(3));

  push();
  translate(x, y);
  rotate(random(TWO_PI));

  if (choice === 0) {
    ellipse(0, 0, size, size);
  } 
  else if (choice === 1) {
    rectMode(CENTER);
    rect(0, 0, size, size);
  } 
  else {
    triangle(
      -size / 2, size / 2,
       size / 2, size / 2,
       0, -size / 2
    );
  }

  pop();
}
