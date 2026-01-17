class Tile {
    static NOTHING = 0;
    static TRI_UPRIGHT = 1;
    static TRI_UPLEFT = 2;
    static TRI_BOTTOMRIGHT = 3;
    static TRI_BOTTOMLEFT = 4;
    static RECT_BOTTOM = 5;
    static RECT_RIGHT = 6;
    static RECT_LEFT = 7;
    static RECT_TOP = 8;
    static SQUARE = 9;
  
    constructor(x, y, size, type, fillColor) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.type = type;
      this.fillColor = fillColor;
    }
  
    display() {
      noStroke();
      fill(this.fillColor);
  
      let x = this.x;
      let y = this.y;
      let s = this.size;
      let x2 = x + s;
      let y2 = y + s;
  
      switch (this.type) {
        case Tile.NOTHING:
          break;
  
        case Tile.TRI_UPRIGHT:
          triangle(x, y, x2, y, x2, y2);
          break;
  
        case Tile.TRI_UPLEFT:
          triangle(x, y, x2, y, x, y2);
          break;
  
        case Tile.TRI_BOTTOMRIGHT:
          triangle(x2, y, x2, y2, x, y2);
          break;
  
        case Tile.TRI_BOTTOMLEFT:
          triangle(x, y, x2, y2, x, y2);
          break;
  
        case Tile.RECT_BOTTOM:
          rect(x, y + s / 2, s, s / 2);
          break;
  
        case Tile.RECT_RIGHT:
          rect(x + s / 2, y, s / 2, s);
          break;
  
        case Tile.RECT_LEFT:
          rect(x, y, s / 2, s);
          break;
  
        case Tile.RECT_TOP:
          rect(x, y, s, s / 2);
          break;
  
        case Tile.SQUARE:
          rect(x, y, s, s);
          break;
      }
    }
  }
  