var paddleImg = new Image();
paddleImg.src = "images/paddle/paddle.png";
var ballImg = new Image();
ballImg.src = "images/ball/ball.png";

var x = 250;
var y = 200;
var dx = 4;
var dy = -6;
var WIDTH;
var HEIGHT;
var r = 13;
var ctx;
var intervalId;
var timerIntervalId;
var offset= 3;

// Ploščica
var paddlex;
var paddleh = 20;
var paddlew = 150;
var rightDown = false;
var leftDown = false;

// Opeke in nivoji
var bricks;
var curlvl = 0; 
var NROWS;
var NCOLS;
var BRICKWIDTH;
var BRICKHEIGHT = 20;
var PADDING = 2;
var life = 3;

var brickColors = {
    4: "#1A1A1A", 
    3: "#404040", 
    2: "#808080",
    1: "#BFBFBF"
};


// Točke in čas
var tocke = 0;
var sekunde = 0;
var start = true;

// --- INICIALIZACIJA ---
function init_paddle() {
    paddlex = (WIDTH / 2) - (paddlew / 2);
}

function nalozinivo() {
    posodobiZivljenjaUI();
    $("#levelShow").text(curlvl + 1);
    if (curlvl >= levels.length) {
        clearInterval(intervalId);
        clearInterval(timerIntervalId);
        alert("ZMAGAL SI VSE NIVOJE!");
        return false;
    }

    // PONASTAVITEV ŽIVLJENJ OB NOVEM NIVOJU
    life = 3;
    $("#zivljenja").html(life);

    const layout = levels[curlvl];
    NROWS = layout.length;
    NCOLS = layout[0].length;

    BRICKWIDTH = (WIDTH / NCOLS) - PADDING;
    bricks = new Array(NROWS);

    for (let i = 0; i < NROWS; i++) {
        bricks[i] = new Array(NCOLS);
        for (let j = 0; j < NCOLS; j++) {
            bricks[i][j] = layout[i][j];
        }
    }

    respawnBall(); // Postavi žogico na začetno točko
    return true;
}

function respawnBall() {
    x = paddlex + (paddlew / 2);
    y = HEIGHT - paddleh - r - 10; // Malce višje nad ploščico
    dx = 3;
    dy = -6;
}

function init() {
    ctx = $('#canvas')[0].getContext("2d");
    WIDTH = $("#canvas").width();
    HEIGHT = $("#canvas").height();

    posodobiZivljenjaUI();

    init_paddle();

    // Poskusimo naložiti prvi nivo
    if (nalozinivo()) {
        tocke = 0;
        sekunde = 0;
        start = true;
        

        $("#tocke").html(tocke);
        $("#cas").html("00:00");

        // Zagon zank
        intervalId = setInterval(draw, 10);
        timerIntervalId = setInterval(posodobiCas, 1000);
    }
}

// --- RISANJE OBLIK ---
function circle(x, y, r) {
    if (ballImg.complete) {
        // Sliko narišemo tako, da je sredina slike na koordinatah x, y
        //drawImage(image, x, y, width, height)
        ctx.drawImage(ballImg, x - r, y - r, r * 2, r * 2);
    } else {
        // Rezervni načrt, če se slika še nalaga
        ctx.fillStyle = ballcolor;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }
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
        if ((paddlex + paddlew) < WIDTH) paddlex += 8;
        else paddlex = WIDTH - paddlew;
    } else if (leftDown) {
        if (paddlex > 0) paddlex -= 8;
        else paddlex = 0;
    }

    // 2. Risanje opek
    let opekeObstajajo = false; // Za preverjanje zmage
    for (let i = 0; i < NROWS; i++) {
        for (let j = 0; j < NCOLS; j++) {
            let zivljenja = bricks[i][j];
            if (zivljenja > 0) {
                opekeObstajajo = true;
                // Izbere barvo glede na število (1, 2, 3 ali 4)
                ctx.fillStyle = brickColors[zivljenja];
                rect(
                    (j * (BRICKWIDTH + PADDING)) + PADDING,
                    (i * (BRICKHEIGHT + PADDING)) + PADDING,
                    BRICKWIDTH,
                    BRICKHEIGHT
                );
            }
        }
    }

    // Če ni več opek z vrednostjo > 0, gremo na naslednji nivo
    if (!opekeObstajajo) {
        // 1. PAVZA IGRE: Ustavimo osveževanje platna in časa
        clearInterval(intervalId);
        clearInterval(timerIntervalId);
        
        curlvl++; // Povečamo števec za naslednji nivo
        
        // 2. Kličemo SweetAlert
        zmagaLevel(curlvl);
        return; // Prekinemo trenutno izvajanje funkcije draw()
    }

    // 3. Risanje ploščice
    if (paddleImg.complete) {
        ctx.drawImage(paddleImg, paddlex, HEIGHT - paddleh, paddlew, paddleh);
    } else {
        // Rezervni načrt: če se slika še nalaga, nariši navaden pravokotnik
        ctx.fillStyle = paddlecolor;
        rect(paddlex, HEIGHT - paddleh, paddlew, paddleh);
    }

    // 4. Risanje kroglice
    circle(x, y, r);

// 5. Zaznavanje trkov z opekami (Upoštevamo rob žogice)
    let rowheight = BRICKHEIGHT + PADDING;
    let colwidth = BRICKWIDTH + PADDING;
    
    // Preverjamo točko na robu žogice, ne v sredini
    let testY = (dy < 0) ? (y - r) : (y + r);
    let row = Math.floor(testY / rowheight);
    let col = Math.floor(x / colwidth);

    if (row < NROWS && row >= 0 && col >= 0 && col < NCOLS && bricks[row][col] > 0) {
        dy = -dy;
        bricks[row][col]--;
        tocke += 1;
        $("#tocke").html(tocke);
        
        // Takojšen popravek pozicije, da ne obtiči v naslednjem koraku
        y += dy; 
    }

// 6. Zaznavanje trkov z zidovi in ploščico
    if (x + dx > WIDTH - r || x + dx < r) dx = -dx;

    if (y + dy < r) {
        dy = -dy; // Odboj od vrha
    } 
    else if (y + dy > HEIGHT - paddleh - r + offset) { 
        // 1. Preverimo, če je žogica vodoravno poravnana s ploščico
        if (x > paddlex && x < paddlex + paddlew) {
            // Odboj od ploščice
            dx = 15 * ((x - (paddlex + paddlew / 2)) / paddlew);
            dy = -dy;
            
            // Popravek pozicije, da ne gre v opeke
            y = HEIGHT - paddleh - r + offset; 
            start = true;
        } 
        // 2. Če ni nad ploščico, preverimo, če je padla čez spodnji rob
        else if (y + dy > HEIGHT - r) {
            life--;
            posodobiZivljenjaUI();

            if (life > 0) {
                respawnBall();
            } else {
                clearInterval(intervalId);
                clearInterval(timerIntervalId);
                konecIgre();
            }
        }
    }
    // 7. Premik kroglice
    x += dx;
    y += dy;
}

function posodobiZivljenjaUI() {
    var container = $("#lives-icons");
    container.empty(); // Izprazni stare slike

    for (var i = 0; i < life; i++) {
        // Ustvarimo novo sliko za vsako življenje
        var img = $('<img>', {
            src: 'images/paddle/paddle.png',
            class: 'life-icon'
        });
        container.append(img);
    }
}

// Zagon igre, ko je stran naložena
$(document).ready(function () {
    init();
});