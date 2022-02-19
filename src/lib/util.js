// token constructor
export function Token(type, value) {
	this.type = type;
	this.value = value;

	this.len = value.length;
}

// Tree constructor

 export function Tree(nodeType, tok, attributes) {
	this.nodeType = nodeType;
	this.tok = tok;
	this.child = [];
	this.parent = null;
	this.child_count = 0;
	this.attributes=null;

}

Tree.prototype.setAttribute =function (attributes){
   this.attributes=attributes;
}

Tree.prototype.appendChild=function(tree){

	this.child.push(tree);
	this.child_count=this.child.length;


}


// add child

export const add_child = (dest, tree) => {

	dest.child.push(tree);
	
	dest.child_count = dest.child.length;

}



// print 

export const printout_Tree = (tree) => {

	var pos = [];
	var currentTag = ' ';

	function print(tree) {
		var i;


		process.stdout.write(`\n`);

		for (var k = 0; k < pos.length; k++) {
			process.stdout.write(' ')
		}
		process.stdout.write(`${tree.nodeType}`);
		if (tree.tok) {

         if(tree.tok.value!=''){
         		process.stdout.write(": " + tree.tok.value);
         	}else{
         			process.stdout.write(": " + `no tag`);
         	}
		
			if (tree.attributes) {
				process.stdout.write(` [${tree.attributes.value}]`);
			}
		}

		for (i = 0; i < tree.child_count; i++) {

			pos.push(' ')

			print(tree.child[i]);

			currentTag = tree.child[i].parent && tree.child[i].parent.tok.value;

			if (tree.child[i].parent && tree.child[i].parent.tok.value === currentTag) {
				pos.pop()

			}



		}
		process.stdout.write(``);

	}



	print(tree);



}

export const isObject=(string,error)=>{


	try{
		let expectedObj=new Function('return '+ string)();

	
	    if(Object.prototype.toString.call(expectedObj)==='[object Object]'){
	    	return expectedObj;
	    }else{

	    	throw new Error(error);
	    }

	}catch(err){
		
		 throw new Error(`${error} ${err.message}`)
	}

	    

}
