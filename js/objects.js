class Engine {
  constructor(canvasId, nodes = []) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.nodes = nodes;
    this.lastTime = performance.now();

    requestAnimationFrame((t) => this._loop(t));
  }

  _loop(timestamp) {
    const delta = (timestamp - this.lastTime) / 1000;
    const safeDelta = Math.min(delta, 0.1);
    this.lastTime = timestamp;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // filter out anything that isQueueFreed (aka removed from memory)
    this.nodes = this.nodes.filter(node => !node.isQueueFreed);

    this.nodes.forEach(node => {
      if (node instanceof Ball) {
        node.process(safeDelta, this.nodes.filter(n =>
          n !== node && // filter self so it doesnt collide w/ itself
          n.collider  // has a collider
        ));

      } else if (node.process) {
        node.process(safeDelta, Viewport);
      }

      if (node.renderer && typeof node.renderer.draw === "function") {
        node.renderer.draw(this.ctx);
      }
    });

    requestAnimationFrame((t) => this._loop(t));
  }

  add(node) { this.nodes.push(node); }
}

class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  normalize() {
    var length = Math.sqrt(this.x * this.x + this.y * this.y);

    // so we dont divide w/ 0
    if (length > 0) {

      // normalization happens here
      this.x /= length;
      this.y /= length;
    }

    return this;
  }

  multiply(multiplier = 1) {
    this.x *= multiplier;
    this.y *= multiplier;

    return this; // for chaining: vector.normalize().multiply(100) ...
  }
  add(adder = 1) {
    this.x += adder;
    this.y += adder;

    return this;
  }

  multVector(vector = new Vector2) {
    this.x *= vector.x;
    this.y *= vector.y;

    return this;
  }
  addVector(vector = new Vector2) {
    this.x += vector.x;
    this.y += vector.y;

    return this;
  }

  clone() {
    return new Vector2(this.x, this.y);
  }
}

class BoxCollider {
  constructor(width = 50, height = 50, inverted = false) {
    this.width = width;
    this.height = height;
    this.inverted = inverted;
  }
}

class HealthComponent {
  constructor(health = 100, onDeath) {
    this.health = health;
    this.onDeath = onDeath;
  }

  takeDamage(amount = 0) {
    this.health -= amount;

    if (this.health <= 0) {
      if (this.onDeath) this.onDeath();
    }
  }
}

class CanvasItem {
  constructor(owner, drawFunction) {
    this.owner = owner;
    this.visible = true;
    this.alpha = 1;
    this.color = "rgba(0,0,0,0)"; // Default color property
    this.drawFunction = drawFunction;
  }

  draw(ctx) {
    if (!this.visible || this.alpha <= 0) return;

    ctx.save();
    ctx.translate(this.owner.position.x, this.owner.position.y);
    ctx.rotate(this.owner.rotation * Math.PI / 180);
    ctx.globalAlpha = this.alpha;

    // Apply the color to BOTH fill and stroke so the callback can choose
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;

    if (this.drawFunction) {
      this.drawFunction(ctx);
    }

    ctx.restore();
  }
}

class Sprite2D {
  constructor(owner = this, imagePath = "", width = 0, height = 0) {
    this.owner = owner;
    this.width = width;
    this.height = height;

    this.texture = new Image();
    this.texture.src = imagePath;
  }

  draw(ctx) {
    if (!this.texture.complete) return;

    ctx.save();

    ctx.translate(this.owner.position.x, this.owner.position.y);
    ctx.rotate(this.owner.rotation * Math.PI / 180);

    ctx.drawImage(
      this.texture,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );

    ctx.restore();
  }
}

class Node {
  constructor() {
    this.isQueueFreed = false;
    this.ready();
  }

  ready() {
    // children run this code once and never again
  }

  process(delta) {
    // children put code here
  }

  queueFree() {
    this.isQueueFreed = true;
  }
}

class Gravity {
  constructor(owner, gravityStrength = 980) {
    this.owner = owner;
    this.gravity = gravityStrength;
  }

  process(delta) {
    if (!this.owner.velocity) return;

    this.owner.velocity.y += this.gravity * delta;
  }
}

class Node2D extends Node {
  constructor(position = new Vector2(0, 0), rotation = 0) {
    super();
    this.position = position;
    this._rotation = 0; // internal private variable
    this.rotation = rotation;
  }

  set rotation(value) {
    // standard math for degrees (0 to 360)
    this._rotation = ((value % 360) + 360) % 360;
  }

  get rotation() {
    return this._rotation;
  }

  getAngleTo(point) {
    const deltaX = point.x - this.position.x;
    const deltaY = point.y - this.position.y;

    const targetAngle = Math.atan2(deltaY, deltaX);
    const currentRotationRad = this.rotation * Math.PI / 180;

    return targetAngle - currentRotationRad;
  }
}

class WorldBorder extends Node2D {
  constructor(position = new Vector2(), width = 800, height = 600) {
    super(position, 0);
    this.width = width;
    this.height = height;

    this.collider = new BoxCollider(width, height, true);
  }
}

class Entity2D extends Node2D {
  constructor(position = new Vector2(), rotation = 0) {
    super(position, rotation);
  }

  // might add some shit here i don't know.
  // leave it be for now
}

class Ball extends Node2D {
  constructor(position = new Vector2(), rotation = 0, startDirection = new Vector2(1, 0), speed = 0, diameter = 0, paddleObj = new Paddle()) {
    super(position, rotation);

    this.direction = startDirection.normalize();
    this.speed = speed;
    this.acceleration = 2.5;
    this.velocity = new Vector2();
    this.diameter = diameter;
    this.paddleRef = paddleObj;

    const visualScale = 1.0;
    const spriteSize = diameter * visualScale;

    this.renderer = new Sprite2D(this, "images/ball/ball.png", spriteSize, spriteSize);
  }

  process(delta, colliders = []) {
    if (this.position.y > worldBorder.height - 100) {
      this.queueFree();
    }

    this.speed += this.acceleration * delta;

    if (this.speed <= 200) return;

    this.direction.normalize();
    this.velocity = this.direction.clone().multiply(this.speed * delta);

    const distanceThisFrame = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
    const stepSize = this.diameter / 2;
    const steps = Math.ceil(distanceThisFrame / stepSize) || 1;
    const stepVelocity = this.velocity.clone().multiply(1 / steps);

    for (let i = 0; i < steps; i++) {
      this.position.addVector(stepVelocity);

      colliders.forEach(collider => {
        const didHit = resolveBoxCollision(this, collider);

        if (didHit && collider === this.paddleRef) {
          // 1. Izračunamo, kje na paddlu smo zadeli (relativno na sredino paddla)
          // Rezultat bo npr. med -50 (leva stran) in +50 (desna stran) - odvisno od širine paddla
          const relativeHitX = this.position.x - this.paddleRef.position.x;

          // 2. Normaliziramo na vrednost med -1.0 (čisto levo) in 1.0 (čisto desno)
          const normalizedHitX = relativeHitX / (this.paddleRef.width / 2);

          // 3. Določimo maksimalni kot odboja (npr. 60 stopinj levo in desno od sredine)
          const maxBounceAngle = 60 * (Math.PI / 180); // pretvorba v radiane

          // 4. Izračunamo končni kot: -90 stopinj (smer gor) + naš zamik
          const bounceAngle = (-90 * (Math.PI / 180)) + (normalizedHitX * maxBounceAngle);

          // 5. Iz kota naredimo nov smerni vektor
          this.direction = new Vector2(Math.cos(bounceAngle), Math.sin(bounceAngle)).normalize();
        }
      });
    }
  }
}

class Paddle extends Node2D {
  constructor(position = new Vector2(), rotation = 0, width = 100, height = 20, color = "black") {
    super(position, rotation);

    this.width = width;
    this.height = height;

    // Dodamo hitrost premikanja (npr. 500 pikslov na sekundo)
    this.speed = 800;

    this.collider = new BoxCollider(this.width, this.height);
    this.renderer = new CanvasItem(this, ctx => {
      ctx.beginPath();
      ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
      ctx.fill();
      ctx.closePath();
    });
    this.renderer.color = color;

    // Objekt za beleženje, ali je tipka trenutno pritisnjena
    this.keys = {
      ArrowLeft: false,
      ArrowRight: false
    };

    // Event listenerja spreminjata samo stanje (true/false)
    window.addEventListener("keydown", (e) => {
      if (this.keys.hasOwnProperty(e.key)) {
        this.keys[e.key] = true;
      }
    });

    window.addEventListener("keyup", (e) => {
      if (this.keys.hasOwnProperty(e.key)) {
        this.keys[e.key] = false;
      }
    });
  }

  process(delta, viewport) {
    // Gladko premikanje glede na pritisnjene tipke in čas (delta)
    if (this.keys.ArrowLeft) {
      this.position.x -= this.speed * delta;
    }
    if (this.keys.ArrowRight) {
      this.position.x += this.speed * delta;
    }

    // Omejitev zaslona (clamping) - da paddle ne uide ven
    if (viewport) {
      const halfWidth = this.width / 2;

      if (this.position.x < halfWidth) {
        this.position.x = halfWidth;
      }
      if (this.position.x > viewport.w - halfWidth) {
        this.position.x = viewport.w - halfWidth;
      }
    }
  }
}

class Brick extends Entity2D {
  constructor(position = new Vector2(), rotation = 0, health = 1, width = 10, height = 10) {
    position.x -= width / 2;
    position.y -= height / 2;
    super(position, rotation);

    this.width = width;
    this.height = height;
    this.collider = new BoxCollider(this.width, this.height);
    this.healthComponent = new HealthComponent(health, () => this.queueFree());
    this.renderer = new CanvasItem(this, (ctx) => {
      ctx.beginPath();
      ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
      ctx.fill();
      ctx.closePath();
    });
  }

  process() {
    this.renderer.color = "rgb(0,"+this.healthComponent.health * 50 + ", 0)";
  }
}