import { ids } from "apg-lib";
import { Yard } from "./Yard";

export function infixAssertion(
  state: typeof ids.SEM_PRE | typeof ids.SEM_POST,
  chars: number[],
  phraseIndex: number,
  phraseLength: number,
  yard: Yard
): typeof ids.SEM_OK | typeof ids.SEM_SKIP {
  switch (state) {
    case ids.SEM_PRE:
      yard.pre("infixAssertion");
      break;

    case ids.SEM_POST:
      const {
        attributePath,
        infixAssertionOperator,
        infixAssertionValue
      } = yard.post("infixAssertion");

      if (attributePath.length !== 1) {
        throw new Error(
          `INVARIANT: Expected 1 attributePath, but got ${attributePath.length};`
        );
      }

      if (infixAssertionOperator.length !== 1) {
        throw new Error(
          `INVARIANT: Expected 1 infixAssertionOperator, but got ${infixAssertionOperator.length};`
        );
      }

      if (infixAssertionValue.length !== 1) {
        throw new Error(
          `INVARIANT: Expected 1 infixAssertionValue, but got ${infixAssertionValue.length};`
        );
      }

      yard.tracks.infixAssertion.push((data: any) => {
        return infixAssertionOperator[0](
          attributePath[0],
          infixAssertionValue[0],
          data
        );
      });
      break;
  }

  return ids.SEM_OK;
}
