var currentLevel = 0; // Spremlja, na kateri stopnji je igralec
const showLevel = document.getElementById("levelShow");
showLevel.innerText ="Trenutno si na " + currentLevel + ". levelu";

const Viewport = {
  w: canvas.width,
  h: canvas.height,
  centerPos: new Vector2(canvas.width / 2, canvas.height / 2)
}

// Izračun dimenzij meje sveta
const borderHeight = Viewport.h + 200;
const borderCenterY = borderHeight / 2;
const borderPos = new Vector2(Viewport.w / 2, borderCenterY);

// Inicializacija objektov (brez parametra 0 za rotacijo)
const worldBorder = new WorldBorder(borderPos, Viewport.w, borderHeight);

const paddle = new Paddle(
  new Vector2(Viewport.w / 2, Viewport.h - 20), 
  150, 15 // Odstranjena rotacija
);

const ball = new Ball(
  new Vector2(paddle.position.x, paddle.position.y - 10), 
  new Vector2(0.1, -1), 
  500, 20, 
  paddle // Odstranjena rotacija
);


function loadLevel(currentLevel) {
  engine.nodes = [];

  engine.add(worldBorder);
  
  // Ponastavitev pozicij
  paddle.position = new Vector2(Viewport.w / 2, Viewport.h - 20);
  ball.position = new Vector2(paddle.position.x, paddle.position.y - 10);
  ball.velocity = new Vector2(0, 0); 
  ball.speed = 500;
  ball.direction = new Vector2(0.1, -1);
  
  engine.add(paddle);
  engine.add(ball);

  const layout = levels[currentLevel];
  if (!layout) {
    console.log("IGRA JE KONČANA!");
    return; 
  }

  const rows = layout.length;
  const cols = layout[0].length;
  
  const brickWidth = Viewport.w / cols;
  const brickHeight = 20;

for (var r = 0; r < rows; r++) {
    for (var c = 0; c < cols; c++) {
      const brickHealth = layout[r][c];
      
      if (brickHealth > 0) {
        const brickPos = new Vector2(
          (c * brickWidth) + brickWidth, 
          (r * brickHeight) + (brickHeight / 2)
        );
        engine.add(new Brick(brickPos, brickHealth, brickWidth, brickHeight));
      }
    }
  }

  engine.add(new GameManager());
}

// Začetek igre
loadLevel(currentLevel);