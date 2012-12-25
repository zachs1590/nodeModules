exports.writeDump = writeDump;
exports.dump = dump; 

var undefinedDataTypes = {'undefined':1};
var simpleDataTypes = {'string':1, 'number':1, 'boolean':1};
var arrayTypes = {'array':1};
var objectTypes = {'object':1};


function writeDump(response, variable, top)
{
	response.write(dump(variable, top));
}

function dump(variable, top)
{
	var output = "";

	if(typeof top == 'undefined' || !isFinite(top))
	{
		top = 9999;
	}

	output += getCSS();
	output += '<div class="DUMP_MODULE">';
	output = render(output, variable, top, 1);
	output += '</div>';
	output += '<br />';
	return output;
};

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


