import { ids } from "apg-lib";
import { Yard } from "./Yard";

export function attributePath(
  state: typeof ids.SEM_PRE | typeof ids.SEM_POST,
  chars: number[],
  phraseIndex: number,
  phraseLength: number,
  yard: Yard
): typeof ids.SEM_OK | typeof ids.SEM_SKIP {
  switch (state) {
    case ids.SEM_PRE:
      yard.pre("attributePath");
      break;

    case ids.SEM_POST:
      const { attributePathSegment } = yard.post("attributePath");

      if (attributePathSegment.length < 1) {
        throw new Error(
          `INVARIANT: Expected 1 or more attributePathSegment, but got ${attributePathSegment.length};`
        );
      }

      yard.tracks.attributePath.push(attributePathSegment.reverse());
      break;
  }

  return ids.SEM_OK;
}
