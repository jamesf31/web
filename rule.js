class Rule {
    constructor(targetType, resultGrid) {
      this.targetType = targetType;
      this.resultGrid = resultGrid; // 3x3 array
    }
  
    display(x, y, size, label) {
      let cellSize = size / 3;

      let t = this.targetType;

      let cx = x + cellSize;
      let cy = y - 1.5*cellSize;

      let c = color(map(t, 0, 9, 0, 360), 70, 90);
      let tempTile = new Tile(cx, cy, cellSize, t, c);
      tempTile.display();
  
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          let t = this.resultGrid[i][j];
          if (t === Tile.NOTHING) continue;
  
          let cx = x + j * cellSize;
          let cy = y + i * cellSize;
  
          let c = color(map(t, 0, 9, 0, 360), 70, 90);
          let tempTile = new Tile(cx, cy, cellSize, t, c);
          tempTile.display();
        }
      }
  
      stroke(0);
      noFill();
      rect(x, y, size, size);
  
      noStroke();
      fill(0);
      textAlign(CENTER, TOP);
      text("Rule: " + label, x + size / 2, y + size + 6);
    }
  }
  