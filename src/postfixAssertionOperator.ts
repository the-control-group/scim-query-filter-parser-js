import { ids, utils } from "apg-lib";
import { Yard } from "./Yard";
import { traverse } from "./util";

// TODO: implement unicode string comparisons using
// String.prototype.localeCompare()

function pr(path: string[], data: any): boolean {
  return traverse(path, data).some(x => x !== undefined);
}

const map = {
  pr
};

export function postfixAssertionOperator(
  state: typeof ids.SEM_PRE | typeof ids.SEM_POST,
  chars: number[],
  phraseIndex: number,
  phraseLength: number,
  yard: Yard
): typeof ids.SEM_OK | typeof ids.SEM_SKIP {
  switch (state) {
    case ids.SEM_PRE:
      break;

    case ids.SEM_POST:
      const op = utils
        .charsToString(chars, phraseIndex, phraseLength)
        .toLowerCase();
      const fn = map[op as keyof typeof map];
      if (!fn) {
        throw new Error(
          `INVARIANT: No such postfix assertion operator \`${op}\`.`
        );
      }

      yard.tracks.postfixAssertionOperator.push(fn);
      break;
  }

  return ids.SEM_OK;
}
