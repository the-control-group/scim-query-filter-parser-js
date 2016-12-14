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

const UNARY = {
	pr: 1
};

const PAREN = '[\\(\\)]';
const STR = '"(?:\\\\"|[^"])*"';
const OP = `${Object.keys(OPS).join('|')}`;
const WORD = '[\\w\\.]+';
const SEP = '\\s?';
const NEXT_TOKEN = new RegExp(`^(${PAREN}|${STR}|${OP}|${WORD})${SEP}`);
const IS_OPERATOR = new RegExp(`^(?:${OP})$`);


// Query
// -----

class Query {

	constructor (input) {
		this.input = input;
		this.tokens = this.lex(input);
		this.rpn = this.parseExpr();

		if (this.tokens.length)
			throw new Error(`Unexpected token '${this.tokens[0]}'. Expected end of expression.`);
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

			if (!UNARY[ast[ast.length - 1]])
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

	get tree () {
		const stack = this.rpn.slice();
		return this.constructor.getTree(stack);
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

			if (!UNARY[op])
				out.push(ast.shift());
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

			if (!UNARY[op])
				tree.splice(1, 0, OPS[stack[stack.length - 1]]
					? this.getTree(stack)
					: stack.pop());
		}

		return tree;
	}

}

module.exports = Query;
