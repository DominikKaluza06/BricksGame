var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var x = 150;
var y = 150;
var dx = 2;
var dy = 4;
var r = 5;
var rightDown = false;
var leftDown = false;
var WIDTH;
var HEIGHT;
var paddlex;
var paddleh = 10;
var paddlew = 75;

//$(document).keydown(onKeyDown);
//$(document).keyup(onKeyUp);

function initPaddle() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    WIDTH = $("#canvas").width();
    HEIGHT = $("#canvas").height();

    paddlex = WIDTH / 2;

    console.log(paddlex);
}

function draw() {

    ctx.clearRect(0, 0, 300, 300);
    ctx.beginPath();
    ctx.arc(x, y, r * 2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();

    if (rightDown) paddlex += 5;
    else if (leftDown) paddlex -= 5;
    ctx.beginPath();
    ctx.rect(paddlex, HEIGHT - paddleh, paddlew, paddleh);
    ctx.closePath();
    ctx.fill();
    //premikanje
    if (x + dx > WIDTH - r || x + dx < 0 + r)
        dx = -dx;
    if (y + dy > HEIGHT - r || y + dy < 0 + r)
        dy = -dy;

    x += dx;
    y += dy;

}

function onKeyDown(evt) {
    if (evt.keyCode == 39)
        rightDown = true;
    else if (evt.keyCode == 37) leftDown = true;
}

function onKeyUp(evt) {
    if (evt.keyCode == 39)
        rightDown = false;
    else if (evt.keyCode == 37) leftDown = false;
}

init();
function init() {
    initPaddle();
    return setInterval(draw, 10);
}
