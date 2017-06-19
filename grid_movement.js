var gridSize = 32;
var landscape;
var cols;
var rows;
var player;

var mousePos;
var route;

function setup() {
  createCanvas(400, 300);
  //cols moves along the y axis
  cols = floor(height / gridSize);
  //rows moves along the x axis
  rows = floor(width / gridSize);
  landscape = new Grid();
  player = new Player(landscape);
  mousePos = new MousePosition(landscape);
  landscape.create();
}

function draw() {
  background(51);
  mousePos.update(mouseX, mouseY);
  player.show();
  landscape.show();
}

function mousePressed() {
  player.cellPosition();
  mousePos.cellPosition();
  route = new Route(mousePos.currentCell, player.currentCell);
  route.find();
  player.move(route.path);
}

function Route(mouseCell, playerCell) {
  this.start;
  this.end;
  this.openSet = [];
  this.closedSet = [];
  this.path = [];

  this.find = function() {
    this.start = playerCell;
    this.end = mouseCell;
    this.openSet.push(this.start);
    while (this.openSet.length > 0) {
      var winner = 0;
      for (i = 0; i < this.openSet.length; i++) {
        if (this.openSet[i].f < this.openSet[winner].f) {
          winner = i;
        }
      }
      var current = this.openSet[winner];
      if (current === this.end) {
        var temp = current;
        this.path.push(temp);
        while (temp.previous) {
          console.log('in path loop');
          this.path.push(temp.previous);
          temp = temp.previous;
        }
        this.path.reverse();
        console.log('DONE!');
        break;
      }
      removeFromArray(this.openSet, current);
      this.closedSet.push(current);

      var neighbors = current.neighbors;

      for (i = 0; i < neighbors.length; i++) {
        var neighbor = neighbors[i];
        if (!this.closedSet.includes(neighbor)) {
            var tempG = current.g + 1;
          if (this.openSet.includes(neighbor)) {
            if (tempG < neighbor.g) {
              neighbor.g = tempG;
            }
          } else {
            neighbor.g = tempG;
            this.openSet.push(neighbor);
          }
          neighbor.h = Heuristic(neighbor, this.end);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.previous = current;
        }
      }
    } //end while loop
  };
}

function Heuristic(a, b) {
  //Eucledian Distance
  var d = dist(a.x, a.y, b.x, b.y);
  //Taxi Cab distance
  //var d = abs(a.x - b.x) + abs(a.y - b.y);
  return d;
}
function Cell(x, y) {
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.x = x;
  this.y = y;

  this.neighbors = [];
  this.previous = undefined;

  this.addNeighbors = function(grid) {
    var x = this.x;
    var y = this.y;
    if (x < rows - 1) {
      this.neighbors.push(grid[x + 1][y]);
    }
    if (x > 0) {
      this.neighbors.push(grid[x - 1][y]);
    }
    if (y < cols - 1) {
      this.neighbors.push(grid[x][y + 1]);
    }
    if (y > 0) {
      this.neighbors.push(grid[x][y - 1]);
    }
  };

  this.show = function() {
    stroke(255);
    noFill();
    text('x: ' + this.x, this.x * gridSize, this.y * gridSize + 10)
    text('y: ' + this.y, this.x * gridSize, this.y * gridSize + 30);
    rect(this.x * gridSize, this.y * gridSize, gridSize, gridSize);
  };

}

function Grid() {
  this.grid = [];

  this.create = function() {
    for (i = 0; i < rows; i++) {
      this.grid[i] = new Array(cols);
    }
    for (x = 0; x < rows; x++) {
      for (y = 0; y < cols; y++) {
        this.grid[x][y] = new Cell(x, y);
      }
    }
    for (x = 0; x < rows; x++) {
      for (y = 0; y < cols; y++) {
        this.grid[x][y].addNeighbors(this.grid);
      }
    }
  };

  this.show = function() {
    for (x = 0; x < rows; x++) {
      for (y = 0; y < cols; y++) {
        this.grid[x][y].show();
      }
    }
  };
}

function Player(landscape) {
  this.pos = createVector(0, 0);
  this.currentCell;

  this.show = function() {
    fill(255, 0, 0, 220);
    noStroke();
    rect(this.pos.x, this.pos.y, gridSize, gridSize);
  };

  this.move = function(path) {
    //move along path
  };

  this.cellPosition = function() {
    for (x = 0; x < rows; x++) {
      for (y = 0; y < cols; y++) {
        if (this.pos.x == x * gridSize && this.pos.y == y * gridSize) {
          this.currentCell = landscape.grid[x][y];
          break;
        }
      }
    }
  };
}

function MousePosition(landscape) {
  this.pos = createVector(0, 0);
  this.currentCell;

  this.update = function(x, y) {
    this.pos.x = x;
    this.pos.y = y;
  };

  this.cellPosition = function() {
    for (x = 0; x < rows; x++) {
      for (y = 0; y < cols; y++) {
        var topleftX = x * gridSize;
        var topleftY = y * gridSize;
        if (this.pos.x >= topleftX && this.pos.x <= topleftX + gridSize &&
            this.pos.y >= topleftY && this.pos.y <= topleftY + gridSize) {
          this.currentCell = landscape.grid[x][y];
          break;
        }
      }
    }
  };
}
function removeFromArray(array, element) {
  for (i = array.length - 1; i >= 0; i--) {
    if (array[i] == element) {
      array.splice(i, 1);
    }
  }
}
