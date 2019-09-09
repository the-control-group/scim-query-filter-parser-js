import { ids, utils } from "apg-lib";
import { Yard } from "./Yard";

export function infixLogicalExpressionOperator(
  state: ids.SEM_PRE | ids.SEM_POST,
  chars: number[],
  phraseIndex: number,
  phraseLength: number,
  yard: Yard
): ids.SEM_OK | ids.SEM_SKIP {
  switch (state) {
    case ids.SEM_PRE:
      break;

    case ids.SEM_POST:
      const op = utils
        .charsToString(chars, phraseIndex, phraseLength, yard)
        .toLowerCase();
      if (op !== "and" && op !== "or") {
        throw new Error(
          `INVARIANT: No such infix logical expression operator \`${op}\`.`
        );
      }

      yard.tracks.infixLogicalExpressionOperator.push(op);
      break;
  }

  return ids.SEM_OK;
}
