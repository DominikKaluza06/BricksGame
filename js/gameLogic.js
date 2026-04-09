var currentLevel = 0; // Tracks which level the player is on

const Viewport = {
  w: canvas.width,
  h: canvas.height,
  centerPos: new Vector2(canvas.width / 2, canvas.height / 2)
}

// Calculate the new dimensions
const borderHeight = Viewport.h + 200;
const borderCenterY = borderHeight / 2;

// Create the position vector
const borderPos = new Vector2(Viewport.w / 2, borderCenterY);

// Initialize the border
const worldBorder = new WorldBorder(borderPos, Viewport.w, borderHeight);
const paddle = new Paddle(
  new Vector2(Viewport.w / 2, Viewport.h - 20), 
  0, 150, 15, "blue");
const ball = new Ball(new Vector2(400, 750), 0, new Vector2(0.1, -1), 500, 20, paddle);
/*
 this is how to give an object a custom function
 AFTER initialization and declaration
brick2.process = function process(delta) {
  this.rotation += 25 * delta;
}
*/

class GameManager extends Node {
  process(delta) {
    // Look through all engine nodes and count how many are Bricks
    const bricksLeft = engine.nodes.filter(node => node instanceof Brick).length;

    // If no bricks are left, progress to the next level
    if (bricksLeft === 0) {
      currentLevel++;
      
      if (currentLevel < levels.length) {
        loadLevel(currentLevel); // Load next map
      } else {
        console.log("You win! Game Over.");
        this.queueFree(); // Stop checking, game is done
      }
    }
  }
}

// create a VERY important engine which runs the entire game
const engine = new Engine("canvas", []);


function loadLevel(currentLevel) {
  // 1. Clear out all old objects from the engine memory
  engine.nodes = [];

  // 2. Add our persistent static objects back
  engine.add(worldBorder);
  
  // 3. Reset Paddle and Ball positions
  paddle.position = new Vector2(Viewport.w / 2, Viewport.h - 20);
  ball.position = new Vector2(Viewport.w / 2, Viewport.h - 100);
  ball.velocity = new Vector2(0, 0); 
  ball.speed = 500;
  ball.direction = new Vector2(0.1, -1).normalize();
  
  engine.add(paddle);
  engine.add(ball);

  // 4. Load the bricks for this specific level
  const layout = levels[currentLevel];
  if (!layout) {
    console.log("YOU BEAT THE GAME!");
    return; 
  }

  const rows = layout.length;
  const cols = layout[0].length;
  
  const brickWidth = Viewport.w / cols;
  const brickHeight = 20;

  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < cols; c++) {
      const brickHealth = layout[r][c];
      
      // Only spawn a brick if the number is greater than 0
      if (brickHealth > 0) {
        // Calculate where to place it on the canvas
        const brickPos = new Vector2(
          (c * brickWidth) + brickWidth, 
          (r * brickHeight) + (brickHeight / 2)
        );

        engine.add(new Brick(brickPos, 0, brickHealth, brickWidth, brickHeight));
      }
    }
  }

  // 5. Add the Game Manager to track level progression (See step 3!)
  engine.add(new GameManager());
}


// Start the game!
loadLevel(currentLevel);