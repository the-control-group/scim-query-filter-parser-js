import { ids } from "apg-lib";
import { Yard } from "./Yard";
import { traverse } from "./util";

export function attributeGroup(
  state: typeof ids.SEM_PRE | typeof ids.SEM_POST,
  chars: number[],
  phraseIndex: number,
  phraseLength: number,
  yard: Yard
): typeof ids.SEM_OK | typeof ids.SEM_SKIP {
  switch (state) {
    case ids.SEM_PRE:
      yard.pre("attributeGroup");
      break;

    case ids.SEM_POST:
      const { attributePath, filter } = yard.post("attributeGroup");

      if (attributePath.length !== 1) {
        throw new Error(
          `INVARIANT: Expected 1 attributePath, but got ${attributePath.length};`
        );
      }

      if (filter.length !== 1) {
        throw new Error(
          `INVARIANT: Expected 1 filter, but got ${filter.length};`
        );
      }

      yard.tracks.attributeGroup.push((data: any) =>
        traverse(attributePath[0], data).some(x => filter[0](x))
      );

      break;
  }

  return ids.SEM_OK;
}
