import { parser as Parser, ast as Ast } from "apg-lib";
import Grammar from "../grammar.js";

import { Yard } from "./Yard";

import { filter } from "./filter";
import { expression } from "./expression";
import { precedenceGroup } from "./precedenceGroup";
import { attributeGroup } from "./attributeGroup";
import { prefixLogicalExpression } from "./prefixLogicalExpression";
import { infixLogicalExpression } from "./infixLogicalExpression";
import { infixLogicalExpressionPredicate } from "./infixLogicalExpressionPredicate";
import { infixLogicalExpressionOperator } from "./infixLogicalExpressionOperator";
import { postfixAssertion } from "./postfixAssertion";
import { postfixAssertionOperator } from "./postfixAssertionOperator";
import { infixAssertion } from "./infixAssertion";
import { infixAssertionOperator } from "./infixAssertionOperator";
import { infixAssertionValue } from "./infixAssertionValue";
import { attributePath } from "./attributePath";
import { attributePathSegment } from "./attributePathSegment";

const grammar = new Grammar();
const parser = new Parser();
parser.ast = new Ast();

parser.ast.callbacks = {
  filter,
  expression,
  precedenceGroup,
  attributeGroup,
  prefixLogicalExpression,
  infixLogicalExpression,
  infixLogicalExpressionPredicate,
  infixLogicalExpressionOperator,
  postfixAssertion,
  postfixAssertionOperator,
  infixAssertion,
  infixAssertionOperator,
  infixAssertionValue,
  attributePath,
  attributePathSegment
};

export default function compile(input: string): (data: any) => boolean {
  // Parse the filter
  const parseResult = parser.parse(grammar, "filter", input);
  if (!parseResult.success) {
    throw new Error("Failed to parse!");
  }

  // Compile the filter
  const yard = new Yard();
  parser.ast.translate(yard);

  if (yard.tracks.filter.length !== 1) {
    throw new Error(
      `INVARIANT: Expected 1 filter, but got ${yard.tracks.filter.length};`
    );
  }

  return yard.tracks.filter[0];
}

// TODO: add a way to pass in a schema definition, in the format used in
// https://tools.ietf.org/html/rfc7643
//
// Traverse this schema definition as the data is traversed, and use it to make
// decisions case sensitivity, etc.

// compile('foo eq "foo" or bar eq "bar"');
// compile('foo eq "foo" and bar eq "bar"');
// compile('foo eq "foo" or bar eq "bar" and baz eq "baz"');
// compile('foo eq "foo" and bar eq "bar" or baz eq "baz"');
// compile('foo eq "foo" or bar eq "bar" and baz eq "baz" or rap eq "rap"');
// compile('foo eq "foo" and bar eq "bar" or baz eq "baz" and rap eq "rap"');
