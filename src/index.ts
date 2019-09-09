import { parser as Parser, ast as Ast } from "apg-lib";
import Grammar from "../grammar.js";

import { Yard } from "./Yard";
import { extractSortValue } from "./util";

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

export function compileFilter(input: string): (data: any) => boolean {
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

export function parseAttributePath(input: string): string[] {
  // Parse the attributePath
  const parseResult = parser.parse(grammar, "attributePath", input);
  if (!parseResult.success) {
    throw new Error("Failed to parse!");
  }

  // Compile the attributePath
  const yard = new Yard();
  parser.ast.translate(yard);

  if (yard.tracks.attributePath.length !== 1) {
    throw new Error(
      `INVARIANT: Expected 1 attributePath, but got ${yard.tracks.attributePath.length};`
    );
  }

  return yard.tracks.attributePath[0];
}

export function compileSorter(input: string): (a: any, b: any) => -1 | 0 | 1 {
  const path = parseAttributePath(input);
  return (objectA: any, objectB: any): -1 | 0 | 1 => {
    const a = extractSortValue(path, objectA);
    const b = extractSortValue(path, objectB);

    if (a === b) {
      return 0;
    }

    if (a === undefined || a === null) {
      return -1;
    }

    if (b === undefined || b === null) {
      return 1;
    }

    if (typeof a === typeof b) {
      return a > b ? 1 : a < b ? -1 : 0;
    }

    if (typeof a === "boolean") {
      return -1;
    }

    if (typeof b === "boolean") {
      return 1;
    }

    if (typeof a === "number") {
      return -1;
    }

    if (typeof b === "number") {
      return 1;
    }

    return 0;
  };
}
