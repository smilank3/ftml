import {
	Token
} from './util.js'


function tokenize(input) {
	var tokens = [];
	var buff = [];
	var attributes = [];
	var tempToken; // this is when tag has attributes
	var tempTokenTag;
	var tempTokenScriptTag;
	var i = 0;
	// root token.
	tokens.push(new Token('TOK_TAG', ''))
	tokens.push(new Token('TOK_LBRAC', '{'));
	do {
		if (input.charAt(i) === "[") {

			if (tempTokenScriptTag) {
				buff.push(input.charAt(i));

			} else {
				buff = buff.filter(e => e != ' ');

				tempToken = new Token('TOK_TAG', buff.join('').replace(/\n+/, ''));
				// clear buff
				buff = [];

				tokens.push(tempToken);

				tokens.push(new Token('TOK_LPAREN', input.charAt(i)));
			}



		} else if (input.charAt(i) === "{") {



			if (tempToken) {

				if (tempToken.value === 'script' || tempToken.value === 'style') {

					tempTokenScriptTag = tempToken;
				} else {
					tempTokenScriptTag = null;
				}

				buff = [];
				tempToken = null;
				//attributes = [];

				tokens.push(new Token('TOK_LBRAC', input.charAt(i)));

			} else if (tempTokenScriptTag) {


				let obj = [];

				function recurse() {


					buff.push(input.charAt(i));
					i++;
					while (input.charAt(i) !== '}') {

						if (i >= input.length) {
							throw new SyntaxError(`missing } in #..#`);

						}


						if (input.charAt(i) === '{') {


							recurse();


						} else {

							buff.push(input.charAt(i));
							i++;

						}

					}
					buff.push(input.charAt(i));
					i++;

				}

				recurse();



				if (input.charAt(i) !== ";") {
					buff.push('\n');
					--i;
				} else {
					buff.push(input.charAt(i));
				}



			} else {
				buff = buff.filter(e => e != ' ');


				//
				tempTokenTag = new Token('TOK_TAG', buff.join('').replace(/\n+/, ''));
				tokens.push(tempTokenTag);

				if (tempTokenTag.value === 'script' || tempTokenTag.value === 'style') {
					tempTokenScriptTag = tempTokenTag;
				} else {
					tempTokenScriptTag = null;
				}
				buff = [];

				tokens.push(new Token('TOK_LBRAC', input.charAt(i)));

			}


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

			if (tempTokenScriptTag) {
				buff.push(input.charAt(i));

			} else {

				if (buff.length) {
					tokens.push(new Token('TOK_ATTRIBUTES', buff.join('')));
					buff = [];
				}

				tokens.push(new Token('TOK_RPAREN', input.charAt(i)));

			}

		} else if (input.charAt(i) === "}") {

			/*
			          if(tempTokenScriptTag ){

			          	console.log('if tempTokenTag')
			          buff.push(input.charAt(i));


			            	if(input.charAt(++i ===";")){
			            		buff.push(input.charAt(i))
			            		 tokens.push(new Token('TOK_SCRIPT',buff.join('')));

			            			}

			            			//
			            			/*
			            	console.log('next : ',input.charAt(i))
			            	if(input.charAt(++i)=='\n' ){
			            		   i++;
			            		   // next char must be } and before it must be \n
			            		   if(input.charAt(i)==="}"){
			            		   	tempTokenScriptTag=null;
			            		   	buff=[];
			            		   }
			            	}


			            	i++;

			            	let p=[];

			            	while(input.charAt(i)!=='}'){

			            	buff.push(input.charAt(i));
			            	if(input.charAt(i)===';'){

			            		tokens.push(new Token('TOK_SCRIPT',buff.join('')));
			            	 
			            	}
			            	i++;


			            	}

			           console.log('-=--------- char at ',input.charAt(i));

			            tempTokenTag=null
			            buff=[]
			            	//buff.push(input.charAt(i));

			           

			          
			         
			            
			          
			          	
			          }else{
			          	console.log('if not a tempTokenTag')
			          	console.log(buff)



			          	if(buff.length){
			          						
							       // ignore \n, \t, ' 
							tokens.push(new Token('TOK_TEXT', buff.join('')));
							buff = [];


			          	} 


			       tokens.push(new Token('TOK_RBRAC', input.charAt(i)));

										

			          }

			       
			          
						
					*/


			if (buff.length) {


				tokens.push(new Token('TOK_TEXT', buff.join('')));
				tempTokenScriptTag = null;

				buff = [];



			}


			if (!tempTokenScriptTag) {
				tokens.push(new Token('TOK_RBRAC', input.charAt(i)));
			}



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

				--i;
				mathBuff.push(input.charAt(i));

				if (i >= input.length) {
					throw new SyntaxError('Missing $$');
				}
				i++;
			}


			i++;

			if (input.charAt(i) === '$') {
				tokens.push(new Token('TOK_BLOCKMATH', mathBuff.join('')));

			} else {
				throw new SyntaxError('Missing $$')
			}



		} else if (input.charAt(i) === '$') {

			if (tempTokenScriptTag) {
				buff.push(input.charAt(i));

			} else {

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
			}

		} else if (input.charAt(i) === '#') {
			// code;
			i++;

			let codeBuff = [];

			while (input.charAt(i) !== '#') {



				if (i === input.length) {

					throw new SyntaxError('Missing #');

				}
				codeBuff.push(input.charAt(i));
				i++;

			}


			tokens.push(new Token('TOK_CMD', codeBuff.join('')));


		} else {


			buff.push(input.charAt(i));

		}
		i++;
	} while (i < input.length);

	if (buff.length) {
		tokens.push(new Token('TOK_TEXT', buff.join('')))
	}
	tokens.push(new Token('TOK_RBRAC', '}'));

	return tokens;

}

export default tokenize;