import { ids } from "apg-lib";
import { Yard } from "./Yard";

export function infixLogicalExpressionPredicate(
  state: typeof ids.SEM_PRE | typeof ids.SEM_POST,
  chars: number[],
  phraseIndex: number,
  phraseLength: number,
  yard: Yard
): typeof ids.SEM_OK | typeof ids.SEM_SKIP {
  switch (state) {
    case ids.SEM_PRE:
      yard.pre("infixLogicalExpressionPredicate");
      break;

    case ids.SEM_POST:
      const { infixLogicalExpressionOperator, expression } = yard.post(
        "infixLogicalExpressionPredicate"
      );

      if (infixLogicalExpressionOperator.length !== 1) {
        throw new Error(
          `INVARIANT: Expected 1 infixLogicalExpressionOperator, but got ${infixLogicalExpressionOperator.length};`
        );
      }

      if (expression.length !== 1) {
        throw new Error(
          `INVARIANT: Expected 1 expression, but got ${expression.length};`
        );
      }

      yard.tracks.infixLogicalExpressionPredicate.push([
        infixLogicalExpressionOperator[0],
        expression[0]
      ]);
      break;
  }

  return ids.SEM_OK;
}
