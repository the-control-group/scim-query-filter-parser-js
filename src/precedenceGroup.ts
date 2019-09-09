import { ids } from "apg-lib";
import { Yard } from "./Yard";

export function precedenceGroup(
  state: ids.SEM_PRE | ids.SEM_POST,
  chars: number[],
  phraseIndex: number,
  phraseLength: number,
  yard: Yard
): ids.SEM_OK | ids.SEM_SKIP {
  switch (state) {
    case ids.SEM_PRE:
      yard.pre("precedenceGroup");
      break;

    case ids.SEM_POST:
      const { expression } = yard.post("precedenceGroup");

      if (expression.length !== 1) {
        throw new Error(
          `INVARIANT: Expected 1 expression, but got ${expression.length};`
        );
      }

      yard.tracks.precedenceGroup.push(expression[0]);
      break;
  }

  return ids.SEM_OK;
}
