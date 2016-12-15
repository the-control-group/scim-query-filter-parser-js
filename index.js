'use strict';

// Constants
// ---------

const OPS = {
	pr: 4,
	eq: 3,
	co: 3,
	sw: 3,
	gt: 3,
	ge: 3,
	lt: 3,
	le: 3,
	and: 2,
	or: 1,
};

const PAREN = '[\\(\\)]';
const STR = '"(?:\\\\"|[^"])*"';
const OP = `${Object.keys(OPS).join('|')}`;
const WORD = '[\\w\\.]+';
const SEP = '\\s?';
const NEXT_TOKEN = new RegExp(`^(${PAREN}|${STR}|${OP}|${WORD})${SEP}`);
const IS_OPERATOR = new RegExp(`^(?:${OP})$`);


// Filter
// ------

class Filter {

	constructor (input, preserveCase) {
		this.input = preserveCase ? input : input.toLowerCase();
		this.tokens = this.lex(this.input);
		this.rpn = this.parseExpr();
		this.tree = this.constructor.getTree(this.rpn.slice());

		if (this.tokens.length)
			throw new Error(`Unexpected token '${this.tokens[0]}'. Expected end of expression.`);

		// We auto-bind the test method so that it's easy to use as an argument
		// for Array.prototype.filter and similar methods.
		this.test = (resource) => {
			return this.constructor.test(resource, this.tree);
		};
	}

	lex (input) {
		const tokens = [];
		while (input) {
			let matched = false;

			input = input.replace(NEXT_TOKEN, (str, token) => {
				matched = true;
				tokens.push(token);
				return '';
			});

			if (!matched) {
				throw new Error(`Could not lex input at "${input}".`);
			}
		}

		return tokens;
	}

	parseExpr () {
		const ast = [];
		var expectOp = 0;
		while (this.tokens.length && this.tokens[0] !== ')') {
			let token = this.tokens[0];

			if (expectOp && !IS_OPERATOR.test(token))
				throw new Error(`Unexpected token '${token}'. Expected operator.`);

			if (!expectOp && IS_OPERATOR.test(token))
				throw new Error(`Unexpected operator '${token}'.`);

			ast.push(token === '(' ? this.parseGroup() : this.tokens.shift());

			if (OPS[ast[ast.length - 1]] !== 4)
				expectOp ^= 1;
		}

		return this.constructor.toRpn(ast);
	}

	parseGroup () {
		// remove the leading '('
		this.tokens.shift();

		const ast = this.parseExpr();
		if (this.tokens[0] !== ')')
			throw new Error(`Unexpected token '${this.tokens[0]}'. Expected ')'.`);

		// remove the trailing ')'
		this.tokens.shift();

		return ast;
	}


	// Turn parsed tokens into an RPN stack
	// http://en.wikipedia.org/wiki/Shunting_yard_algorithm
	static toRpn (ast) {

		const out = [];
		const ops = [];

		if (ast.length)
			out.push(ast.shift());

		while (ast.length) {
			let op = ast.shift();
			let p = OPS[op];

			if (!p)
				throw new Error(`Unknown operator '${op}'.`);

			while (ops.length) {
				if (p > OPS[ops[0]])
					break;

				out.push(ops.shift());
			}

			ops.unshift(op);

			if (OPS[op] !== 4)
				out.push(OPS[op] === 3 ? JSON.parse(ast.shift()) : ast.shift());
		}

		return out.concat(ops).reduce((a, b) => a.concat(b), []);
	}

	static getTree (stack) {
		const tree = [];

		if (stack.length) {
			let op = tree[0] = stack.pop();
			tree[1] = OPS[stack[stack.length - 1]]
				? this.getTree(stack)
				: stack.pop();

			if (OPS[op] !== 4)
				tree.splice(1, 0, OPS[stack[stack.length - 1]]
					? this.getTree(stack)
					: stack.pop());
		}

		return tree;
	}

	static traverse (path, resource) {
		path = path.split('.');
		resource = Object.keys(resource)
			.reduce((acc, key) => {
				acc[key.toLowerCase()] = resource[key];
				return acc;
			}, {});

		// make sure the `path` is an array
		if(!Array.isArray(path)) throw false;

		// traverse the resource
		var cursor = resource;
		for (var i = 0; i < path.length; i++) {
			cursor = cursor[path[i]];
			if(typeof cursor === 'undefined') throw false;
		}

		return cursor;
	}

	static applyOperation (path, resource, op) {
		var value = this.traverse(path, resource);

		if (Array.isArray(value)) 
			return value.some((item) => {
				var value = typeof item.value === 'string' ? item.value.toLowerCase() : item.value;
				return op(value);
			});

		value = typeof value === 'string' ? value.toLowerCase() : value;
		return op(value);
	}

	static test (resource, tree) {
		try {
			switch (tree[0]) {
			case 'pr':
				return typeof this.traverse(tree[1], resource) !== 'undefined';

			case 'eq':
				return this.applyOperation(tree[1], resource, (value) => value === tree[2]);

			case 'co':
				return this.applyOperation(tree[1], resource, (value) => value.includes(tree[2]));

			case 'sw':
				return this.applyOperation(tree[1], resource, (value) => value.indexOf(tree[2]) === 0);

			case 'gt':
				return this.applyOperation(tree[1], resource, (value) => value > tree[2]);

			case 'ge':
				return this.applyOperation(tree[1], resource, (value) => value >= tree[2]);

			case 'lt':
				return this.applyOperation(tree[1], resource, (value) => value < tree[2]);

			case 'le':
				return this.applyOperation(tree[1], resource, (value) => value <= tree[2]);

			case 'and':
				return tree.slice(1, tree.length).every((t) => this.test(resource, t));

			case 'or':
				return tree.slice(1, tree.length).some((t) => this.test(resource, t));

			default:
				throw new Error(`Unknown operator '${tree[0]}'.`);
			}
		} catch (err) {
			if (err instanceof Error)
				throw err;

			return err;
		}
	}

}

module.exports = Filter;
