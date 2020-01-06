//TODO CHANGE ALT IN IMAGES
//colors
let CLICKED_COLOR = [0,0,128,200];
let ORIGINAL_COLOR = [153,204,255,200];
let HOVERED_COLOR = [0,0,128,200];
//state variables
let PAUSED = false;
let TRIP = false;
let frames = 0;
//organization for predefined content
let numSpecialBalls = 7; //update this every time you add more content
//physics
let numBalls = 14;
let spring = 0.05;
let gravity = 0.03;
let friction = -0.7;
let balls = [];
//clickable bubbles
let img_logo;
let blog;
let about;
let resources;
let img_me;
let img_hat; //
let hat_mouth; //
let hat_eyes; //
let img_kernighan;
//playable character
let you;
let sticky1;
let waves;

//=================================================================

function setup() 
{
    createCanvas(window.innerWidth, window.innerHeight);

    //Create Balls (custom and random)

    //hiss image
    balls[0] = new Ball(random(width), random(height), 245, 0, balls);
    //blog
    balls[1] = new Ball(random(width), random(height), 280, 1, balls);
    //about
    balls[2] = new Ball(random(width), random(height), 270, 2, balls);
    //resources
    balls[3] = new Ball(random(width), random(height), 200, 3, balls);
    //me image
    balls[4] = new Ball(random(width), random(height), 130, 4, balls);
    //hat image
    balls[5] = new Ball(random(width), random(height), 120, 5, balls);
    //brian kernighan img
    balls[6] = new Ball(random(width), random(height), 110, 6, balls);
    //playable character
    you = new Ball(190, 40, 60, -1, balls);

    //create (numBalls - numSpecialBalls) random empty bubbles
    for (let i = numSpecialBalls; i < numBalls; i++)
        balls[i] = new Ball(random(width), random(height), random(30, 200), i, balls);

    //Create content within balls

    img_logo = createImg("assets/icons/hiss.png", "HISS logo");
    img_logo.style("width", "15em");

    blog = createA("https://josh8.com/blog", "Blog");
    blog.style("text-decoration", "none");
    blog.style("color", "black");
    blog.style("font-size", "5em");
    blog.style("font-family", "Georgia");
    blog.mouseOver(hovered);
    blog.mouseOut(unhovered);

    about = createA("https://josh8.com/whom", "About");
    about.style("text-decoration", "none");
    about.style("color", "black");
    about.style("font-size", "5em");
    about.style("font-family", "Georgia");
    about.mouseOver(hovered);
    about.mouseOut(unhovered);

    resources = createA("https://josh8.com/home", "Resources");
    resources.style("text-decoration", "none");
    resources.style("color", "black");
    resources.style("font-size", "2.5em");
    resources.style("font-family", "Georgia");
    resources.mouseOver(hovered);
    resources.mouseOut(unhovered);

    img_me = createImg("assets/icons/mes.png", "Me");
    img_me.style("width", "8em");
    img_me.mouseOver(hovered);
    img_me.mouseOut(unhovered);

    //====
    img_hat = createImg("assets/icons/hat.png", "Club Penguin Tour Guide Hat");
    img_hat.style("width", "8em");
    img_hat.mouseOver(hovered);
    img_hat.mouseOut(unhovered);

    hat_mouth = createElement("h1", "__");
    hat_mouth.style("width", "4em");
    hat_mouth.mouseOver(hovered);
    hat_mouth.mouseOut(unhovered);

    hat_eyes = createElement("h1", "-  -");
    hat_eyes.style("width", "4em");
    hat_eyes.mouseOver(hovered);
    hat_eyes.mouseOut(unhovered);
    //====

    img_kernighan = createImg("assets/icons/kernighan.png", "Brian Kernighan");
    img_kernighan.style("width", "7em");

    sticky1 = createImg("assets/icons/sticky1.png", "Stick Figure");
    sticky1.style("width", "4em");
    waves = createImg("assets/gifs/splash.gif", "waves");
    waves.style("width", "4em");
    waves.style("opacity", "60%");
}

function draw() 
{
    //change gravity every so often to keep bubbles moving
    frames++;
    if(frames % 1000 == 0)
        gravity *= -1;

    //Position content within bubbles

    img_logo.position(
        balls[0].x - balls[0].diameter/2, 
        balls[0].y - balls[0].diameter/2);

    blog.position(
        balls[1].x - balls[1].diameter/3.5, 
        balls[1].y - balls[1].diameter/5);

    about.position(
        balls[2].x - balls[2].diameter/2.5, 
        balls[2].y - balls[2].diameter/4.5);

    resources.position(
        balls[3].x - balls[3].diameter/2.2, 
        balls[3].y - balls[3].diameter/8);

    img_me.position(
        balls[4].x - balls[4].diameter/2,
        balls[4].y - balls[4].diameter/2);

    //====
    img_hat.position(
        balls[5].x - balls[5].diameter/2,
        balls[5].y - balls[5].diameter/1.5);

    hat_mouth.position(
        balls[5].x - 10,
        balls[5].y - 10);

    hat_eyes.position(
        balls[5].x - 10,
        balls[5].y - 30);
    //====

    img_kernighan.position(
        balls[6].x - balls[6].diameter/2,
        balls[6].y - balls[6].diameter/2);

    sticky1.position(you.x - 30, you.y - 30);
    waves.position(you.x - 30, you.y - 5);

    let speed = 8;
    //move playable character
    if(keyIsDown(87)) //w
        you.y -= speed;
    else if(keyIsDown(65)) //a
        you.x -= speed;
    else if(keyIsDown(83)) //s
        you.y += speed;
    else if(keyIsDown(68)) //d
        you.x += speed;

    // Actually move the bubbles and calls physics functions
    
    you.collide();

    balls.forEach(ball => 
    {
        ball.collide();
        if(!ball.stopped && !ball.clicked && !ball.paused)
            ball.move();
        ball.display();
    });
}

//=================================================================

class Ball 
{
    constructor(xin, yin, din, idin, oin) 
    {
        this.x = xin;
        this.y = yin;
        this.vx = 0;
        this.vy = 0;
        this.diameter = din;
        this.id = idin;
        this.others = oin;
        this.default_color = ORIGINAL_COLOR;
        this.stopped = false; //activated by mouseOver
        this.clicked = false; //activated by mousePressed
        this.paused = false; //activated by space bar
    }

    collide() 
    {
        for (let i = this.id + 1; i < numBalls; i++) 
        {
            let dx = this.others[i].x - this.x;
            let dy = this.others[i].y - this.y;
            let distance = sqrt(dx * dx + dy * dy);
            let minDist = this.others[i].diameter / 2 + this.diameter / 2;

            if (distance < minDist) {
                let angle = atan2(dy, dx);
                let targetX = this.x + cos(angle) * minDist;
                let targetY = this.y + sin(angle) * minDist;
                let ax = (targetX - this.others[i].x) * spring;
                let ay = (targetY - this.others[i].y) * spring;
                this.vx -= ax;
                this.vy -= ay;
                this.others[i].vx += ax;
                this.others[i].vy += ay;
            }
        }
    }

    move() 
    {
        this.vy += gravity;
        this.x += this.vx;
        this.y += this.vy;

        if (this.x + this.diameter / 2 > width)  {
            this.x = width - this.diameter / 2;
            this.vx *= friction;
        } 
        else if (this.x - this.diameter / 2 < 0) {
            this.x = this.diameter / 2;
            this.vx *= friction;
        }

        if (this.y + this.diameter / 2 > height) {
            this.y = height - this.diameter / 2;
            this.vy *= friction;
        } 
        else if (this.y - this.diameter / 2 < 0)  {
            this.y = this.diameter / 2;
            this.vy *= friction;
        }
    }

    display()
    {
        //don't draw circles under images (ball 0, ball 4, ball 6)
        if(this.id != 0 && this.id != 4 && this.id != 6)
        {
            fill(this.default_color);
            stroke(0);
            ellipse(this.x, this.y, this.diameter, this.diameter);
        }

        // surfboard
        fill(204, 101, 192, 127);
        ellipse(you.x - 10, you.y + 30, 100, 10);
    }
}

//=================================================================

function hovered() 
{
    HOVERED_COLOR = random_color();
    let mx = mouseX;
    let my = mouseY;
    let d, r;

    for(var i = 0; i < balls.length; ++i) 
    {
            d = dist(mouseX, mouseY, balls[i].x, balls[i].y);
            r = balls[i].diameter / 2;
            
            //make text bubbles more clickable
            if(i == 1 || i == 2 || i == 3)
                r += 10;

            if(d < r) {
                balls[i].stopped = true;
                balls[i].default_color = HOVERED_COLOR;
            }
    }
}

function unhovered() 
{
    for(var i = 0; i < numSpecialBalls; ++i)
    {
        balls[i].stopped = false;

        if(!balls[i].clicked)
            balls[i].default_color = ORIGINAL_COLOR;
    }
}

function mousePressed() 
{
    let d, r;

    for(var i = 0; i < balls.length; ++i) 
    {
        d = dist(mouseX, mouseY, balls[i].x, balls[i].y);
        r = balls[i].diameter/2;

        /*
         * if the distance between a ball's (x,y) and mouse position is
         * less than its radius, the mouse is within the ball
         * (i.e, a ball was clicked)
         */
        if(d < r)
        {
            if(!balls[i].clicked) {
                balls[i].clicked = true;
                balls[i].default_color = CLICKED_COLOR;
            }
            else {
                balls[i].clicked = false;
                balls[i].default_color = ORIGINAL_COLOR;
            }

            //if one of these balls was clicked, open respective URL
            if(i == 1)
                window.open("https://josh8.com/blog", "_self");
            else if(i == 2)
                window.open("https://josh8.com/whom", "_self");
            else if(i == 3)
                window.open("https://josh8.com/home", "_self");
            else if(i == 4)
                window.open("https://josh8.com", "_self");
            else if(i == 5)
                window.open("https://josh8.com/hat", "_self");
        }
    }
    return false; //disable default click behavior
}

function keyPressed() 
{
    //pause or unpause all bubbles
    let spaceBar = 32;
    if(keyCode == spaceBar) {
        PAUSED = !PAUSED; //if paused then unpause, & vice versa
        for(var i = 0; i < balls.length; ++i) 
        {
            balls[i].paused = PAUSED;
            balls[i].stopped = false;
            balls[i].clicked = false;
            balls[i].default_color = ORIGINAL_COLOR;
        }
    }

    //slow down bubbles
    else if(keyCode == DOWN_ARROW)
       friction += 0.1;

    //speed up bubbles   
    else if(keyCode == UP_ARROW)
       friction -= 0.1;
    
    //flip gravity
    else if(keyCode == RETURN)
        gravity *= -1;

    //increase/decrease gravity
    else if(keyCode == LEFT_ARROW)
        gravity -= 1;

    else if(keyCode == RIGHT_ARROW)
        gravity += 1;

    else if (keyCode == ESCAPE)
    {
        //remove all elements then restart
        let all = selectAll('a');
        all.forEach(thing => { thing.remove(); });
        all = selectAll('img');
        all.forEach(thing => { thing.remove(); });
        all = selectAll('h1');
        all.forEach(thing => { thing.remove(); });

        reset();        
        setup();
    }

    //comma
    else if(keyCode == 188)
        TRIP=true;
    //period
    else if(keyCode == 190)
        TRIP=false;
}

//=================================================================

function random_color() 
{
    let r = Math.random() * 255;
    let g = Math.random() * 255;
    let b = Math.random() * 255;

    return [r, g, b, 230];
}

function reset()
{
    PAUSED = false;
    TRIP = false;
    frames = 0;

    //physics
    numBalls = 13;
    spring = 0.05;
    gravity = 0.03;
    friction = -0.7;
    balls = [];
} 

window.setInterval(function(){ if(!TRIP) clear(); }, 1);