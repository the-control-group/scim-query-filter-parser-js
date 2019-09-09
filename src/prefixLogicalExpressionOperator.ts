import { ids, utils } from "apg-lib";
import { Yard } from "./Yard";

function not(expression: (data: any) => boolean, data: any): boolean {
  return !expression(data);
}

const map = {
  not
};

export function prefixLogicalExpressionOperator(
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
      const op = utils.charsToString(chars, phraseIndex, phraseLength, yard);
      const fn = map[op as keyof typeof map];
      if (!fn) {
        throw new Error(
          `INVARIANT: No such prefix logical expression operator \`${op}\`.`
        );
      }

      yard.tracks.prefixLogicalExpressionOperator.push(fn);
      break;
  }

  return ids.SEM_OK;
}
