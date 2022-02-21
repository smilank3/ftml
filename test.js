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

  p{this is inline math $2x-3x$}
  p{this is block math $$2x-3x=90$$}
`



try {
	
	const t0 = performance.now();


	let html = ftml.toHTML(test);
	console.log(html)

	//ftml.printTree(test)
	const t1 = performance.now();
	console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);



} catch (err) {


	console.log(err);


}