// We're splitting hairs here, but we don't want to redeclare
// these strings all the time... maximum performance! :-)
var u = 'undefined';
var f = 'function';
var s = 'string';

function parsePath (pathString) {
	return pathString.split('.');
}


function traverse (path, resource) {

	// make sure the `path` is an array
	if(!Array.isArray(path)) throw false;

	// traverse the resource
	var cursor = resource;
	for (var i = 0; i < path.length; i++) {
		cursor = cursor[path[i]];
		if(typeof cursor === u) throw false;
	}

	return cursor;
}

module.exports = {


	// Present
	// -------
	// 
	// Asserts that a path exists.

	pr: function pr(args, resource){

		// traverse throws if path doesn't exist
		traverse(parsePath(args[0]), resource);

		// no errors
		return true;
	},


	// Match
	// -----
	// 
	// Asserts that the `path` exists and its value is matched by regex `value`.
	// TODO: pre-coerce `args[1]` using `new Regex()`

	match: function match(args, resource){

		// traverse the resource
		var cursor = traverse(parsePath(args[0]), resource);

		// make the comparison
		return !!(typeof cursor === s && cursor.match(args[1]));
	},


	// Equal
	// -----
	// 
	// Asserts that the `path` exists and its value is strictly equal to `value`.

	eq: function eq(args, resource){

		// traverse the resource
		var cursor = traverse(parsePath(args[0]), resource);

		// make the comparison
		return cursor === args[1];
	},


	// Not Equal
	// ---------
	// 
	// Asserts that the `path` does not exist or its value is not strictly equal to `value`.

	ne: function ne(args, resource){
		var cursor;

		// traverse the resource
		try { cursor = traverse(parsePath(args[0]), resource); }
		catch(e) { return true; }

		// make the comparison
		return cursor !== args[1];
	},


	// Greater Than
	// ------------
	// 
	// Asserts that the `path` exists and its value is greater than `value`.

	gt: function gt(args, resource){

		// traverse the resource
		var cursor = traverse(parsePath(args[0]), resource);

		// make the comparison
		return cursor > args[1];
	},


	// Greater Than or Equal
	// ---------------------
	// 
	// Asserts that the `path` exists and its value is greater than or equal to `value`.

	ge: function ge(args, resource){

		// traverse the resource
		var cursor = traverse(parsePath(args[0]), resource);

		// make the comparison
		return cursor >= args[1];
	},


	// Less Than
	// ---------
	// 
	// Asserts that the `path` exists and its value is less than `value`.

	lt: function lt(args, resource){

		// traverse the resource
		var cursor = traverse(parsePath(args[0]), resource);

		// make the comparison
		return cursor < args[1];
	},


	// Less Than or Equal
	// ------------------
	// 
	// Asserts that the `path` exists and its value is less than or equal to `value`.

	le: function le(args, resource){

		// traverse the resource
		var cursor = traverse(parsePath(args[0]), resource);

		// make the comparison
		return cursor <= args[1];
	}
};