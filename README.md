<body>
  <section id="readme" style="max-width: 800px; margin: 0 auto; font-family: sans-serif; line-height: 1.6; color: #333; padding: 20px;">
    
    <header style="border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px;">
      <h1 style="margin: 0;">Bricks Board</h1>
      <p style="font-style: italic; color: #666;">A Custom-Built 2D Brick Breaker Engine</p>
    </header>

    <p>
      <strong>Bricks Board</strong> is a retro arcade-style game built from the ground up using a custom-coded JavaScript game engine. Unlike standard tutorials, this project implements a <strong>Node-based architecture</strong> and a manual <strong>AABB collision resolver</strong>.
    </p>

    <h2 style="color: #222;">🎮 How to Play</h2>
    <ul style="list-style-type: square;">
      <li><strong>Movement:</strong> Use the <strong>Left and Right Arrow keys</strong> to control the paddle.</li>
      <li><strong>Objective:</strong> Clear all the bricks on the screen to progress to the next level.</li>
      <li><strong>Challenge:</strong> The ball increases in speed over time. If the ball falls past your paddle, it resets to the starting position.</li>
    </ul>

    <h2 style="color: #222;">🛠️ Technical Features</h2>
    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
      <tr style="background-color: #f4f4f4;">
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Feature</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Description</th>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;"><strong>Custom Engine</strong></td>
        <td style="border: 1px solid #ddd; padding: 8px;">Uses a custom <code>Engine</code> class that manages a <code>Node</code> tree and Delta-time for smooth performance.</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;"><strong>Physics</strong></td>
        <td style="border: 1px solid #ddd; padding: 8px;">Collision detection using <code>Vector2</code> math and <code>resolveBoxCollision</code> logic.</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;"><strong>Level System</strong></td>
        <td style="border: 1px solid #ddd; padding: 8px;">Dynamic level loading via multi-dimensional arrays (defined in <code>levels.js</code>).</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;"><strong>Asset Pipeline</strong></td>
        <td style="border: 1px solid #ddd; padding: 8px;">Modular <code>Sprite2D</code> class handles rendering for the paddle, ball, and health-based brick textures.</td>
      </tr>
    </table>

    <h2 style="color: #222;">📂 Project Structure</h2>
    <pre style="background: #f9f9f9; padding: 15px; border-left: 5px solid #333; overflow-x: auto;">
BricksGame/
├── css/         # Visual styling and layout
├── js/
│   ├── objects.js    # Core Engine, Vector, and Node classes
│   ├── helpers.js    # Physics and Collision math
│   ├── levels.js     # Level design data
│   └── gameLogic.js  # Main game loop and GameManager
└── index.html   # Main entry point
    </pre>

    <footer style="margin-top: 30px; font-size: 0.9em; color: #888; border-top: 1px solid #eee; padding-top: 10px;">
      <p>Created by Dominik Kaluza. Open source under the MIT License.</p>
    </footer>

  </section>
</body>