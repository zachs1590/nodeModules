/***
  ** Copyright Zach Stevenson 2012
  **
  ** This module was created to emulate the dump functionality in Adobe Coldfusion
  ** It will allow you to visually see what type of objects you have created making
  ** the development process easier and faster.
  **
  ** I tend to use a closure inside of my createServer to alias the writeDump
  ** function that automatically passes the response to it so i don't have to
  ** constantly write it over and over again. I will have an example after this.
  ** 
  ** This module is being hosted at github at https://github.com/zachs1590/nodeModules/
  **
  ** e:  zachs1590@gmail.com
  ** t:  cfzach              //Ironic, no?
  ** f:  zachs1590
  **
  ***/


/* -------- EXAMPLE OF CREATE SERVER CLOSURE -------- */
/*
	var dump = require('./modules/dump');

	http.createServer(function(request, response)
	{
		var writeDump = function(variable, top)
		{
			return dump.writeDump(response, variable, top);
		}

		writeDump(request);
	});

*/

/* -------- EXPORTS -------- */
exports.writeDump = writeDump;
exports.dump      = dump; 


/* -------- CONSTANTS -------- */
var undefinedDataTypes = {'undefined':1};
var simpleDataTypes = {'string':1, 'number':1, 'boolean':1};
var arrayTypes = {'array':1};
var objectTypes = {'object':1};
var _DEFAULT_TOP = 9999;


/* -------- PUBLIC FUNCTIONS -------- */

/***
  ** public void function writeDump(response, variable[, top = 9999])
  **
  ** writeDump is intended to be a nice utility function for the dump function
  ** It's sole purpose is to immediately write what is dumped to page.
  **
  ** ARGUMENTS:
  ** response - REQUIRED - Type: Class - http.ServerResponse
  ** 		This is the response object you get when you createServer on http
  ** variable - REQUIRED - Type: Any
  ** 		This is any type of object that you want to have dumped to the screen
  ** top - NOT REQUIRED -Type: numeric
  ** 		This is the amount of levels deep a dump can go.  This is very important
  **		when you have objects that may contain references of themselves or when
  **		you have extremely large amounts of data nested. This count is 1 indexed,
  **		not 0, so the first depth is 1.
  **
  ***/
function writeDump(response, variable, top)
{
	response.write(dump(variable, top));
}

/***
  ** public string function dump(variable[, top = 9999])
  **
  ** dump is the main function of this module. It kicks off this entire mumbo jumbo
  ** This function will start the origin string and default values where necessary
  ** to have a good output.  This function passes off a lot of the heavy lifting to
  ** the private render function.
  **
  ** ARGUMENTS:
  ** variable - REQUIRED - Type: Any
  ** 		This is any type of object that you want to have dumped to the screen
  ** top - NOT REQUIRED -Type: numeric
  ** 		This is the amount of levels deep a dump can go.  This is very important
  **		when you have objects that may contain references of themselves or when
  **		you have extremely large amounts of data nested. This count is 1 indexed,
  **		not 0, so the first depth is 1.
  **
  ***/
function dump(variable, top)
{
	var output = "";

	if(typeof top == 'undefined' || !isFinite(top))
	{
		top = _DEFAULT_TOP;
	}

	output += getCSS();
	output += '<div class="DUMP_MODULE">';
	output = render(output, variable, top, 1);
	output += '</div>';
	output += '<br />';
	return output;
}





/* -------- PRIVATE FUNCTIONS -------- */

function render(output, variable, top, currentLevel)
{
	var typeOfVariable = typeof variable;

	//for undefined and null
	if(undefinedDataTypes.hasOwnProperty(typeOfVariable) || variable === null)
	{
		output = renderUndefined(output, typeOfVariable);
	}

	//for Simple Value Type
	else if(simpleDataTypes.hasOwnProperty(typeOfVariable))
	{
		output = renderSimple(output, variable);
	}

	//for Arrays
	else if(arrayTypes.hasOwnProperty(typeOfVariable) || variable instanceof Array)
	{
		output = renderArray(output, variable, top, currentLevel);
	}

	//for objects
	else if(objectTypes.hasOwnProperty(typeOfVariable))
	{
		output = renderObject(output, variable, top, currentLevel);
	}

	return output;
}

function renderUndefined(output, typeOfVariable)
{
	if(typeOfVariable == 'object')
	{
		typeOfVariable = 'null';
	}
	output += '<div class="DUMP_MODULE__UNDEFINED"><p>';

	output += typeOfVariable;

	output += '</p></div>';

	return output;
}

function renderSimple(output, variable)
{
	output += '<div class="DUMP_MODULE__SIMPLE"><table><tr class="DUMP_MODULE__SIMPLE_ROW"><td class="DUMP_MODULE__SIMPLE_TYPE DUMP_MODULE__TYPE"><p>'
	output += typeof variable;
	output += '</p></td><td class="DUMP_MODULE__SIMPLE_VALUE"><p>';
	output += variable.toString();
	output += '</p></td></tr></table></div>';
	return output;
}

function renderArray(output, variable, top, currentLevel)
{
	output += '<div class="DUMP_MODULE__ARRAY"><table><tr class="DUMP_MODULE__ARRAY_ROW"><th colspan="2" class="DUMP_MODULE__ARRAY_TYPE DUMP_MODULE__TYPE">Array</th></tr>';
	
	if(currentLevel <= top)
	{
		for(var key in variable)
		{
			var nextLevel = currentLevel + 1;
			output += '<tr class="DUMP_MODULE__ARRAY_ROW"><td class="DUMP_MODULE__ARRAY_INDEX DUMP_MODULE__TYPE"><p>';
			output += key.toString();
			output += '</p></td><td class="DUMP_MODULE__ARRAY_VALUE">';
			output = render(output, variable[key], top, nextLevel);
			output += '</td></tr>';
		}
	}
	output += '</table></div>';

	return output;
}

function renderObject(output, variable, top, currentLevel)
{
	output += '<div class="DUMP_MODULE__OBJECT"><table><tr class="DUMP_MODULE__OBJECT_ROW"><th colspan="2" class="DUMP_MODULE__OBJECT_TYPE DUMP_MODULE__TYPE">Object</th></tr>';
	
	if(currentLevel <= top)
	{
		for(var key in variable)
		{
			var nextLevel = currentLevel + 1;
			output += '<tr class="DUMP_MODULE__OBJECT_ROW"><td class="DUMP_MODULE__OBJECT_INDEX DUMP_MODULE__TYPE"><p>';
			output += key.toString();
			output += '</p></td><td class="DUMP_MODULE__OBJECT_VALUE">';
			output = render(output, variable[key], top, nextLevel);
			output += '</td></tr>';
		}
	}
	output += '</table></div>';

	return output;
}


function getCSS()
{
	return '<style type="text/css">.DUMP_MODULE *{font-family:helvetica,arial,sans-serif;font-size:12px}.DUMP_MODULE{background-color:#fff}.DUMP_MODULE p{margin:0 5px;color:#111}.DUMP_MODULE table{border-spacing:0;border-collapse:collapse}.DUMP_MODULE td{padding:2px 0}.DUMP_MODULE .DUMP_MODULE__TYPE{font-weight:bold;text-transform:capitalize}.DUMP_MODULE .DUMP_MODULE__UNDEFINED p{font-family:georgia,times,serif;font-size:14px;font-style:italic;margin-bottom:10px;background-color:#fff}.DUMP_MODULE .DUMP_MODULE__SIMPLE .DUMP_MODULE__SIMPLE_ROW{display:block;border:2px solid #888}.DUMP_MODULE .DUMP_MODULE__SIMPLE .DUMP_MODULE__SIMPLE_TYPE{background-color:#eee;border-right:1px solid #888}.DUMP_MODULE .DUMP_MODULE__ARRAY .DUMP_MODULE__ARRAY_ROW{display:block;border:2px solid #006d00;border-top:0}.DUMP_MODULE .DUMP_MODULE__ARRAY .DUMP_MODULE__ARRAY_ROW:first-child{border-top:2px solid #006d00;background-color:#00a300;color:#fff}.DUMP_MODULE .DUMP_MODULE__ARRAY .DUMP_MODULE__ARRAY_INDEX{background-color:#cefecc;border-right:2px solid #006d00}.DUMP_MODULE .DUMP_MODULE__ARRAY .DUMP_MODULE__ARRAY_TYPE,.DUMP_MODULE .DUMP_MODULE__OBJECT .DUMP_MODULE__OBJECT_TYPE{padding:2px}.DUMP_MODULE .DUMP_MODULE__ARRAY .DUMP_MODULE__ARRAY_VALUE,.DUMP_MODULE .DUMP_MODULE__OBJECT .DUMP_MODULE__OBJECT_VALUE{padding:3px}.DUMP_MODULE .DUMP_MODULE__OBJECT .DUMP_MODULE__OBJECT_ROW{display:block;border:2px solid #0100c8;border-top:0}.DUMP_MODULE .DUMP_MODULE__OBJECT .DUMP_MODULE__OBJECT_ROW:first-child{border-top:2px solid #0100c8;background-color:#4644d4;color:#fff}.DUMP_MODULE .DUMP_MODULE__OBJECT .DUMP_MODULE__OBJECT_INDEX{background-color:#cedcff;border-right:2px solid #0100c8;text-transform:none}</style>';
}