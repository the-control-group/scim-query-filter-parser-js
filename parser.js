var nodeUtil = require("util");
var inspectOptions = {
  showHidden: true,
  depth: null
};

var grammar = new (require("./grammar.js"))();
var apglib = require("apg-lib");
var parser = new apglib.parser();
// Construct an `AST` object and attach it to the parser.
parser.ast = new apglib.ast();
var id = apglib.ids;
// The `AST` translating callback functions. These are similar to the parsers syntax callback functions
// in that they are each called twice, once down the tree and once up the tree, with matched phrase information.
// With the `AST`, however, the matched phrase is known in the down direction as well as up.
// - *state* - `SEM_PRE` (down) or `SEM_POST` (up)
// - *chars* - the array of character codes for the entire input string.
// - *phraseIndex* - the index in *chars* of the first character of the matched phrase
// - *phraseLength* - the number of characters in the matched phrase
// - *data* - the user's optional data object, passed to the translator when it is called
// - *return value* - normally `SEM_OK`. Can also be `SEM_SKIP` in the `SEM_PRE`
// state to skip the translation of the branch below the current node.\

// var callback = function(state, chars, phraseIndex, phraseLength, data) {
//   if (state == id.SEM_PRE) {
//     console.log(
//       "--",
//       apglib.utils.charsToString(chars, phraseIndex, phraseLength, data)
//     );
//   }

//   return id.SEM_OK;
//   // if (state == id.SEM_PRE) {
//   //   if (Array.isArray(data) === false) {
//   //     throw new Error("parser's user data must be an array");
//   //   }
//   //   data.length = 0;
//   // } else if (state == id.SEM_POST) {
//   //   console.log(
//   //     apglib.utils.charsToString(chars, phraseIndex, phraseLength, data)
//   //   );
//   // }

//   // return ret;
// };

// parser.ast.callbacks["filterExp"] = function onFilterExp(
//   state,
//   chars,
//   phraseIndex,
//   phraseLength,
//   data
// ) {
//   if (state == id.SEM_PRE) {
//     console.log(
//       "--filterExp:",
//       apglib.utils.charsToString(chars, phraseIndex, phraseLength, data)
//     );
//   }

//   return id.SEM_OK;
// };
// parser.ast.callbacks["filterExp"] = function onFilterExp(
//   state,
//   chars,
//   phraseIndex,
//   phraseLength,
//   data
// ) {
//   if (state == id.SEM_PRE) {
//     console.log(
//       "--filterExp:",
//       apglib.utils.charsToString(chars, phraseIndex, phraseLength, data)
//     );
//   }

//   return id.SEM_OK;
// };
// parser.ast.callbacks["attrName"] = function onAttrName(
//   state,
//   chars,
//   phraseIndex,
//   phraseLength,
//   data
// ) {
//   if (state == id.SEM_PRE) {
//     data.current.push(
//       apglib.utils.charsToString(chars, phraseIndex, phraseLength, data)
//     );
//   }

//   return id.SEM_OK;
// };
// parser.ast.callbacks["modOp"] = callback;
// parser.ast.callbacks["attrExp"] = callback;

/* use a hard coded input string */
var inputString = 'not(userName.foo eq "bjensen")';
var inputCharacterCodes = apglib.utils.stringToChars(inputString);

/* parse the string here, generating an `AST` */
var result = parser.parse(grammar, "FILTER", inputCharacterCodes);

console.log("the parser's results");
console.dir(result, inspectOptions);

if (result.success === false) {
  throw new Error("input string: '" + inputString + "' : parse failed");
}

// Return the `AST` object for further processing.
const foo = {
  current: []
};
console.log(parser.ast, parser.ast.translate(foo));
console.log(foo);
