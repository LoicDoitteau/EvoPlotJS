const XMIN = -10;
const XMAX = 10;
const YMIN = -10;
const YMAX = 100;

const WINDOW_WIDTH = 768;
const WINDOW_HEIGHT = 727;

let SCREEN_X0;
let SCREEN_Y0;

let POINTS;

let COEFS = [0, 1, 0, -9];

function setup()
{
    createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
    let ps = wordlToScreen(0, 0);
    SCREEN_X0 = ps.x;
    SCREEN_Y0 = ps.y;
    POINTS = [];
    for(let x = XMIN; x <= XMAX; x++)
    {
        let y = COEFS[0] * x * x * x +
                COEFS[1] * x * x +
                COEFS[2] * x +
                COEFS[3];
        POINTS.push({x, y});
    }
}

function draw()
{
    background(240);
    stroke(0, 0, 255, 30);
    strokeWeight(1);
    for(let x = XMIN; x <= XMAX; x++)
    {
        let ps = wordlToScreen(x, 0);
        line(ps.x, 0, ps.x, WINDOW_HEIGHT);
    }
    for(let y = YMIN; y <= YMAX; y++)
    {
        let ps = wordlToScreen(0, y);
        line(0, ps.y, WINDOW_WIDTH, ps.y);
    }
    stroke(0, 0, 255);
    line(SCREEN_X0, 0, SCREEN_X0, WINDOW_HEIGHT);
    line(0, SCREEN_Y0, WINDOW_WIDTH, SCREEN_Y0);
    stroke(255, 0, 0);
    noFill();
    beginShape();
    for(let i = 0; i < WINDOW_WIDTH; i++)
    {
        let pw = screenToWorld(i, 0);
        pw.y =  COEFS[0] * pw.x * pw.x * pw.x +
                COEFS[1] * pw.x * pw.x +
                COEFS[2] * pw.x +
                COEFS[3];
        let ps = wordlToScreen(pw.x, pw.y);
        vertex(ps.x, ps.y);
    }
    endShape();
    strokeWeight(4);
    stroke(0);
    fill(255);
    for(let i = 0; i < POINTS.length; i++)
    {
        let pw = POINTS[i];
        let ps = wordlToScreen(pw.x, pw.y);
        point(ps.x, ps.y);
    }
}

function wordlToScreen(x, y)
{
    x = (x - XMIN) * WINDOW_WIDTH / (XMAX - XMIN)
    y = WINDOW_HEIGHT - (y - YMIN) * WINDOW_HEIGHT / (YMAX - YMIN)
    return {x, y};
}

function screenToWorld(x, y)
{
    x = XMIN + x / WINDOW_WIDTH * (XMAX - XMIN);
    y = -(YMIN + (y - WINDOW_HEIGHT) / WINDOW_HEIGHT * (YMAX - YMIN));
    return {x, y};
}
