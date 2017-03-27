var st = "- _";
var stlength = 3;
var names = [];
var variables = [];

// Change the prompt for commands from
// - to, say, >>>
function chprompt (input)
{
    st = input + " _";
	console.log(st);
	stlength = 0;
	var open = false;
	for (var i = 0; i < st.length; i++)
	{
		if (st[i] == "<")
			open = true;
		else if (st[i] == ">")
			open = false;
		else if (open == false)
			stlength++;
		console.log(open,"|", stlength, "|", st.length, "|", st[i]);
	}
}

// Change the background color
function bkcolor (input)
{
    document.body.style.backgroundColor = input;
}

// Change the color for current text
function chcolor(input)
{
    document.body.style.color = input;    
}

// Change the color for old text
function olcolor(input)
{
	$("#display").css("color", input);
}

// Change current, back, and old color
function color(input)
{
    var operands = input.split(" ");
    if (operands[0] == operands[1]) return;
	if (operands[0] == operands[2]) return;
    if (operands.length > 3) return;
	if (operands.length < 2) return;
    else{
        chcolor(operands[0]);
        bkcolor(operands[1]);
		olcolor(operands[2]);
    }
}

// Deal with broken variables
// Also, retrieve a javascript
// console variable
function fix(i)
{
    if (i===undefined)
    {
        return "";
    }
    return i;
}

// A B C -- Store in A the
// results of running B on C
function calc(input)
{
	var operands = input.split(" ");
	var name = operands[0];
	operands.shift();
	var command = operands.join(" ");
	write(-2);
	exec(command);
	var result = $("#display").text();
	result = result.substr(4 + result.lastIndexOf(">>> "));
	store(name + " " + result);
}

// Store/update a JSOS variable to
// a new value
function store(input)
{
    var operands = input.split(" ");
    if (retr(operands[0])) variables[names.indexOf(operands[0])] = operands[1];
    variables.push(operands[1]);
    names.push(operands[0]);
}

// Retrieve and print a JSOS variable
function retr(input)
{
    var index = names.indexOf(input);
    return variables[index];
}

// Delete a JSOS variable
function erase(input)
{
    var index = names.indexOf(input);
    names.splice(index, 1);
    variables.splice(index, 1);
}

// Clear the screen
function clear()
{
    $("#display").html("");  
}

// Figure out what to do on
// the current command line
function parse()
{
    // Store the last line of code as an array
    var data = $("#output").text();
    data = data.substr(stlength - 1, data.length - stlength);
    var array = data.split(" ");
    var command = array[0];

    array.shift();

    // This is where things get weird.
    // Take whatever was typed in, and find
    // the corresponding javascript function
    // (Either native or from this js file).
    var comm_func = window[command];

    var operand = array.join(" ");

    // Exec is a bit different
    if (command === "exec") write(-2);
    
    // As long as it's a function, might
    // as well run it
    if (typeof comm_func === "function")
    {
        var val = comm_func(operand);
        var t1 = ">>> ";
        var t2 = "<br>";
        if (fix(val) !== val)
        {
            t1 = "";
            t2 = "";
        }
        
        // Display output if there is any
        $("#display").html($("#display").html() + t1 + fix(val) + t2);
    }
    // If you wanted to execute something,
    // congratulations.
    if (command === "exec") return true;
}

// How to get text on the console
function write(input)
{
    // Clear the line
    if(input == -2)
    {
        $("#output").html(st);
        return;
    }
    // Backspace
    if(input == -1)
    {
        var del = $("#output").text();
        del = del.substr(0, del.length-2);
        if (del.length < stlength-1)
        {
            return;
        }
        del += "_";
        $("#output").text(del);
        return;
    }
    
    // Add character
    var stream = $("#output").html();
    stream = stream.substr(0, stream.length-1);
    stream += input + "_";
    $("#output").html(stream);
}

// Special andn uppercase characters
function translate(code, shift, reverse)
{
    var char;
    var dictionary = ["", "", "", "", "", "" , "", "", "", "", "", "", "", "\uFFF7", "", "" , "", "", "", "", "", "", "", "", "", "" , "", "", "", "", "", "", " ", "", "", "" , "", "", "", "", "", "", "", "", "", "" , "", "", "0", "1", "2", "3", "4","5","6","7","8","9", "","","","","","","","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","", "", "", "", "", "" , "", "", "", "", "", "", "", "", "", "" , "", "", "", "", "", "", "", "", "", "" , "", "", "", "", "", "","", "", "", "", "", "" , "", "", "", "", "", "", "", "", "", "" , "", "", "", "", "", "", "", "", "", "" , "", "", "", "", "", "","", "", "", "", "", "" , "", "", "", "", "", "", "", "", "", "" , "", "", "", "", "", "", "", "", "", "" , "", "", "", "", "", ";","=",",","-",".","/","`","","","","","","","","","","","","","","","","","","","","","","","","","","","[","\\","]","'"];
    if (reverse) {
        char = dictionary.indexOf(code);
        if (char == -1) shift = true;
        else return {letter: char, shift: false};
    }
    if (shift) {
        dictionary = ["", "", "", "", "", "" , "", "", "", "", "", "", "", "", "", "" , "", "", "", "", "", "", "", "", "", "" , "", "", "", "", "", "", " ", "", "", "" , "", "", "", "", "", "", "", "", "", "" , "", "", ")", "!", "@", "#", "$","%","^","&","*","(", "","","","","","","","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","", "", "", "", "", "" , "", "", "", "", "", "", "", "", "", "" , "", "", "", "", "", "", "", "", "", "" , "", "", "", "", "", "","", "", "", "", "", "" , "", "", "", "", "", "", "", "", "", "" , "", "", "", "", "", "", "", "", "", "" , "", "", "", "", "", "","", "", "", "", "", "" , "", "", "", "", "", "", "", "", "", "" , "",  "", "", "", "", "", "", "", "", "", "" , "", "", "", "", ":","+","<","_",">", "?","~","","","","","","","","","","","","","","","","","","","","","","","","", "", "" ,"{","|","}","\""];
        if (reverse) {
        char = dictionary.indexOf(code);
        return {letter: char, shift: true};
        }
    }
    char = dictionary[code];
    return char;
}

// Caps lock and shift were hard, okay?
var capsDown = false;
var shiftDown = false;
var setShiftDown = function(event){
    if(event.keyCode === 16 || event.charCode === 16){
        window.shiftDown = true;
    }
};
var setShiftUp = function(event){
    if(event.keyCode === 16 || event.charCode === 16){
        window.shiftDown = false;
    }
};
window.addEventListener? document.addEventListener('keydown', setShiftDown) : document.attachEvent('keydown', setShiftDown);
window.addEventListener? document.addEventListener('keyup', setShiftUp) : document.attachEvent('keyup', setShiftUp);
$(function() {
    $(window).bind("capsOn", function(event) {
        capsDown = true;
    });
    $(window).bind("capsOff", function(event) {
        capsDown = false;
    });

    $(window).bind("capsChanged", function(event) {
        $("#changetext").html("changed").show().fadeOut();
    });

    $(window).capslockstate();
    var initialState = $(window).capslockstate("state");
});

// Actually handles typing
function charinsert(event){
    var id = event.which;

    switch(id)
    {
        case 8:
            event.preventDefault();
            write(-1);
            break;
        
        case 13:
            $("#display").html($("#display").html() + $("#output").html().substr(0, $("#output").html().length - 1) + "<br>");
            var exec = parse();
            if(exec === true) break;
            else write(-2);
            break;
        
        default:
            var char = translate(id, capsDown ^ (shiftDown || event.shift), false);
            write(char);
            break;
    }
}

// Execute a command (not sure why
// you would want this over just
// typing the command name... this
// is for me.)
function exec(input){
    var event = {which: "", shift: false, artificial: true};

    //
    for (var ii = 0; ii < input.length-2; ii++)
    {
        if (input.substr(ii, 3) == " | ")
        {
            input = input.substr(0, ii) + "\uFFF7" + input.substr(ii+3);
        }
    }
    input += "\uFFF7";
    //Print out and run the command
    for (var i = 0; i < input.length; i++)
    {
        var code = translate(input[i], false, true);
        event.which = code.letter;
        event.shift = code.shift;
        charinsert(event);
    }
}

// Whenever you press a button, this happens.
$(document).keydown(function(event){
    charinsert(event);
});


// Close a window
function closehandler(input)
{
    hide(input);
    setTimeout(function(){close(input);}, 400);
} function minihandler(input){hide(input);} 

// Hide a window
function hide(input)
{
    $("#" + input).fadeOut();
}

// Show a window
function show(input)
{
    $("#" + input).fadeIn();
}

// Close a window (but no cool-looking
// fade effects)
function close(input)
{
    $("#" + input).remove();
}


var numwindows = 1;

// Browse the web from the only
// browser-within-a-browser!
function browse(input)
{
    var nw = numwindows;
    $("body").append("<div class=\"window\" id=\"" 
        + nw.toString() + "\"> <center> <b> Window "
        + nw + "</b> </center> <button class=\"mini\" onclick=\"minihandler("
        + nw.toString() + ");\"></button> <button class=\"close\" onclick=\"closehandler("
        + nw.toString() + ");\"></button> <iframe id=\"frame\" src=\""
        + input + "\" </iframe> </div>");
    numwindows = nw+1;
    $(".window")
        .draggable()
        .resizable();
} function access(input) {
var inputs = input.split(" ");
var window = $("#" + inputs[0].toString()+" #frame");
window.attr('src', inputs[1]);
}