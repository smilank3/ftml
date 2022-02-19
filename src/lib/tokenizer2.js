import {
	Token
} from './util.js'


function tokenize(input) {
	var tokens = [];
	var buff = [];
	var attributes = [];
	var tempToken;
	var i = 0;

	do {
		if (input.charAt(i) === "[") {
			buff = buff.filter(e => e != ' ');
			console.log(buff)
			tempToken = new Token('TOK_TAG', buff.join(''));
			// clear buff
			buff = [];

			tokens.push(tempToken);

			tokens.push(new Token('TOK_LPAREN', input.charAt(i)));


		} else if (input.charAt(i) === "{") {


			if (tempToken) {

				buff = [];
				tempToken = null;
				//attributes = [];

			} else {
				buff = buff.filter(e => e != ' ');
				tokens.push(new Token('TOK_TAG', buff.join('')));
				buff = [];

			}

			tokens.push(new Token('TOK_LBRAC', input.charAt(i)));
			/*
						// check if next char is '{'
						//  inside tag {} represent content without tag.
						// eg: div{ {content without tag} p{content with tag}} =>  <div> content without tag <p> content with tag</p> </div>

						 if(input.charAt(++i)==="{"){
						 	
						 	  // next char
						 	   i++;
						 	    //content
						 	    let textBuff=[];

						 	    while(input.charAt(i)!=="}"){

						 	    	textBuff.push(input.charAt(i));

						 	  if (i == input.length) {
								throw new Error(`Missing Right Paren after ${textBuff.join('')}`)
								break;
									}

							i++;
						 	    }
						 	  

						 	    tokens.push(new Token('TOK_TEXT',textBuff.join('')));

						 	    
						 	
						 }else{
						 	i--;
						 }

						
			*/



		} else if (input.charAt(i) === ']') {

			if (buff.length) {
				tokens.push(new Token('TOK_ATTRIBUTES', buff.join('')));
				buff = [];
			}

			tokens.push(new Token('TOK_RPAREN', input.charAt(i)));

		} else if (input.charAt(i) === "}") {


			if (buff.length) {
				tokens.push(new Token('TOK_TEXT', buff.join('')));

				buff = [];
			}

			tokens.push(new Token('TOK_RBRAC', input.charAt(i)));

		} else if (input.charAt(i) === '$' && (input.charAt(++i) === '$' ? true : (() => {
				--i;
				return false;
			})())) {
			// math block


			if (buff.length) {
				tokens.push(new Token('TOK_TEXT', buff.join('')));
				buff = [];
			}

			let mathBuff = [];
			i++;
			while (input.charAt(i) !== "$" && input.charAt(++i) !== "$") {
				console.log('charAt ', input.charAt(i))
					--i;
				mathBuff.push(input.charAt(i));

				if (i >= input.length) {
					throw new SyntaxError('Missing $$');
				}
				i++;
			}


			console.log('before ', input.charAt(i))
			i++;
			console.log(input.charAt(i));
			if (input.charAt(i) === '$') {
				tokens.push(new Token('TOK_BLOCKMATH', mathBuff.join('')));

			} else {
				throw new SyntaxError('Missing $$')
			}



		} else if (input.charAt(i) === '$') {


			// if element in buff.
			if (buff.length) {
				tokens.push(new Token('TOK_TEXT', buff.join('')));
				buff = [];
			}

			let mathBuff = [];
			i++;
			while (input.charAt(i) !== "$") {
				mathBuff.push(input.charAt(i));

				if (i === input.length) {
					throw new SyntaxError('Missing $');
				}
				i++;
			}


			tokens.push(new Token('TOK_INLINEMATH', mathBuff.join('')));


		} else if (input.charAt(i) === '#') {
			// code;
			i++;

			let codeBuff = [];

			while (input.charAt(i) !== '#') {

				console.log(input.charAt(i));

				if (i === input.length) {

					throw new SyntaxError('Missing #');

				}
				codeBuff.push(input.charAt(i));
				i++;

			}


			tokens.push(new Token('TOK_CMD', codeBuff.join('')));


		} else {
			console.log(input.charAt(i))

			buff.push(input.charAt(i));

		}
		i++;
	} while (i < input.length)

	return tokens;

}

console.log(tokenize(`

	div[style]{
		fsdfds and 
	}

	`.replace(/\t/g, '')))

export default tokenize;