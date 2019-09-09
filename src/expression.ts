import { ids } from "apg-lib";
import { Yard } from "./Yard";

export function expression(
  state: typeof ids.SEM_PRE | typeof ids.SEM_POST,
  chars: number[],
  phraseIndex: number,
  phraseLength: number,
  yard: Yard
): typeof ids.SEM_OK | typeof ids.SEM_SKIP {
  switch (state) {
    case ids.SEM_PRE:
      yard.pre("expression");
      break;

    case ids.SEM_POST:
      const {
        precedenceGroup,
        attributeGroup,
        prefixLogicalExpression,
        postfixAssertion,
        infixAssertion
      } = yard.post("expression");

      const children = [
        ...precedenceGroup,
        ...attributeGroup,
        ...prefixLogicalExpression,
        ...postfixAssertion,
        ...infixAssertion
      ];

      if (children.length !== 1) {
        throw new Error(
          `INVARIANT: Expected 1 expression, but got ${children.length};`
        );
      }

      yard.tracks.expression.push(children[0]);
      break;
  }

  return ids.SEM_OK;
}
