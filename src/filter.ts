import { ids } from "apg-lib";
import { Yard } from "./Yard";

export function filter(
  state: ids.SEM_PRE | ids.SEM_POST,
  chars: number[],
  phraseIndex: number,
  phraseLength: number,
  yard: Yard
): ids.SEM_OK | ids.SEM_SKIP {
  switch (state) {
    case ids.SEM_PRE:
      yard.pre("filter");
      break;

    case ids.SEM_POST:
      const { infixLogicalExpression, expression } = yard.post("filter");

      const children = [...infixLogicalExpression, ...expression];

      if (children.length !== 1) {
        throw new Error(
          `INVARIANT: Expected 1 filter, but got ${children.length};`
        );
      }

      yard.tracks.filter.push(children[0]);
      break;
  }

  return ids.SEM_OK;
}
