import { ids } from "apg-lib";
import { Yard } from "./Yard";

export function precedenceGroup(
  state: typeof ids.SEM_PRE | typeof ids.SEM_POST,
  chars: number[],
  phraseIndex: number,
  phraseLength: number,
  yard: Yard
): typeof ids.SEM_OK | typeof ids.SEM_SKIP {
  switch (state) {
    case ids.SEM_PRE:
      yard.pre("precedenceGroup");
      break;

    case ids.SEM_POST:
      const { filter } = yard.post("precedenceGroup");

      if (filter.length !== 1) {
        throw new Error(
          `INVARIANT: Expected 1 filter, but got ${filter.length};`
        );
      }

      yard.tracks.precedenceGroup.push(filter[0]);
      break;
  }

  return ids.SEM_OK;
}
