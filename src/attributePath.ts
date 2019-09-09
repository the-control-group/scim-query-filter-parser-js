import { ids } from "apg-lib";
import { Yard } from "./Yard";

export function attributePath(
  state: ids.SEM_PRE | ids.SEM_POST,
  chars: number[],
  phraseIndex: number,
  phraseLength: number,
  yard: Yard
): ids.SEM_OK | ids.SEM_SKIP {
  switch (state) {
    case ids.SEM_PRE:
      yard.pre("attributePath");
      break;

    case ids.SEM_POST:
      const { attributePathSegment } = yard.post("attributePath");
      yard.tracks.attributePath.push(attributePathSegment);
      break;
  }

  return ids.SEM_OK;
}
