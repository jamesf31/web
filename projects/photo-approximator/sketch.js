let img;
let holder;
let canvas;

let gui;
let params = {
  autoRun: true,
  formsPerFrame: 20,
  minFormSize: 5,
  maxFormSize: 300,
  clearCanvas: () => canvas.clear(),
  
};

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

  gui = new lil.GUI();
  gui.add(params, 'autoRun');
  gui.add(params, 'formsPerFrame', 1, 50, 1);
  gui.add(params, 'minFormSize', 1, 20, 1);
  gui.add(params, 'maxFormSize', 20, 1000, 1);
  gui.add(params, 'clearCanvas');
}

function draw() {
  for (let i = 0; i < params.formsPerFrame; i++) {
    if(params.autoRun) {
        addMark();
    }
  }
}

function addMark() {
  let x = floor(random(img.width));
  let y = floor(random(img.height));

  let index = 4 * (y * img.width + x);
  let r = img.pixels[index];
  let g = img.pixels[index + 1];
  let b = img.pixels[index + 2];

  let size = random(params.minFormSize, params.maxFormSize);

  // opacity inversely proportional to size
  let alpha = map(size, params.minFormSize, params.maxFormSize, 150, 1);

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
