let DEFAULT_X = window.innerWidth/5.3;
let LINE_HEIGHT = 30;
let PADDING = 16.5;

let y;
let maxInputLength;
let cnv;

let COLOR = "#33FF00";
let STDOUT_COLOR = "#FFB000"
let BG_COLOR = "#282828";
let BUU_COLOR = "#FB607F"
let ERROR_COLOR = "#FF0000";

let lines = [];
let files = ["blog", "about", "hat", "josh8", "resources"];
let dotfiles = [".vimrc", ".bashrc"];
let commands = ["help", "clear", "goto", "ls", "hello", "buu"];

function setup() 
{
	let w = window.innerWidth;
	let h = window.innerHeight;

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
		inp.position(DEFAULT_X, y);

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
	p.position(DEFAULT_X - 20, y - PADDING);
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
    		stdnewline();
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
    	ls(files);

    else if(content == "help")
    {
    	stdout("Welcome to josh, the OSC Josh Shell version 1.0.");
    	stdout("Available commands: ");
    	ls(commands);
   	}

    else if(content.substring(0,4) == "man " || content == "man")
    	stdout("Nice try :P, go to 'help' instead.");

    else if(content.toLowerCase() == "hi" || content.toLowerCase() == "hello")
    	stdout("Hello!");

    else if(content == "clear")
    	reset();

   	else if(content.substr(0,5) == "goto ")
   	{
   		if(files.includes(content.substr(6)))
   		{
   			alert(content.substr(6));
   			window.open("https://josh8.com/" + content.substr(6));
   		}
   		alert("uh oh!");
   	}

    else if(content == "blog")
    	window.open("https://josh8.com/blog", "_self");

    else
    {
    	let y_shorthand = y + LINE_HEIGHT - PADDING;
    	let failed_cmd = (lines[lines.length - 1].value()).substring(0, 60);
    	let word = stdout("Sorry, ", y_shorthand, DEFAULT_X, false);
    	let word2 = stdout(failed_cmd, y_shorthand, word.position().x + word.size().width + 10, false, ERROR_COLOR);
    	stdout(" is not a valid command.", y_shorthand, word2.position().x + word2.size().width + 10);
    }
}

function stdout(content, y_in=(y + LINE_HEIGHT - PADDING), x_in=DEFAULT_X, newline=true, color_in=STDOUT_COLOR)
{
	if(newline)
		stdnewline();

	let p = createP(content);
	p.style("color", color_in);
	p.style("padding-top", "0.4%");
  	p.style("padding-bottom", "0.4%");
	p.style("font-size", "1.3em");
	p.style("font-family", "monospace");

	p.position(x_in, y_in);

	return p;
}

function ls(files, flag="")
{
	let spacer = 40;
	let right_margin = 100;

	let local_x = DEFAULT_X;
	for(let i = 0; i < files.length; ++i)
	{
		let word = stdout(files[i], y + LINE_HEIGHT - PADDING, local_x, false, BUU_COLOR); //make me pure...
		local_x = word.position().x + word.size().width + spacer; //x coord of start of new word

		let allowed_x_pos = cnv.position().x + width - right_margin;
		// continue printing on new line if not enough space
		if(local_x > allowed_x_pos && (i != files.length - 1)) { //make sure this isn't the last element
			local_x = DEFAULT_X;
			stdnewline();
		}
	}
	
	stdnewline();
}

function reset()
{
	y = floor(window.innerHeight / 6.3);
	clear();
	setup();
}

function stdnewline()
{
	y += LINE_HEIGHT;
}