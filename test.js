import ftml from './src/lib/index.js';




let tableData = {
	heading: ['Name', 'Age', 'gender'],
	data: [{
		name: 'jason',
		age: 23,
		gender: 'male'
	}, {
		name: 'mason',
		age: 24,
		gender: 'female'
	}]
};


let chartData = {
	type: 'bar',
	title: "My first dataset",
	data: [{
		month: 'January',
		book: 2
	}, {
		month: 'February',
		book: 9
	}, {
		month: 'March',
		book: 8
	}, {
		month: 'April',
		book: 2
	}, {
		month: 'May',
		book: 6
	}, {
		month: 'June',
		book: 3
	}, ],

	ykey: 'book',
	xkey: "month",
	prefix: " books"
}
/*
{# create chart with ${JSON.stringify(chartData)} #}

{# CREATE TABLE WITH ${JSON.stringify(tableData)} #}
*/


let test = `

  {p{this is inline math $2x-3x$}}

`



try {
	


	let html = ftml.toHTML(test);
	console.log(html)




} catch (err) {


	console.log(err);


}