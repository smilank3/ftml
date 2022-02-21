import tokensize from './tokenizer.js'
import {
	Token,
	Tree,
	add_child,
	printout_Tree
} from './util.js'

import htmlTags from './htmlTags.js'
import cmdToTree from './command.js'
import asciimath2latex from '../../src/package/asciimath2latex.js';
import katex from 'katex'

class Ftml {
	constructor(index = 0, tokens = null, tok_count = 0) {
		this.index = index;
		this.tokens = tokens;
		this.tok_count = tok_count;


	}



	peek() {

		if (this.index >= this.tok_count) {
			return this.tokens[this.tok_count - 1];
		} else {
			return this.tokens[this.index]
		}

	}
	// cmd

	command(cmd) {


		return cmdToTree(cmd);


	}

	block() {


		var tok;
		var tree;
		var tempTree;
		var tempTree2;



		if (this.peek().type == "TOK_TAG") {


			tok = this.peek();
			++this.index;
			tempTree = new Tree("TAG", tok);

			if (this.peek().type === "TOK_LBRAC") {



				//next value
				++this.index;



				while (this.peek().type !== "TOK_RBRAC") {



					tempTree2 = this.block();


					if (!tempTree2) {
						throw new Error('Syntax Error: missing }');
					}
					// remember parent

					tempTree2.parent = JSON.parse(JSON.stringify(tempTree));

					add_child(tempTree, tempTree2);


				}

				++this.index;



				tree = tempTree;

				return tree;

			} else if (this.peek().type === "TOK_LPAREN") {


				++this.index;

				tempTree.attributes = this.peek();

				++this.index;


				if (this.peek().type !== 'TOK_RPAREN') {

					throw new SyntaxError('missing ) ');
					return;
				} else {

					++this.index;



					if (this.peek().type === 'TOK_LBRAC') {
						++this.index;



						while (this.peek().type !== "TOK_RBRAC") {



							tempTree2 = this.block();

							if (!tempTree2) {


								throw new SyntaxError(`Unexpected token '${this.peek().value}' `);

							}
							// remember parent

							tempTree2.parent = JSON.parse(JSON.stringify(tempTree));

							add_child(tempTree, tempTree2);



						}

						++this.index;
						tree = tempTree;


						return tree;


					} else {


						throw new SyntaxError(`Unexpected token ${this.peek().value}`);

						return;
					}


				}



			}



		} else if (this.peek().type == "TOK_TEXT") {

			tok = this.peek();
			// next token;
			++this.index;

			let nTree = new Tree('INNER_TEXT', tok);

			return nTree;
		} else if (this.peek().type === "TOK_INLINEMATH") {
			tok = this.peek();
			++this.index;

			return new Tree('INLINE_MATH', tok);
		} else if (this.peek().type === "TOK_BLOCKMATH") {
			tok = this.peek();
			++this.index;

			return new Tree('BLOCK_MATH', tok)
		} else if (this.peek().type === "TOK_CMD") {


			tok = this.peek();
			++this.index;

			try {
				return this.command(tok.value);

			} catch (err) {

				// send text error 
				return new Tree('INNER_TEXT', new Token('TOK_TEXT', `<aside style="color:red;background-color:#fcebeb;font-weight:500"><p>${err.message}</p></aside>`));
			}



		}

	}


	// parse the input
	parse(input) {



		var tokens = tokensize(input);

		// token_count
		this.tok_count = tokens.length;
		// tokens;
		this.tokens = tokens;
		if (!this.tok_count) {
			throw new SyntaxError('SyntaxError.')
		}

		var tree;
		try {
			while (tokens[this.index]) {
				tree = this.block();
			}

		} catch (err) {

			throw new SyntaxError(err.message)
		}



		return tree;


	}


	// convert to HTML
	toHTML(input) {

		var html = [];
		var i;

		var tree;

		try {

			tree = this.parse(input.replace(/\t/g, ''));


		} catch (err) {



			throw new SyntaxError(err.message)
		}



		function recurse(tree) {



			if (tree.nodeType === 'TAG' && tree.tok.value !== '') {
				// if nodetype = tag but with empty value
				// then it is a content without html tag


				if (htmlTags.includes(tree.tok.value)) {

					html.push(`<${tree.tok.value}${tree.attributes && tree.attributes.value!=undefined?` ${tree.attributes.value}`:''}>\t\n`)
				} else {


					// if TOK_TAG is not one of the htmlTag then
					//  assume it as a content;
					// eg for p{ x{This is not html Tag} }
					// push 'x{'

					html.push(`${tree.tok.value}{`)



				}

				// loop over child
				for (var i = 0; i < tree.child_count; i++) {
					recurse(tree.child[i])
				}

				if (htmlTags.includes(tree.tok.value)) {

					html.push(`\n</${tree.tok.value}>\n`)
				} else {
					// closing TOK_TAG
					html.push(`}`)
				}

			} else if (tree.nodeType === 'TAG' && tree.tok.value === "") {

				for (var i = 0; i < tree.child_count; i++) {
					recurse(tree.child[i])
				}

			} else if (tree.nodeType === 'INNER_TEXT') {


				if ((tree.parent && tree.parent.nodeType === 'TAG') && (tree.parent && tree.parent.tok.value === 'style')) {
					tree.tok.value = tree.tok.value.replace(/\(/g, '{');
					tree.tok.value = tree.tok.value.replace(/\)/g, '}');
				}
				html.push(tree.tok.value);
			} else if (tree.nodeType === 'INLINE_MATH') {


				// ascii math convert.
				 let latex= asciimath2latex(tree.tok.value);
				 let mathml=katex.renderToString(`${latex}`,{throwOnErro:false});
				html.push(`<span>${mathml}</span>`);
			} else if (tree.nodeType === 'BLOCK_MATH') {

				// ascii math convert.
				 let latex= asciimath2latex(tree.tok.value);
				 let mathml=katex.renderToString(`${latex}`,{throwOnErro:false});
				html.push(`<blockquote>${mathml}</blockquote>`)
			}

		}


		recurse(tree);

		//
		return html.join("");
	}

	// print tree

	printTree(input) {
		return printout_Tree(this.parse(input.replace(/\n\s+|\n/g, '')))
	}


	htmlFromObject(treeObject) {
		var tree = treeObject;



		var html = [];
		var i;

		function recurse(tree) {



			if (tree.nodeType === 'TAG' && tree.tok.value !== '') {
				//  if nodetype = tag but with empty value
				// then it is a content without html tag


				if (htmlTags.includes(tree.tok.value)) {

					html.push(`<${tree.tok.value}${tree.attributes && tree.attributes.value!=undefined?` ${tree.attributes.value}`:''}>\r`)
				} else {


					// if TOK_TAG is not one of the htmlTag then
					//  assume it as a content;
					// eg for p{ x{This is not html Tag} }
					// push 'x{'

					html.push(`${tree.tok.value}{`)



				}

				// loop over child
				for (var i = 0; i < tree.child_count; i++) {
					recurse(tree.child[i])
				}

				if (htmlTags.includes(tree.tok.value)) {

					html.push(`</${tree.tok.value}>\n`)
				} else {
					// closing TOK_TAG
					html.push(`}`)
				}

			} else if (tree.nodeType === 'TAG' && tree.tok.value === "") {

				for (var i = 0; i < tree.child_count; i++) {
					recurse(tree.child[i])
				}


			} else if (tree.nodeType === 'INNER_TEXT') {
				// if parent is style then replace '(' and ')' with '{' and '}'
				let value = tree.tok.value;


				tree.tok.value = tree.tok.value.replace(/\{/g, "(");


				html.push(tree.tok.value);
			} else if (tree.nodeType === 'INLINE_MATH') {

				// ascii math convert.
				html.push(`<span>${tree.tok.value}</span>`);
			} else if (tree.nodeType === 'BLOCK_MATH') {
				html.push(`<blockquote>${tree.tok.value}</blockquote>`)
			}

		}


		recurse(tree);

		return html.join("");


	}



}



export default Ftml;