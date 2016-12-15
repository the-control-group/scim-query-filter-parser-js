'use strict';

const assert = require('assert');
const Filter = require('./index');

// Specification and examples are defined here:
// http://www.simplecloud.info/specs/draft-scim-api-01.html#rfc.section.3.2.2.1

describe('new Filter() [invalid filter]', () => {
	it('should error on invalid syntax', () => {
		var err = null;
		try { new Filter('userName eq ("some" thing'); } catch (e) { err = e; }
		if (!err) throw new Error('No error was thrown!');
	});
	it('should error on unknown operator', () => {
		var err = null;
		try { new Filter('userName ba "foo"'); } catch (e) { err = e; }
		if (!err) throw new Error('No error was thrown!');
	});
	it('should error on invalid JSON string', () => {
		var err = null;
		try { new Filter('userName eq "foo'); } catch (e) { err = e; }
		if (!err) throw new Error('No error was thrown!');
	});
});

describe('new Filter() [case-sensitive]', () => {
	[
		{
			string: '',
			rpn: [],
			tree: []
		},
		{
			string: 'userName eq "bjensen"',
			rpn: ['userName','bjensen','eq'],
			tree: ['eq', 'userName','bjensen']
		},
		{
			string: 'active eq true',
			rpn: ['active', true, 'eq'],
			tree: ['eq', 'active', true]
		},
		{
			string: 'name.familyName co "O\'Malley"',
			rpn: ['name.familyName', 'O\'Malley', 'co'],
			tree: ['co', 'name.familyName', 'O\'Malley']
		},
		{
			string: 'userName sw "J"',
			rpn: ['userName', 'J', 'sw'],
			tree: ['sw', 'userName', 'J']
		},
		{
			string: 'title pr',
			rpn: ['title', 'pr'],
			tree: ['pr', 'title']
		},
		{
			string: 'meta.lastModified gt "2011-05-13T04:42:34Z"',
			rpn: ['meta.lastModified', '2011-05-13T04:42:34Z', 'gt'],
			tree: ['gt', 'meta.lastModified', '2011-05-13T04:42:34Z']
		},
		{
			string: 'meta.lastModified ge "2011-05-13T04:42:34Z"',
			rpn: ['meta.lastModified', '2011-05-13T04:42:34Z', 'ge'],
			tree: ['ge', 'meta.lastModified', '2011-05-13T04:42:34Z']
		},
		{
			string: 'meta.lastModified lt "2011-05-13T04:42:34Z"',
			rpn: ['meta.lastModified', '2011-05-13T04:42:34Z', 'lt'],
			tree: ['lt', 'meta.lastModified', '2011-05-13T04:42:34Z']
		},
		{
			string: 'meta.lastModified le "2011-05-13T04:42:34Z"',
			rpn: ['meta.lastModified', '2011-05-13T04:42:34Z', 'le'],
			tree: ['le', 'meta.lastModified', '2011-05-13T04:42:34Z']
		},
		{
			string: 'title pr and userType eq "Employee"',
			rpn: ['title', 'pr', 'userType', 'Employee', 'eq', 'and'],
			tree: ['and', ['pr', 'title'], ['eq', 'userType', 'Employee']]
		},
		{
			string: 'title pr or userType eq "Intern"',
			rpn: ['title', 'pr', 'userType', 'Intern', 'eq', 'or'],
			tree: ['or', ['pr', 'title'], ['eq', 'userType', 'Intern']]
		},
		{
			string: 'userType eq "Employee" and (emails co "example.com" or emails co "example.org")',
			rpn: ['userType', 'Employee', 'eq', 'emails', 'example.com', 'co', 'emails', 'example.org', 'co', 'or' ,'and'],
			tree: ['and', ['eq', 'userType', 'Employee'], ['or', ['co', 'emails', 'example.com'], ['co', 'emails', 'example.org']]]
		}
	].forEach((test) => {
		describe('`' + test.string + '`', () => {
			var filter;
			before(() => filter = new Filter(test.string, true));
			it('should parse into an RPN stack', () => assert.deepEqual(filter.rpn, test.rpn));
			it('should parse into an expression tree', () => assert.deepEqual(filter.tree, test.tree));
		});
	});
});

describe('new Filter() [case-insensitive]', () => {
	[
		{
			string: '',
			rpn: [],
			tree: []
		},
		{
			string: 'username eq "bjensen"',
			rpn: ['username','bjensen','eq'],
			tree: ['eq', 'username','bjensen']
		},
		{
			string: 'active eq true',
			rpn: ['active', true, 'eq'],
			tree: ['eq', 'active', true]
		},
		{
			string: 'name.familyname co "o\'malley"',
			rpn: ['name.familyname', 'o\'malley', 'co'],
			tree: ['co', 'name.familyname', 'o\'malley']
		},
		{
			string: 'username sw "j"',
			rpn: ['username', 'j', 'sw'],
			tree: ['sw', 'username', 'j']
		},
		{
			string: 'title pr',
			rpn: ['title', 'pr'],
			tree: ['pr', 'title']
		},
		{
			string: 'meta.lastmodified gt "2011-05-13t04:42:34z"',
			rpn: ['meta.lastmodified', '2011-05-13t04:42:34z', 'gt'],
			tree: ['gt', 'meta.lastmodified', '2011-05-13t04:42:34z']
		},
		{
			string: 'meta.lastmodified ge "2011-05-13t04:42:34z"',
			rpn: ['meta.lastmodified', '2011-05-13t04:42:34z', 'ge'],
			tree: ['ge', 'meta.lastmodified', '2011-05-13t04:42:34z']
		},
		{
			string: 'meta.lastmodified lt "2011-05-13t04:42:34z"',
			rpn: ['meta.lastmodified', '2011-05-13t04:42:34z', 'lt'],
			tree: ['lt', 'meta.lastmodified', '2011-05-13t04:42:34z']
		},
		{
			string: 'meta.lastmodified le "2011-05-13t04:42:34z"',
			rpn: ['meta.lastmodified', '2011-05-13t04:42:34z', 'le'],
			tree: ['le', 'meta.lastmodified', '2011-05-13t04:42:34z']
		},
		{
			string: 'title pr and usertype eq "employee"',
			rpn: ['title', 'pr', 'usertype', 'employee', 'eq', 'and'],
			tree: ['and', ['pr', 'title'], ['eq', 'usertype', 'employee']]
		},
		{
			string: 'title pr or usertype eq "intern"',
			rpn: ['title', 'pr', 'usertype', 'intern', 'eq', 'or'],
			tree: ['or', ['pr', 'title'], ['eq', 'usertype', 'intern']]
		},
		{
			string: 'usertype eq "employee" and (emails co "example.com" or emails co "example.org")',
			rpn: ['usertype', 'employee', 'eq', 'emails', 'example.com', 'co', 'emails', 'example.org', 'co', 'or' ,'and'],
			tree: ['and', ['eq', 'usertype', 'employee'], ['or', ['co', 'emails', 'example.com'], ['co', 'emails', 'example.org']]]
		}
	].forEach((test) => {
		describe('`' + test.string + '`', () => {
			var filter;
			before(() => filter = new Filter(test.string));
			it('should parse into an RPN stack', () => assert.deepEqual(filter.rpn, test.rpn));
			it('should parse into an expression tree', () => assert.deepEqual(filter.tree, test.tree));
		});
	});
});

describe('filter.test', () => {
	const db = [
		{
			id: '75d350df-e2be-4f09-9c9a-f16f510e18b5',
			userName: 'crouppulled',
			displayName: 'Croup Pulled',
			name: {formatted: 'Croup Pulled', familyName: 'Pulled', givenName: 'Croup'},
			emails: [{value: 'crouppulled@example.com', type: 'work', primary: true}, {value: 'crouppulled@example.org', type: 'work', primary: true}],
			active: true
		},
		{
			id: 'da5364b5-5da2-4f55-b13c-75d350dfbdae',
			userName: 'degreeskim',
			displayName: 'Degre Eskim',
			name: {formatted: 'Degre Eskim', familyName: 'Eskim', givenName: 'Degre'},
			emails: [{value: 'degreeskim@example.com', type: 'work', primary: true}],
			active: false
		},
		{
			id: 'df0fec8d-ca1b-41da-9cd4-0a955d47fd6e',
			userName: 'gauzebrennand',
			displayName: 'Gauze Brennand',
			name: {formatted: 'Gauze Brennand', familyName: 'Brennand', givenName: 'Gauze'},
			emails: [{value: 'gauzebrennand@example.com', type: 'work', primary: true}],
		},
		{
			id: '7fe14935-f678-4aeb-a21c-748924f4e6f9',
			userName: 'impetuousnapkin',
			displayName: 'Impet Uousnapkin',
			name: {formatted: 'Impet Uousnapkin', familyName: 'Uousnapkin', givenName: 'Impet'},
			emails: [{value: 'impetuousnapkin@example.com', type: 'work', primary: true}],
		},
		// {
		// 	id: '803eba9d-1e73-40e6-9630-225533bed0d3',
		// 	userName: 'sulkyode',
		// 	displayName: 'Sulky Ode',
		// 	name: {formatted: 'Sulky Ode', familyName: 'Ode', givenName: 'Sulky'},
		// 	emails: [{value: 'sulkyode@example.com', type: 'work', primary: true}],
		// },
		// {
		// 	id: 'cfcbb3b8-9986-4e4d-951e-ab93e11649aa',
		// 	userName: 'dewpegasus',
		// 	displayName: 'Dewpe Gasus',
		// 	name: {formatted: 'Dewpe Gasus', familyName: 'Gasus', givenName: 'Dewpe'},
		// 	emails: [{value: 'dewpegasus@example.com', type: 'work', primary: true}],
		// },
		// {
		// 	id: 'a4b32adb-b38e-4258-8a30-8e02bcd83692',
		// 	userName: 'laugherncelery',
		// 	displayName: 'Laugh Erncelery',
		// 	name: {formatted: 'Laugh Erncelery', familyName: 'Erncelery', givenName: 'Laugh'},
		// 	emails: [{value: 'laugherncelery@example.com', type: 'work', primary: true}],
		// },

	];

	it('should support the `pr` operator', () => {
		const filter = new Filter('active pr');
		const results = db.filter(filter.test);
		assert.equal(results.length, 2);
		assert.equal(results[0].id, '75d350df-e2be-4f09-9c9a-f16f510e18b5');
		assert.equal(results[1].id, 'da5364b5-5da2-4f55-b13c-75d350dfbdae');
	});

	it('should support the `eq` operator', () => {
		const filter = new Filter('id eq "75d350df-e2be-4f09-9c9a-f16f510e18b5"');
		const results = db.filter(filter.test);
		assert.equal(results.length, 1);
		assert.equal(results[0].id, '75d350df-e2be-4f09-9c9a-f16f510e18b5');
	});

	it('should support the `co` operator', () => {
		const filter = new Filter('id co "e2be"');
		const results = db.filter(filter.test);
		assert.equal(results.length, 1);
		assert.equal(results[0].id, '75d350df-e2be-4f09-9c9a-f16f510e18b5');
	});

	it('should support the `sw` operator', () => {
		const filter = new Filter('id sw "75d350df"');
		const results = db.filter(filter.test);
		assert.equal(results.length, 1);
		assert.equal(results[0].id, '75d350df-e2be-4f09-9c9a-f16f510e18b5');
	});

	it('should support the `gt` operator', () => {
		const filter = new Filter('id gt "da5364b5-5da2-4f55-b13c-75d350dfbdae"');
		const results = db.filter(filter.test);
		assert.equal(results.length, 1);
		assert.equal(results[0].id, 'df0fec8d-ca1b-41da-9cd4-0a955d47fd6e');
	});

	it('should support the `ge` operator', () => {
		const filter = new Filter('id ge "da5364b5-5da2-4f55-b13c-75d350dfbdae"');
		const results = db.filter(filter.test);
		assert.equal(results.length, 2);
		assert.equal(results[0].id, 'da5364b5-5da2-4f55-b13c-75d350dfbdae');
		assert.equal(results[1].id, 'df0fec8d-ca1b-41da-9cd4-0a955d47fd6e');
	});

	it('should support the `lt` operator', () => {
		const filter = new Filter('id lt "7fe14935-f678-4aeb-a21c-748924f4e6f9"');
		const results = db.filter(filter.test);
		assert.equal(results.length, 1);
		assert.equal(results[0].id, '75d350df-e2be-4f09-9c9a-f16f510e18b5');
	});

	it('should support the `le` operator', () => {
		const filter = new Filter('id le "7fe14935-f678-4aeb-a21c-748924f4e6f9"');
		const results = db.filter(filter.test);
		assert.equal(results.length, 2);
		assert.equal(results[0].id, '75d350df-e2be-4f09-9c9a-f16f510e18b5');
		assert.equal(results[1].id, '7fe14935-f678-4aeb-a21c-748924f4e6f9');
	});

	it('should support the `and` operator', () => {
		const filter = new Filter('id co "75d350df" and active eq true');
		const results = db.filter(filter.test);
		assert.equal(results.length, 1);
		assert.equal(results[0].id, '75d350df-e2be-4f09-9c9a-f16f510e18b5');
	});

	it('should support the `or` operator', () => {
		const filter = new Filter('id eq "75d350df-e2be-4f09-9c9a-f16f510e18b5" or id eq "7fe14935-f678-4aeb-a21c-748924f4e6f9"');
		const results = db.filter(filter.test);
		assert.equal(results.length, 2);
		assert.equal(results[0].id, '75d350df-e2be-4f09-9c9a-f16f510e18b5');
		assert.equal(results[1].id, '7fe14935-f678-4aeb-a21c-748924f4e6f9');
	});

	it('should support nested operators', () => {
		const filter = new Filter('id co "a21c" or (active pr and userName eq "crouppulled")');
		const results = db.filter(filter.test);
		assert.equal(results.length, 2);
		assert.equal(results[0].id, '75d350df-e2be-4f09-9c9a-f16f510e18b5');
		assert.equal(results[1].id, '7fe14935-f678-4aeb-a21c-748924f4e6f9');
	});

	it('should support non-string values', () => {
		const filter = new Filter('active eq true');
		const results = db.filter(filter.test);
		assert.equal(results.length, 1);
		assert.equal(results[0].id, '75d350df-e2be-4f09-9c9a-f16f510e18b5');
	});

	it('should resolve operators case-insensitively', () => {
		const filter = new Filter('id Eq "75d350df-e2be-4f09-9c9a-f16f510e18b5"');
		const results = db.filter(filter.test);
		assert.equal(results.length, 1);
		assert.equal(results[0].id, '75d350df-e2be-4f09-9c9a-f16f510e18b5');
	});

	it('should traverse attributes case-insensitively', () => {
		const filter = new Filter('USERname eq "crouppulled"');
		const results = db.filter(filter.test);
		assert.equal(results.length, 1);
		assert.equal(results[0].id, '75d350df-e2be-4f09-9c9a-f16f510e18b5');
	});

	it('should operate on values case-insensitively', () => {
		const filter = new Filter('id eq "75D350DF-e2be-4F09-9C9A-F16F510E18B5"');
		const results = db.filter(filter.test);
		assert.equal(results.length, 1);
		assert.equal(results[0].id, '75d350df-e2be-4f09-9c9a-f16f510e18b5');
	});

	it('should traverse complex attributes', () => {
		const filter = new Filter('name.formatted eq "Croup Pulled"');
		const results = db.filter(filter.test);
		assert.equal(results.length, 1);
		assert.equal(results[0].id, '75d350df-e2be-4f09-9c9a-f16f510e18b5');
	});

	it('should match on any matching multi-value attributes', () => {
		const filter = new Filter('emails eq "crouppulled@example.org"');
		const results = db.filter(filter.test);
		assert.equal(results.length, 1);
		assert.equal(results[0].id, '75d350df-e2be-4f09-9c9a-f16f510e18b5');
	});

});
