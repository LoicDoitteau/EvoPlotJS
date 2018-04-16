const SPEED = 100;

const XMIN = -10;
const XMAX = 10;
const YMIN = -100;
const YMAX = 100;

const WINDOW_WIDTH = 768;
const WINDOW_HEIGHT = 727;

let SCREEN_X0;
let SCREEN_Y0;

let POINTS = [];

let MIN_COEF = -100;
let MAX_COEF = 100;
let COEF_COUNT = 4
let COEFS = [];

let MOVE_MUTATION_RATE = 1 / 10;
let REPLACE_MUTATION_RATE = 1 / 50;

function setup()
{
    createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
    let ps = wordlToScreen(0, 0);
    SCREEN_X0 = ps.x;
    SCREEN_Y0 = ps.y;
    for(let j = 0; j < COEF_COUNT; j++) {
        COEFS.push(random(MIN_COEF, MAX_COEF));
    }
    for(let x = XMIN; x <= XMAX; x++)
    {
        let y = 0.5 * x * x * x + x * x - 9;
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
        pw.y = 0;
        for(let j = 0; j < COEF_COUNT; j++) {
            pw.y += COEFS[j] * pow(pw.x, COEF_COUNT - j - 1);
        }
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
    for(let i = 0; i < COEF_COUNT; i++)
    {
        text(COEFS[i], 20, 20 * (i + 1));
    }
    for(let i = 0; i < SPEED; i++)
    {
        while(!mutate());
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

function getFitness()
{
    let fitness = 0;
    for(let i = 0; i < POINTS.length; i++)
    {
        let pw = POINTS[i];
        let y = 0;
        for(let j = 0; j < COEF_COUNT; j++) {
            y += COEFS[j] * pow(pw.x, COEF_COUNT - j - 1);
        }
        fitness += abs(POINTS[i].y - y);
    }
    return fitness;
}

function mutate()
{
    let old_coefs = COEFS.slice();
    let old_Fitness = getFitness();
    var flag = false;
    for(let i = 0; i < COEF_COUNT; i++)
    {
        if(random() < MOVE_MUTATION_RATE)
        {
            COEFS[i] += random(-1, 1);
            flag = true;

        }
        if(random() < REPLACE_MUTATION_RATE)
        {
            COEFS[i] = random(MIN_COEF, MAX_COEF);
            flag = true;
        }
    }
    if(old_Fitness < getFitness()) COEFS = old_coefs;
    return flag;
}