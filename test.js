'use strict';

const assert = require('assert');
const Query = require('./index');

[
	{
		string: '',
		rpn: [],
		tree: []
	},
	{
		string: 'userName eq "bjensen"',
		rpn: ['userName','"bjensen"','eq'],
		tree: ['eq', 'userName','"bjensen"']
	},
	{
		string: 'name.familyName co "O\'Malley"',
		rpn: ['name.familyName', '"O\'Malley"', 'co'],
		tree: ['co', 'name.familyName', '"O\'Malley"']
	},
	{
		string: 'userName sw "J"',
		rpn: ['userName', '"J"', 'sw'],
		tree: ['sw', 'userName', '"J"']
	},
	{
		string: 'title pr',
		rpn: ['title', 'pr'],
		tree: ['pr', 'title']
	},
	{
		string: 'meta.lastModified gt "2011-05-13T04:42:34Z"',
		rpn: ['meta.lastModified', '"2011-05-13T04:42:34Z"', 'gt'],
		tree: ['gt', 'meta.lastModified', '"2011-05-13T04:42:34Z"']
	},
	{
		string: 'meta.lastModified ge "2011-05-13T04:42:34Z"',
		rpn: ['meta.lastModified', '"2011-05-13T04:42:34Z"', 'ge'],
		tree: ['ge', 'meta.lastModified', '"2011-05-13T04:42:34Z"']
	},
	{
		string: 'meta.lastModified lt "2011-05-13T04:42:34Z"',
		rpn: ['meta.lastModified', '"2011-05-13T04:42:34Z"', 'lt'],
		tree: ['lt', 'meta.lastModified', '"2011-05-13T04:42:34Z"']
	},
	{
		string: 'meta.lastModified le "2011-05-13T04:42:34Z"',
		rpn: ['meta.lastModified', '"2011-05-13T04:42:34Z"', 'le'],
		tree: ['le', 'meta.lastModified', '"2011-05-13T04:42:34Z"']
	},
	{
		string: 'title pr and userType eq "Employee"',
		rpn: ['title', 'pr', 'userType', '"Employee"', 'eq', 'and'],
		tree: ['and', ['pr', 'title'], ['eq', 'userType', '"Employee"']]
	},
	{
		string: 'title pr or userType eq "Intern"',
		rpn: ['title', 'pr', 'userType', '"Intern"', 'eq', 'or'],
		tree: ['or', ['pr', 'title'], ['eq', 'userType', '"Intern"']]
	},
	{
		string: 'userType eq "Employee" and (emails co "example.com" or emails co "example.org")',
		rpn: ['userType', '"Employee"', 'eq', 'emails', '"example.com"', 'co', 'emails', '"example.org"', 'co', 'or' ,'and'],
		tree: ['and', ['eq', 'userType', '"Employee"'], ['or', ['co', 'emails', '"example.com"'], ['co', 'emails', '"example.org"']]]
	}
].forEach((test) => {
	describe(test.string, () => {
		var query;
		before(() => query = new Query(test.string));
		it('should parse into an RPN stack', () => assert.deepEqual(query.rpn, test.rpn));
		it('should parse into an AST', () => assert.deepEqual(query.tree, test.tree));
	});
});
