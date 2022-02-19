

import ftml from './ftml.js'



export default {
	toHTML:(input)=>(new ftml().toHTML(input)),
	htmlFromObject:(tree)=>(new ftml().htmlFromObject(tree)),
	printTree:(input)=>(new ftml().printTree(input))
}