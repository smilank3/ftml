import {
	isObject,
	Tree,
	Token,
} from './util.js'




var isObjectLiteral = (obj) => {

	return obj !== null && obj.constructor.name === 'Object';
}


// check the data value 

function checkValue(value) {

	if (value > 100) {
		throw new RangeError(`Value must be <= 100`)
	}

	return value * 10; // multipy by 10, to make the bar visible.

}

// list

const renderList = (listData) => {

	if (!isObjectLiteral(listData)) {
		throw new SyntaxError('listData must be an Object')
	}

	const {
		type,
		data
	} = listData;

	if (typeof type === 'undefined') {
		throw new SyntaxError('list type prop missing;')
	}

	if (typeof type !== 'string') {
		throw new SyntaxError('lists type prop must be string.');
	}

	if (data === undefined) {
		throw new SyntaxError('list data props missing')
	} else
		if (!Array.isArray(data)) {
			throw new SyntaxError('list data must be an Array')
		}
	/*
		for (var element of data) {
	
			if (!isObjectLiteral(element)) {
				throw new SyntaxError("list data's element must be an Object Literal");
			}
		}
		*/

	let listType = null;



	if (type.toLowerCase() === 'ul') {

		listType = new Tree('TAG', new Token('TOK_TAG', 'ul'));

	} else if (type.toLowerCase() == 'ol') {
		listType = new Tree('TAG', new Token('TOK_TAG', 'ol'));

	} else {
		throw new TypeError('list type must be either "ul" or "ol".')
	}


	for (var i = 0; i < data.length; i++) {
		let li = new Tree('TAG', new Token('TOK_TAG', 'li'));
		li.appendChild(new Tree('INNER_TEXT', new Token('TOK_TEXT', data[i])))

		listType.appendChild(li);
	}


	return listType;
}


// draw table;
const renderTable = (tableData) => {

	if (!isObjectLiteral(tableData)) {
		throw new SyntaxError('tableData must be an Object')
	}
	const {
		heading,
		data
	} = tableData;

	if (heading === undefined) {
		throw new SyntaxError('heading props missing')
	} else
		if (!Array.isArray(heading)) {
			throw new SyntaxError('heading must be an Array')
		}

	if (data === undefined) {
		throw new SyntaxError('data props missing')
	} else
		if (!Array.isArray(data)) {
			throw new SyntaxError('data must be an Array')
		}


	for (var element of data) {

		if (!isObjectLiteral(element)) {
			throw new SyntaxError("data's element must be an object");
		}
	}


	let table = new Tree('TAG', new Token('TOK_TAG', 'table'));
	table.attributes = new Token('TOK_ATTRIBUTES', 'style="border-collapse:collapse;border-spacing:0;width:100%;height:auto;table-layout:fixed;"');
	let thead = new Tree('TAG', new Token('TOK_TAG', 'thead'));
	let tbody = new Tree('TAG', new Token('TOK_TAG', 'tbody'));
	let trHead = new Tree('TAG', new Token('TOK_TAG', 'tr'));



	table.appendChild(thead);
	table.appendChild(tbody);



	thead.appendChild(trHead);
	// head
	for (var i = 0; i < heading.length; i++) {
		let thHead = new Tree('TAG', new Token('TOK_TAG', 'th'));
		thHead.appendChild(new Tree('INNER_TEXT', new Token('TOK_TEXT', heading[i])))

		thHead.attributes = new Token('TOK_ATTRIBUTES', `style="font-weight:900;font-size:15px;top:30px;color:#494848;background-color:#efefef;padding:8px;border:1px solid #ddd;"`);
		trHead.appendChild(thHead);
	}



	// body;

	for (var i = 0; i < data.length; i++) {



		let trBody = new Tree('TAG', new Token('TOK_TAG', 'tr'));

		//tdBody.appendChild(new Tree('INNER_TEXT',new Token('TOK_TEXT',data[])))

		for (const key in data[i]) {
			console.log(data[i][key]);
			let tdBody = new Tree('TAG', new Token('TOK_TAG', 'td'));
			tdBody.appendChild(new Tree('INNER_TEXT', new Token('TOK_TEXT', data[i][key])));
			tdBody.attributes = new Token('TOK_ATTRIBUTES', `style="text-align:left;padding:8px;border:1px solid #ddd;font-weight:500;color:gray;word-wrap:break-word;"`);
			trBody.appendChild(tdBody);

		}

		tbody.appendChild(trBody);
	}

	return table;

}


// draw chart

const renderChart = (chartData) => {


	const {
		type,
		title,
		data,
		ykey,
		xkey,
		prefix
	} = chartData;



	let div = new Tree('TAG', new Token('TOK_TAG', 'div'));

	let table = new Tree('TAG', new Token('TOK_TAG', 'table'));
	table.attributes = new Token('TOK_ATTRIBUTES', `style="width:100%;height:300px;margin-bottom:60px;"`)

	let tr = new Tree('TAG', new Token('TOK_TAG', 'tr'));

	let td = new Tree('TAG', new Token('TOK_TAG', 'td'));
	//td.setAttribute('class="some"');
	let textNode = new Tree('INNER_TEXT', null);


	textNode.tok = new Token('TOK_TEXT', title);



	td.appendChild(textNode);
	td.attributes = new Token('TOK_ATTRIBUTES', `style="text-align:center;" colspan=${data.length}`)

	tr.appendChild(td);
	table.appendChild(tr);
	div.appendChild(table);


	let newtr = new Tree('TAG', new Token('TOK_TAG', 'tr'));



	for (var i = 0; i < data.length; i++) {

		let newtd = new Tree('TAG', new Token('TOK_TAG', 'td'));
		let newdiv = new Tree('TAG', new Token('TOK_TAG', 'div'));
		newdiv.attributes = new Token('TOK_ATTRIBUTES', `style="height:${checkValue(data[i][ykey])}px;background-color:red;" 
  onmouseover="((node)=>(node.style.opacity='0.6'))(this)"
  onmouseout="((node)=>(node.style.opacity='1'))(this)"`);

		let span = new Tree('TAG', new Token('TOK_TAG', 'span'));
		span.appendChild(new Tree('INNER_TEXT', new Token('TOK_TEXT', data[i][`${xkey}`])))
		let tdInnerTag = new Tree('TAG', new Token('TOK_TAG', ''));
		newtd.appendChild(new Tree("INNER_TEXT", new Token('TOK_TEXT', data[i][ykey] + `${prefix ? prefix : ''}`)));

		newtd.attributes = new Token('TOK_ATTRIBUTES', `style="vertical-align:bottom;"`)
		//td.appendChild(tdInnerTag)



		newtd.appendChild(newdiv);
		newtd.appendChild(span);
		newtr.appendChild(newtd);



	}
	table.appendChild(newtr);



	return div;


}

const tokenize = (input) => {


	let x = input.replace(/\n|\t/g, ' ');
	var i = 0;
	let buff = [];
	let result = [];



	do {
		if (x.charAt(i) === "{") {

			let obj = [];

			function recurse() {


				obj.push(x.charAt(i));
				i++;
				while (x.charAt(i) !== '}') {

					if (i >= x.length) {
						throw new SyntaxError(`missing } in #..#`);

					}


					if (x.charAt(i) === '{') {


						recurse();


					} else {

						obj.push(x.charAt(i));
						i++;

					}

				}
				obj.push(x.charAt(i));
				i++;

			}

			recurse();
			result.push(obj.join(''))
		} else if (x.charAt(i) === ' ') {
			if (buff.length) {
				result.push(buff.join(''));
				buff = [];
			}
		} else if (x.charAt(i) === ';') {
			break;
		} else {

			buff.push(x.charAt(i));
		}

		i++;
	} while (i < x.length);


	if (result.length < 3) {

		throw new SyntaxError(`Unexpected CMD ${result.join(' ')}`)
	}

	try {


		return {
			construct: result[0].toLowerCase() == 'create' ? 'create' : (() => {
				throw new SyntaxError(`Unexpected token '${result[0]}'. Expected 'create'`)
			})(),
			what: ['table', 'chart', 'list'].includes(result[1].toLowerCase()) ? result[1].toLowerCase() : (() => {
				throw new SyntaxError(`Unexpected token '${result[1]}'. Expected 'chart' or 'table`)
			})(),
			preposition: result[2] && result[2].toLowerCase() === "with" ? 'with' : (() => {
				throw new SyntaxError(`Unexpected token '${result[2]}'. Expected 'with' `)
			})(),
			data: result[3] && isObject(result[3], `Unexpected data type`)

		}

	} catch (err) {
		throw err;


	}


}



// main function


export default (cmdString) => {

	try {
		const cmd = tokenize(cmdString);

		switch (cmd.what) {
			case 'chart':

				return renderChart(cmd.data);
				break;
			case 'table':

				return renderTable(cmd.data);
				break;

			case 'list':
				return renderList(cmd.data);
				break;

			default:
				break;
		}

	} catch (err) {
		throw err
	}
}