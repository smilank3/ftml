import {
	Tree,
	Token
} from './util.js';



class document {


	static createElement(element, options) {
		// options = object {class,id,style}


		if (options != undefined && typeof options !== 'object') {
			throw new Error("options must be an object");
		}
		let elements = new Tree('TAG', new Token('TOK_TAG', element));
		return elements;
	}

	static createTextNode(text) {

		return new Tree('INNER_TEXT', new Token('TOK_TEXT', text));


	}
}



let div = document.createElement('div', {
	class: 'test',
	id: 'some',
	sytle: 'someting'
});