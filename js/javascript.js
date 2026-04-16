var x = 250;
var y = 200;
var dx = 2;
var dy = -4; // Žogica štarta navzgor
var WIDTH;
var HEIGHT;
var r = 10;
var ctx;
var intervalId;
var timerIntervalId;

// Ploščica
var paddlex;
var paddleh = 10;
var paddlew = 75;
var rightDown = false;
var leftDown = false;

// Opeke
var bricks;
var NROWS = 5;
var NCOLS = 5;
var BRICKWIDTH;
var BRICKHEIGHT = 20;
var PADDING = 2;

// Barve
var rowcolors = ["#FF1C0A", "#FFFD0A", "#00A308", "#0008DB", "#EB0093"];
var paddlecolor = "#34495e";
var ballcolor = "#e74c3c";

// Točke in čas
var tocke = 0;
var sekunde = 0;
var start = true;

// --- INICIALIZACIJA ---
function init_paddle() {
    paddlex = (WIDTH / 2) - (paddlew / 2);
}

function initbricks() {
    BRICKWIDTH = (WIDTH / NCOLS) - PADDING;
    bricks = new Array(NROWS);
    for (let i = 0; i < levels.length; i++) {
        for (let j = 0; j < levels[i].length; j++) {
            for (let k = 0; k < levels[i][j].length; k++) {
                const element = levels[i][j][k];
                
                }
            }
        }
    //popravi
    for (let i = 0; i < NROWS; i++) {
        bricks[i] = new Array(NCOLS);
        for (let j = 0; j < NCOLS; j++) {
            bricks[i][j] = 1; // 1 pomeni, da opeka obstaja
        }
    }
}

function init() {
    ctx = $('#canvas')[0].getContext("2d");
    WIDTH = $("#canvas").width();
    HEIGHT = $("#canvas").height();

    init_paddle();
    initbricks();

    tocke = 0;
    sekunde = 0;
    start = true;

    $("#tocke").html(tocke);
    $("#cas").html("00:00");

    // Zagon zank
    intervalId = setInterval(draw, 10);
    timerIntervalId = setInterval(posodobiCas, 1000);
}

// --- RISANJE OBLIK ---
function circle(x, y, r) {
    ctx.fillStyle = ballcolor;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

function rect(x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
}

function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

// --- UPRAVLJANJE ČASA ---
function posodobiCas() {
    if (start) {
        sekunde++;
        let s = sekunde % 60;
        let m = Math.floor(sekunde / 60);

        let sekundeI = (s > 9) ? s : "0" + s;
        let minuteI = (m > 9) ? m : "0" + m;

        $("#cas").html(minuteI + ":" + sekundeI);
    }
}

// --- VHODNI PODATKI (TIPKOVNICA) ---
$(document).keydown(function (evt) {
    if (evt.keyCode == 39) rightDown = true;
    else if (evt.keyCode == 37) leftDown = true;
});

$(document).keyup(function (evt) {
    if (evt.keyCode == 39) rightDown = false;
    else if (evt.keyCode == 37) leftDown = false;
});

// --- GLAVNA ZANKA IGRE ---
function draw() {
    clear();

    // 1. Premik ploščice levo in desno
    if (rightDown) {
        if ((paddlex + paddlew) < WIDTH) paddlex += 5;
        else paddlex = WIDTH - paddlew;
    } else if (leftDown) {
        if (paddlex > 0) paddlex -= 5;
        else paddlex = 0;
    }

    // 2. Risanje opek
    for (let i = 0; i < levels.length; i++) {
        for (let j = 0; j < levels[i].length; j++) {
            for (let k = 0; k < levels[i][j].length; k++) {
                const element = levels[i][j][k];
                
                ctx.fillStyle = rowcolors[i % rowcolors.length];
                if (bricks[i][j][k] == 1) {
                    rect((j * (BRICKWIDTH + PADDING)) + PADDING,
                    (i * (BRICKHEIGHT + PADDING)) + PADDING,
                    BRICKWIDTH, BRICKHEIGHT);
                }
            }
        }
    }

    // 3. Risanje ploščice
    ctx.fillStyle = paddlecolor;
    rect(paddlex, HEIGHT - paddleh, paddlew, paddleh);

    // 4. Risanje kroglice
    circle(x, y, r);

    // 5. Zaznavanje trkov z opekami
    let rowheight = BRICKHEIGHT + PADDING;
    let colwidth = BRICKWIDTH + PADDING;
    let row = Math.floor(y / rowheight);
    let col = Math.floor(x / colwidth);

    if (y < NROWS * rowheight && row >= 0 && col >= 0 && bricks[row][col] == 1) {
        dy = -dy;
        bricks[row][col] = 0;
        tocke += 1;
        $("#tocke").html(tocke);
    }

    // 6. Zaznavanje trkov z zidovi in ploščico
    if (x + dx > WIDTH - r || x + dx < r) dx = -dx;

    if (y + dy < r) {
        dy = -dy;
    } else if (y + dy > HEIGHT - r) {
        start = false; // Čas se ob trku na dno ustavi

        // Preverjanje, ali je kroglica zadela ploščico
        if (x > paddlex && x < paddlex + paddlew) {
            dx = 8 * ((x - (paddlex + paddlew / 2)) / paddlew); // Kot odboja glede na to, kje udari ploščico
            dy = -dy;
            start = true; // Čas teče naprej
        } else {
            // Konec igre
            clearInterval(intervalId);
            clearInterval(timerIntervalId);
            ctx.fillStyle = "black";
            ctx.font = "30px Arial";
            ctx.fillText("KONEC IGRE!", WIDTH / 2 - 100, HEIGHT / 2);
        }
    }

    // 7. Premik kroglice
    x += dx;
    y += dy;
}

// Zagon igre, ko je stran naložena
$(document).ready(function () {
    init();
});