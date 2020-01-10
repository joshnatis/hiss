const DEFAULT_X = window.innerWidth/5.3;
const LINE_HEIGHT = 30;
const PADDING = 16.5;
const WORD_SPACER = 10;
let JSMODE = false;

let y;
let maxInputLength;
let cnv;

const INPUT_COLOR = "#33FF00";
const STDOUT_COLOR = "#FFB000"
const BG_COLOR = "#282828";
const BUU_COLOR = "#FB607F"
const ERROR_COLOR = "#FF0000";

let files = ["blog", "about", "hat", "josh8", "resources"];
let commands = ["help", "clear", "goto", "ls", "hello", "buu", "js"];

let lines = [];
let output_log = [];

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
	//stdout("404: Page Not Found.", y + LINE_HEIGHT - PADDING, DEFAULT_X, false, STDOUT_COLOR);
	//stdnewline();
	if(lines.length == 0)
		createLine(y);
}

function createLine(y, prompt="$ ") 
{
	displayPrompt(y, prompt);

	let inp = createInput("");
   		inp.elt.focus();
		inp.position(DEFAULT_X, y);

	  	inp.style("width", "53em");
	  	inp.style("padding-top", "0.4%");
	  	inp.style("padding-bottom", "0.4%");
	  	inp.style("font-size", "1.3em");
	  	inp.style("outline", "none");
	  	inp.style("resize", "none");
	  	inp.style("color", INPUT_COLOR);
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

function displayPrompt(y, prompt) 
{
	let p = createP(prompt);
		p.style("color", INPUT_COLOR);
		p.style("padding-top", "0.4%");
	  	p.style("padding-bottom", "0.4%");
		p.style("font-size", "1.3em");
		p.style("font-family", "monospace");
	p.position(DEFAULT_X - 20, y - PADDING); //position prompt behind input
}

function draw()
{
	if(y + PADDING > cnv.position().y + height)
		restartAtTop();

	lines[lines.length - 1].elt.focus(); //move cursor into last input
}

function keyPressed() 
{
	if(keyCode == RETURN) {
		let content = lines[lines.length - 1].value();
		output_log.push(content);

		if(JSMODE) {
			if(content == "done") {
				JSMODE = false;
			}
			else {
				try {
					eval(content);
				}
				catch(err) {
					stdout(err);
				}
			}
		}
		else {
			processInput(content);
		}

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
	    	let a = stdout("Welcome to ");
	    	let b = stdout_word("josh", next_word_xpos(a), "blue");
			stdout(", the OSC JOsh SHell version 1.0", y - PADDING, next_word_xpos(b) - WORD_SPACER, false, STDOUT_COLOR);
	    	stdout("Available commands: ");
	    	ls(commands);
	}

	else if(content == "clear")
    	reset();

	else if(content.substr(0,5) == "goto ")
   	{
   		window.open("https://josh8.com/" + content.substr(5), "_self");
   	}

	else if(content.substring(0,4) == "man " || content == "man")
    	stdout("Nice try :P, go to 'help' instead.");

	else if(content.toLowerCase() == "hello")
    	stdout("Hello!");

   	else if(content == "goto")
   		stdout("Well, where should I go? (hint: ls)");

   	else if(content == "buu")
   		stdout("<3", (y + LINE_HEIGHT - PADDING), DEFAULT_X, true, "blue");

   	else if(content == "")
   	{}

   	else if(content == "js")
   	{
   		stdout("Type away, friend, you're in JavaScript land now.");
   		stdout("Enter 'done' to return to normal mode.");
   		JSMODE=true;
   	}

	else
	{
		let y_pos = y + LINE_HEIGHT - PADDING;
		let failed_cmd = (lines[lines.length - 1].value()).substring(0, 60);
		let word = stdout("Sorry, ", y_pos, DEFAULT_X, false);
		let word2 = stdout(failed_cmd, y_pos, next_word_xpos(word), false, ERROR_COLOR);
		stdout(" is not a valid command.", y_pos, next_word_xpos(word2));
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

function stdout_word(content, x_in, color_in)
{
	let output = stdout(content, y - PADDING, x_in, false, color_in);
	return output;
}

function ls(files, flag="")
{
	let spacer = 40; //distance between each word displayed
	let right_margin = 100; //allowed distance from right edge of canvas

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

function restartAtTop()
{
	//delete all elements
	let text = selectAll('p');
	text.forEach(t => {
        t.remove();
    });
    let inputs = selectAll('input');
    inputs.forEach(i => {
    	i.remove();
    });
	
	//clear screen and reset defaults
	setup();

	//output previous content on top
	let content = output_log[output_log.length - 1];
	y = y - LINE_HEIGHT;
	processInput(content);

	stdnewline();
	createLine(y);
}

function next_word_xpos(word_in)
{
	return (word_in.position().x + word_in.size().width + WORD_SPACER);
}

function reset()
{
	lines.splice(0, lines.length);
	clear();
	setup();
}

function stdnewline()
{
	y += LINE_HEIGHT;
}