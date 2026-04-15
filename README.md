<h1 align="center">🧱 Bricks Board – Projektna naloga</h1>

<p align="center">
  <strong>Avtor:</strong> Dominik Kaluža <br>
  <strong>Projekt:</strong> Lasten 2D JavaScript igralni pogon – Bricks Board <br>
  <strong>Uporabljeni jeziki:</strong> HTML (platno), CSS (stil), JavaScript (pogon in logika)
</p>

<hr>

<h2>🎯 Namen in smisel projekta</h2>

<p>
  Projekt prikazuje izdelavo retro arkadne igre "Brick Breaker" popolnoma od začetka, brez uporabe zunanjih knjižnic (kot sta Phaser ali PixiJS). 
  Glavni cilj je bil razviti lasten <strong>objektno usmerjen igralni pogon</strong>, ki temelji na vozliščih (nodes) in delta-času.
</p>

<ul>
  <li><strong>Arhitektura vozlišč</strong> – Vsak element (žoga, veslo, zidaki) je "Node", kar omogoča enostavno razširljivost.</li>
  <li><strong>Fizika in trki</strong> – Implementacija lastne AABB (Axis-Aligned Bounding Box) detekcije trkov in odbojev.</li>
  <li><strong>Sistem stopenj</strong> – Dinamično nalaganje stopenj preko dvorazsežnih polj.</li>
</ul>

<p>
  Projekt služi kot napreden primer uporabe JavaScripta za interaktivne aplikacije in razumevanje:
</p>

<ul>
  <li>matematike vektorjev (Vector2 math),</li>
  <li>optimizirane zanke igre (Game Loop),</li>
  <li>upravljanja s pomnilnikom (QueueFree sistem),</li>
  <li>odzivnega krmiljenja in fizikalnih odbojev.</li>
</ul>

<hr>

<h2>📁 Struktura datotek</h2>

<p>
  Projekt je modularno razdeljen, kar omogoča čisto kodo in lažje vzdrževanje:
</p>

<pre>
BricksGame/
├── index.html              # Glavna vstopna točka s Canvas elementom
├── css/
│   └── style.css           # Oblikovanje ozadja in igralnega okna
├── js/
│   ├── objects.js          # Jedro pogona: Vector2, Node, Sprite2D, Engine
│   ├── helpers.js          # Fizikalna logika in razreševanje trkov
│   ├── levels.js           # Podatki o razporeditvi zidakov v stopnjah
│   └── gameLogic.js        # Logika igre, GameManager in nadzor nivojev
└── images/                 # Slikovni materiali (assets)
    ├── ball/               # Teksture za žogico
    ├── paddle/             # Teksture za igralčevo veslo
    └── brick/              # Teksture za zidake glede na njihovo zdravje
</pre>

<hr>

<h2>🎮 Navodila za igranje</h2>

<p>
  Cilj igre je uničiti vse zidake na zaslonu, ne da bi žogica padla pod veslo.
</p>

<ul>
  <li><strong>Premikanje:</strong> Uporabi smeri tipke <strong>Levo</strong> in <strong>Desno</strong> na tipkovnici.</li>
  <li><strong>Napredovanje:</strong> Ko uničiš vse zidake, se samodejno naloži naslednja stopnja.</li>
  <li><strong>Izziv:</strong> Žogica sčasoma rahlo pospešuje, kar oteži igranje.</li>
</ul>

<hr>

<h2>🚀 Tehnične lastnosti</h2>

<p align="center">
  <strong>Dinamični odboji</strong><br>
  Smer odboja žogice je odvisna od mesta dotika na veslu. Če žogica zadene rob vesla, se odbije pod večjim kotom, kar omogoča igralcu strateško merjenje.
</p>

<p align="center">
  <strong>Sistem zdravja zidakov</strong><br>
  Zidaki imajo lahko različno število življenj. Vsakič, ko so zadeti, se njihova tekstura dinamično posodobi, da odraža poškodbe.
</p>

<hr>

<h2>🔗 Demo projekta</h2>
<p align="center">
  <a href="https://dominikkaluza06.github.io/BricksGame/"><strong>➡️ Igraj Bricks Board v živo</strong></a>
</p>

<hr>

<h2>💡 Zaključek</h2>
<p>
  Bricks Board ni le igra, temveč ogrodje za razvoj 2D iger. Preko projekta sem utrdil znanje JavaScripta, uporabo HTML5 Canvas API-ja in konceptov, ki se uporabljajo v profesionalnih okoljih za razvoj iger.
</p>

<hr>

<h2>📝 Licenca</h2>
<p>
  Ta projekt je licenciran pod <strong>MIT License</strong>. Za podrobnosti si oglejte <a href="https://opensource.org/licenses/MIT" target="_blank">MIT licenco</a>.
</p>