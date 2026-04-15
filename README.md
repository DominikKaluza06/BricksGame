<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bricks Board</title>
    <style>
        /* CSS STYLES */
        body {
            margin: 0;
            padding: 0;
            background-image: url("images/background.jpeg");
            background-repeat: no-repeat;
            background-size: cover;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            height: 100vh;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        canvas {
            background-image: url("images/canvasbg.jpg");
            background-repeat: no-repeat;
            background-size: cover;
            display: block;
        }

        .border {
            border: 3px solid black;
        }

        .header-container {
            margin-bottom: 40px;
            text-align: center;
        }

        .white, .black {
            display: inline-block;
            font-size: 3rem;
            padding: 0 5px;
            font-family: sans-serif;
        }

        .white { color: white; }
        .black { color: black; }
    </style>
</head>
<body>

    <div class="header-container">
        <h1 class="white">BRICKS</h1>
        <h1 class="black">BOARD</h1>
    </div>

    <div class="border">
        <canvas id="canvas" width="800" height="800"></canvas>
    </div>

    <script>
        // --- HELPER CLASSES & ENGINE ---
        class Vector2 {
            constructor(x = 0, y = 0) { this.x = x; this.y = y; }
            normalize() {
                let length = Math.sqrt(this.x * this.x + this.y * this.y);
                if (length > 0) { this.x /= length; this.y /= length; }
                return this;
            }
            multiply(m) { this.x *= m; this.y *= m; return this; }
            addVector(v) { this.x += v.x; this.y += v.y; return this; }
            clone() { return new Vector2(this.x, this.y); }
        }

        class Engine {
            constructor(canvasId) {
                this.canvas = document.getElementById(canvasId);
                this.ctx = this.canvas.getContext("2d");
                this.nodes = [];
                this.lastTime = performance.now();
                requestAnimationFrame((t) => this._loop(t));
            }
            _loop(timestamp) {
                const delta = Math.min((timestamp - this.lastTime) / 1000, 0.1);
                this.lastTime = timestamp;
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.nodes = this.nodes.filter(n => !n.isQueueFreed);
                this.nodes.forEach(n => {
                    if (n instanceof Ball) n.process(delta, this.nodes.filter(o => o !== n && o.collider));
                    else if (n.process) n.process(delta, {w: this.canvas.width, h: this.canvas.height});
                    if (n.renderer) n.renderer.draw(this.ctx);
                });
                requestAnimationFrame((t) => this._loop(t));
            }
            add(node) { this.nodes.push(node); }
        }

        // --- GAME OBJECTS ---
        class Sprite2D {
            constructor(owner, path, w, h) {
                this.owner = owner; this.width = w; this.height = h;
                this.texture = new Image(); this.texture.src = path;
            }
            draw(ctx) {
                if (!this.texture.complete) return;
                ctx.save();
                ctx.translate(this.owner.position.x, this.owner.position.y);
                ctx.rotate(this.owner.rotation * Math.PI / 180);
                ctx.drawImage(this.texture, -this.width / 2, -this.height / 2, this.width, this.height);
                ctx.restore();
            }
        }

        class Node {
            constructor() { this.isQueueFreed = false; }
            queueFree() { this.isQueueFreed = true; }
        }

        class Node2D extends Node {
            constructor(pos = new Vector2(), rot = 0) {
                super(); this.position = pos; this.rotation = rot;
            }
        }

        class Ball extends Node2D {
            constructor(pos, dir, speed, dia, paddle) {
                super(pos);
                this.direction = dir.normalize();
                this.speed = speed;
                this.velocity = new Vector2();
                this.diameter = dia;
                this.paddleRef = paddle;
                this.renderer = new Sprite2D(this, "images/ball/ball.png", dia, dia);
            }
            process(delta, colliders) {
                if (this.position.y > 800) { // Simple reset
                    this.position = new Vector2(this.paddleRef.position.x, this.paddleRef.position.y - 30);
                    this.direction = new Vector2(0.1, -1).normalize();
                }
                this.velocity = this.direction.clone().multiply(this.speed * delta);
                this.position.addVector(this.velocity);
                colliders.forEach(c => resolveBoxCollision(this, c));
            }
        }

        class Paddle extends Node2D {
            constructor(pos, w, h) {
                super(pos);
                this.width = w; this.height = h;
                this.speed = 800;
                this.collider = {width: w, height: h};
                this.renderer = new Sprite2D(this, "images/paddle/paddle.png", w, h);
                this.keys = {ArrowLeft: false, ArrowRight: false};
                window.addEventListener("keydown", e => { if(e.key in this.keys) this.keys[e.key] = true; });
                window.addEventListener("keyup", e => { if(e.key in this.keys) this.keys[e.key] = false; });
            }
            process(delta, vp) {
                if (this.keys.ArrowLeft) this.position.x -= this.speed * delta;
                if (this.keys.ArrowRight) this.position.x += this.speed * delta;
                this.position.x = Math.max(this.width/2, Math.min(vp.w - this.width/2, this.position.x));
            }
        }

        class Brick extends Node2D {
            constructor(pos, health, w, h) {
                super(pos);
                this.collider = {width: w, height: h};
                this.health = health;
                this.renderer = new Sprite2D(this, `images/brick/hp${health}.png`, w, h);
            }
            takeDamage() {
                this.health--;
                if (this.health <= 0) this.queueFree();
                else this.renderer.texture.src = `images/brick/hp${this.health}.png`;
            }
        }

        // --- COLLISION MATH ---
        function resolveBoxCollision(mover, target) {
            const halfW = target.collider.width / 2;
            const halfH = target.collider.height / 2;
            const dx = mover.position.x - target.position.x;
            const dy = mover.position.y - target.position.y;
            const radius = mover.diameter / 2;

            const closestX = Math.max(-halfW, Math.min(dx, halfW));
            const closestY = Math.max(-halfH, Math.min(dy, halfH));
            const distSq = (dx - closestX)**2 + (dy - closestY)**2;

            if (distSq <= radius * radius) {
                if (dy < -halfH || dy > halfH) mover.direction.y *= -1;
                else mover.direction.x *= -1;
                if (target instanceof Brick) target.takeDamage();
            }
        }

        // --- START GAME ---
        const engine = new Engine("canvas");
        const paddle = new Paddle(new Vector2(400, 750), 150, 20);
        const ball = new Ball(new Vector2(400, 700), new Vector2(0.5, -1), 500, 20, paddle);
        
        engine.add(paddle);
        engine.add(ball);
        // Add a few bricks for testing
        for(let i=0; i<8; i++) {
            engine.add(new Brick(new Vector2(100 * i + 50, 100), 1, 80, 20));
        }

    </script>
</body>
</html>