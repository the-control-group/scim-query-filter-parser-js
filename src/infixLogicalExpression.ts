import { ids } from "apg-lib";
import { Yard } from "./Yard";

export function infixLogicalExpression(
  state: typeof ids.SEM_PRE | typeof ids.SEM_POST,
  chars: number[],
  phraseIndex: number,
  phraseLength: number,
  yard: Yard
): typeof ids.SEM_OK | typeof ids.SEM_SKIP {
  switch (state) {
    case ids.SEM_PRE:
      yard.pre("infixLogicalExpression");
      break;

    case ids.SEM_POST:
      const { infixLogicalExpressionPredicate, expression } = yard.post(
        "infixLogicalExpression"
      );

      if (expression.length !== 1) {
        throw new Error(
          `INVARIANT: Expected 1 expression, but got ${expression.length};`
        );
      }

      if (infixLogicalExpressionPredicate.length < 1) {
        throw new Error(
          `INVARIANT: Expected 1 or more infixLogicalExpressionPredicate, but got ${infixLogicalExpressionPredicate.length};`
        );
      }

      // Flatten the expressions into a linear sequence.
      const flat = ([] as (((data: any) => boolean) | "and" | "or")[]).concat(
        expression[0],
        ...infixLogicalExpressionPredicate.reverse()
      );

      // Recombine in disjunctive normal form (ORs of ANDs).
      const dnf = [] as ((data: any) => boolean)[];

      let start = 0;

      for (let end = 0; end <= flat.length; end++) {
        if (flat[end] === "or" || end === flat.length) {
          // Slice a purely conjunctive (ANDs only) clause.
          const conjunctive = flat.slice(start, end);
          start = end + 1;

          // Add a monadic expression directly.
          if (conjunctive.length === 1) {
            const e = conjunctive[0];
            if (typeof e !== "function") {
              throw new Error(
                "INVARIANT: non-function for member of disjunctive expression."
              );
            }

            dnf.push(e);
          }

          // Compile conjunctive clause.
          for (let i = 0; i < conjunctive.length; i++) {
            const e = conjunctive[i];

            if (e === "and") {
              const left = conjunctive[i - 1];
              if (typeof left !== "function") {
                throw new Error(
                  "INVARIANT: non-function for left-hand of conjunctive expression."
                );
              }

              const right = conjunctive[i + 1];
              if (typeof right !== "function") {
                throw new Error(
                  "INVARIANT: non-function for right-hand of conjunctive expression."
                );
              }

              dnf.push((data: any) => left(data) && right(data));
            }
          }

          start = end + 1;
        }
      }

      yard.tracks.infixLogicalExpression.push((data: any) =>
        dnf.some(e => e(data))
      );

      break;
  }

  return ids.SEM_OK;
}
