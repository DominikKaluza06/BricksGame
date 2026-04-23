<h1 align="center">🧱 Bricks Board – Projektna naloga</h1>

<p align="center">
  <strong>Avtor:</strong> Dominik Kaluža <br>
  <strong>Projekt:</strong> 2D JavaScript arkadna igra – Bricks Board <br>
  <strong>Uporabljeni jeziki:</strong> HTML5 (Canvas), CSS3, JavaScript (Logika in pogon)
</p>

<hr>

<h2>🎯 Namen in koncept projekta</h2>

<p>
  Projekt predstavlja izdelavo retro arkadne igre "Brick Breaker", zgrajene na <strong>lastnem JavaScript pogonu</strong>. Glavni fokus je na interakciji med kroglico in različnimi tipi zidakov, kar zahteva natančno detekcijo trkov in tekoče izrisovanje na HTML5 platno.
</p>

<ul>
  <li><strong>Dinamični sistem zidakov</strong> – Vsak nivo prinaša novo razporeditev zidakov z različno vzdržljivostjo.</li>
  <li><strong>Lasten fizikalni pogon</strong> – Implementacija odbojev in pospeševanja kroglice brez uporabe zunanjih igralnih knjižnic.</li>
  <li><strong>Sodobna UI integracija</strong> – Uporaba <strong>SweetAlert2</strong> za obvestila o zmagah/porazih in <strong>jQuery</strong> za hitro osveževanje točk in časa.</li>
  <li><strong>Vizualni prikaz življenj</strong> – Namesto številk igra uporablja grafične ikone loparjev za prikaz preostalih življenj.</li>
</ul>

<hr>

<h2>📁 Struktura datotek</h2>

<p>
  Projekt je organiziran modularno za lažje vzdrževanje in dodajanje novih nivojev:
</p>

<pre>
BricksGame/
├── index.html              # Glavno okno igre in Canvas element
├── css/
│   └── style.css           # Oblikovanje vmesnika in igralnega polja
├── js/
│   ├── javascript.js       # Glavna logika: fizika kroglice, trki in premikanje
│   ├── levels.js           # Matrike z razporeditvijo zidakov za vsako stopnjo
│   ├── functions.js        # Pomožne funkcije za UI, življenja in SweetAlert
│   └── jquery-4.0.0.min.js # Knjižnica za manipulacijo vmesnika
└── images/                 # Grafični elementi (assets)
    ├── ball/               # Grafika žogice
    ├── paddle/             # Grafika loparja
    └── background.jpeg     # Ozadje igralnega polja
</pre>

<hr>

<h2>🎮 Navodila za igranje</h2>

<p>
  Cilj je uničiti vse zidake na zaslonu in napredovati skozi nivoje, ne da bi izgubil vsa življenja.
</p>

<ul>
  <li><strong>Krmiljenje:</strong> Lopar premikaš s tipkama <strong>Levo</strong> in <strong>Desno</strong>.</li>
  <li><strong>Zidaki:</strong> Barva zidaka pove, koliko udarcev potrebuje, da se razbije (od 1 do 4).</li>
  <li><strong>Življenja:</strong> Začneš s 3 življenji. Vsak padec kroglice izven polja ti odvzame eno ikono loparja.</li>
  <li><strong>Napredovanje:</strong> Po uničenju vseh zidakov se igra začasno ustavi, prikaže se uspeh, nato pa se naloži nova stopnja.</li>
</ul>

<hr>

<h2>🚀 Tehnične lastnosti</h2>

<p align="center">
  <strong>Sistem vzdržljivosti zidakov</strong><br>
  Zidaki so ključni del igre. Vsak zidak v matriki ima svojo vrednost zdravja. Ob trku se vrednost zmanjša, koda pa samodejno posodobi barvo zidaka, dokler ta popolnoma ne izgine.
</p>

<p align="center">
  <strong>Fizika odboja na loparju</strong><br>
  Implementiran je napreden odboj: smer žogice se spremeni glede na to, kje zadene lopar. Udarec na robu loparja pošlje žogico pod ostrim kotom, kar omogoča igralcu ciljanje specifičnih zidakov.
</p>

<hr>

<h2>🔗 Demo projekta</h2>
<p align="center">
  <a href="https://dominikkaluza06.github.io/BricksGame/"><strong>➡️ Igraj Bricks Board v živo</strong></a>
</p>

<hr>

<h2>📝 Licenca</h2>
<p>
  Ta projekt je licenciran pod <strong>MIT License</strong>.
</p>
