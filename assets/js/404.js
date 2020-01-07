let X_POSITION = window.innerWidth/5.3;
let LINE_HEIGHT = 30;
let y;
let maxInputLength;

let COLOR = "#33FF00";
let STDOUT_COLOR = "#FFB000"
let BG_COLOR = "#282828";

let lines = [];

function setup() 
{
	let w = window.innerWidth;
	let h = window.innerHeight;

	let cnv;

	//MOBILE RESIZING
    if(displayWidth <= 800) {
    	cnv = createCanvas(displayWidth, displayHeight);
    	cnv.position(40,40);
    	cnv.style("overflow-y", "hidden");
    	maxInputLength = 27;
    }
    else {
    	cnv = createCanvas(w/1.46, h/1.36);
    	cnv.position(w/6.4,h/7.5);
    	maxInputLength = 87;
    }

	cnv.style("border-radius", "4px");
	cnv.style("border", "2px solid black");
	cnv.style("border-top", "3px solid black");
	cnv.style("border-left", "3px solid black");
	cnv.style("box-shadow", "10px 10px 5px #141414")
	background(BG_COLOR);

	y = floor(window.innerHeight / 6.3); //begin first line at this height
	createLine(y);
}

function createLine(y) 
{
	displayPrompt(y);

	let inp = createInput('');
   		inp.elt.focus();
		inp.position(X_POSITION, y);

	  	inp.style("width", "53em");
	  	inp.style("padding-top", "0.4%");
	  	inp.style("padding-bottom", "0.4%");
	  	inp.style("font-size", "1.3em");
	  	inp.style("outline", "none");
	  	inp.style("resize", "none");
	  	inp.style("color", COLOR);
	  	inp.style("background-color", "transparent");
	  	inp.style("border", "none");
	  	inp.style("font-family", "monospace");

	  	inp.attribute("autocomplete", "off");
	  	inp.attribute("autocorrect", "off");
		inp.attribute("autocapitalize", "off");
		inp.attribute("spellcheck", "off");
		inp.attribute("maxlength", maxInputLength);

  	lines.push(inp);
}

function displayPrompt(y) 
{
	let p = createP("$ ");
	p.style("color", COLOR);
	p.style("padding-top", "0.4%");
  	p.style("padding-bottom", "0.4%");
	p.style("font-size", "1.3em");
	p.style("font-family", "monospace");
	p.position(X_POSITION - 20, y - 16.5);
}

function draw()
{
	lines[lines.length - 1].elt.focus(); //move cursor into last input
}

function keyPressed() 
{
	if(keyCode == RETURN) {
    	let content = lines[lines.length - 1].value();
    	processInput(content);

    	if(content != "clear") {
    		lines[lines.length - 1].attribute('disabled', '');
    		incrementLine();
    		createLine(y);
    	}
    }

    //KEYBOARD SHORTCUTS

    if(keyCode == 85) { //u
    	if(keyIsDown(CONTROL))
    		lines[lines.length - 1].elt.value = "";
    } //CTRL U - clear the line

    if(keyCode == 76) { //l
    	if(keyIsDown(CONTROL))
    		reset();
    } //CTRL L - clears the screen

    if(keyCode == UP_ARROW)
    {
    	if(lines.length >= 2)
    		lines[lines.length - 1].elt.value = lines[lines.length - 2].value();
    } //UP - fills with previous command
}

function processInput(content)
{
	if(content == "ls")
    	alert("blog, about, and other cool things");
    else if(content == "help")
    	stdout("whoa, man...", y + LINE_HEIGHT - 16.5);
    else if(content == "clear")
    	reset();
    else if(content == "blog")
    	window.open("https://josh8.com/blog", "_self");
    else
    	console.log(lines[lines.length - 1].value());
}

function stdout(content, y, x=X_POSITION)
{
	incrementLine();
	let p = createP(content);
	p.style("color", STDOUT_COLOR);
	p.style("padding-top", "0.4%");
  	p.style("padding-bottom", "0.4%");
	p.style("font-size", "1.3em");
	p.style("font-family", "monospace");

	p.position(x, y);

}

function reset()
{
	X_POSITION = window.innerWidth/5.3;
	LINE_HEIGHT = 30;
	y = floor(window.innerHeight / 6.3);
	clear();

	setup();
}

function incrementLine()
{
	y += LINE_HEIGHT;
}