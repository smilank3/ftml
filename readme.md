

# Ftml
Write Html a different way with some extra features. 
- [Demo](https://mlloog.herokuapp.com/Ftml)


## Syntax
   ```css
    html{
	head{
		title{ pageTitle }
		style{
		
		  p(color:red;)
		  div(color:green;)
		  
		}
		script{
			 let p=34;
			 alert(p);
		}
	}

	body{
     h1{ Ftml Head }
      ul{
	   li{ a[href="https://en.wikipedia.org/wiki/Apple"]{Apple Fruit}}
	   li{ a[onclick="alert('mango')"]{Mango Fruit}
       }

	}
}
```
Ftml transforms the above to:
```html

<html>  
	<head>  
		<title> pageTitle </title>  
		<style>
		     p{color:red;}
		     div{color:gree;}
		</style>
		<script> let p=34; alert(p); </script> 
	</head> 
    <body>
      <h1> Ftml Head </h1>
      <ul>	
		<li><a href="https://en.wikipedia.org/wiki/Apple">Apple Fruit      </a></li>
		<li><a onclick="alert('mango')">Mango Fruit</a></li>
	  </ul>
     </body>
</html>

```
  
## Usage
 ```javascript
 import ftml from 'ftml';
 
let test = `
  div{ this is <div></div> Tag. }
  p {this is <p></p> Tag.}
`
 try {
	// convert ftml to html
	let html = ftml.toHTML(test);
	console.log(html);
	/*
	<div>this is <div></div> Tag.</div>
	<p>this is <p></p> Tag.</p>
	*/
	//convert ftml to Tree
	ftml.printTree(test);
	/* 
	TAG: no tag
	 TAG: div
	  INNER_TEXT:  this is <div></div> Tag. 
	 TAG: p
	  INNER_TEXT: this is <p></p> Tag.
*/

} catch (err) {
	console.log(err);
}
 ```
## Shortcut commands
The command must be enclosed in `{# #}`
  ```javascript
   {# create table with {heading:['Name'],data:[{name:'john'}]} #}
   ```
  creates a new table:   _see command.js to view/change styling_
  ```html
  <table style="border-collapse:collapse;border-spacing:0;width:100%;height:auto;table-layout:fixed;">	
	<thead>	
		<tr>	
			<th style="font-weight:900;font-size:15px; top:30px;color:#494848;background-color:#efefef;padding:8px;border:1px solid #ddd;">Name</th>
         </tr>
</thead>
<tbody>	
	<tr>	
		<td style="text-align:left;padding:8px;border:1px solid #ddd;font-weight:500;color:gray;word-wrap:break-word;">john</td>

	</tr>
</tbody>
</table>

  ```
_Similarly,_
```javascript 
{# create list with {type:'ul',data:['list1','list2']} #}
```
creates new list: 
```html
<ul><li>list1</li><li>list2</li></ul>

```

Only supported commands as of now.
  
 ```javascript 
 #create table with {heading:Array,data:[Obect] #
 #create chart with { type:'bar || line', data:[Object]}#
 #create list with {type:"ul || ol", data:Array}#
  ```

  



## Math rendering with [Katex](https://khan.github.io/KaTeX/):

 Support both AsciiMath and latex.
  - Inline Math
      \$ asciimath or latex \$
   - Block Math
      $$ asciimath or latex  \$$

  
## License
 @smilank3  MIT License.
