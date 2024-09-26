import { ids, utils } from "apg-lib";
import { Yard } from "./Yard";

export function uri(
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
      yard.tracks.uri.push(
        utils.charsToString(chars, phraseIndex, phraseLength)
      );
      break;
  }

  return ids.SEM_OK;
}
