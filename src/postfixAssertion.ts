import { ids } from "apg-lib";
import { Yard } from "./Yard";

export function postfixAssertion(
  state: typeof ids.SEM_PRE | typeof ids.SEM_POST,
  chars: number[],
  phraseIndex: number,
  phraseLength: number,
  yard: Yard
): typeof ids.SEM_OK | typeof ids.SEM_SKIP {
  switch (state) {
    case ids.SEM_PRE:
      yard.pre("postfixAssertion");
      break;

    case ids.SEM_POST:
      const { attributePath, postfixAssertionOperator } = yard.post(
        "postfixAssertion"
      );

      if (attributePath.length !== 1) {
        throw new Error(
          `INVARIANT: Expected 1 attributePath, but got ${attributePath.length};`
        );
      }

      if (postfixAssertionOperator.length !== 1) {
        throw new Error(
          `INVARIANT: Expected 1 postfixAssertionOperator, but got ${postfixAssertionOperator.length};`
        );
      }
      yard.tracks.postfixAssertion.push((data: any) => {
        return postfixAssertionOperator[0](attributePath[0], data);
      });
      break;
  }

  return ids.SEM_OK;
}
