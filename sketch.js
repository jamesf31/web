let grid;
let rows = 12;
let cols = 12;
let tileSize = 40;
let frameCount = 0;

let rules = [];

let gui;
let params = {
  autoRun: false,
  runSpeed: 5,
  autoMutate: false,
  mutationRate: 1,
  step_1: () => applyRule(rules[0]),
  step_2: () => applyRule(rules[1]),
  mutateRule_1: () => rules[0] = generateRandomRule(),
  mutateRule_2: () => rules[1] = generateRandomRule()
  
};


function generateRandomRule() {
  let target = floor(random(1, 10)); // exclude NOTHING
  let pattern = [];

  for (let i = 0; i < 3; i++) {
    pattern[i] = [];
    for (let j = 0; j < 3; j++) {
      pattern[i][j] = random() < 0.1 ? Tile.NOTHING : floor(random(10));
    }
  }

  return new Rule(target, pattern);
}

function replaceRandomRule() {
  let index = floor(random(rules.length));
  rules[index] = generateRandomRule();
}


function setup() {
  createCanvas(cols * tileSize + 200, rows * tileSize);
  colorMode(HSB, 360, 100, 100);

  rules.push(generateRandomRule());
  rules.push(generateRandomRule());


  grid = [];

  for (let i = 0; i < rows; i++) {
    grid[i] = [];
    for (let j = 0; j < cols; j++) {
      let type = floor(random(10));
      let c = color(map(type, 0, 9, 0, 360), 70, 90);
      grid[i][j] = new Tile(
        j * tileSize,
        i * tileSize,
        tileSize,
        type,
        c
      );
    }
  }

  gui = new lil.GUI();
  gui.add(params, 'autoRun');
  gui.add(params, 'runSpeed', 0, 50, 1)
  gui.add(params, 'autoMutate');
  gui.add(params, 'mutationRate', 0, 50, 1),
  gui.add(params, 'step_1');
  gui.add(params, 'step_2');
  gui.add(params, 'mutateRule_1');
  gui.add(params, 'mutateRule_2');

}

function draw() {
  background(0, 0, 95);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j].display();
    }
  }

  for (let i = 0; i < rules.length; i++) {
    rules[i].display(cols*tileSize + 50, 200 * i + 100, 100, i + 1);
  }

  if (params.autoRun && params.runSpeed != 0 && frameCount % map(params.runSpeed, 1, 50, 50, 1) == 0) {
    applyRule(rules[floor(random(rules.length))]);
  }

  if (params.autoMutate && params.mutationRate != 0 && frameCount % map(params.mutationRate, 1, 50, 50, 1) == 0) {
    replaceRandomRule();
  }
  
  frameCount++;
  if (frameCount >=5000) { frameCount = 0; }
}

function keyPressed() {
  let idx = key - '1';
  if (idx >= 0 && idx < rules.length) {
    applyRule(rules[idx]);
  }
}

function applyRule(rule) {
  let newGrid = [];

  for (let i = 0; i < rows; i++) {
    newGrid[i] = [];
    for (let j = 0; j < cols; j++) {
      newGrid[i][j] = grid[i][j];
    }
  }

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j].type === rule.targetType) {
        for (let di = -1; di <= 1; di++) {
          for (let dj = -1; dj <= 1; dj++) {
            let ni = i + di;
            let nj = j + dj;
            if (ni < 0 || ni >= rows || nj < 0 || nj >= cols) continue;

            let t = rule.resultGrid[di + 1][dj + 1];
            if (t === Tile.NOTHING) continue;

            let c = color(map(t, 0, 9, 0, 360), 70, 90);
            newGrid[ni][nj] = new Tile(
              nj * tileSize,
              ni * tileSize,
              tileSize,
              t,
              c
            );
          }
        }
      }
    }
  }

  grid = newGrid;
}
