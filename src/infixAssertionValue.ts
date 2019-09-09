import { ids, utils } from "apg-lib";
import { Yard } from "./Yard";

export function infixAssertionValue(
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
      const value = JSON.parse(
        utils.charsToString(chars, phraseIndex, phraseLength)
      ) as string | number | boolean | null;

      if (
        typeof value !== "string" &&
        typeof value !== "number" &&
        typeof value !== "boolean" &&
        value !== null
      ) {
        throw new Error("INVARIANT: Value is not scalar.");
      }

      yard.tracks.infixAssertionValue.push(value);
      break;
  }

  return ids.SEM_OK;
}
