import { ids, utils } from "apg-lib";
import { Yard } from "./Yard";

export function attributePathSegment(
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
      yard.tracks.attributePathSegment.push(
        utils.charsToString(chars, phraseIndex, phraseLength, yard)
      );
      break;
  }

  return ids.SEM_OK;
}
