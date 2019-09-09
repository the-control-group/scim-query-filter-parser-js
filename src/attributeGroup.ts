import { ids } from "apg-lib";
import { Yard } from "./Yard";
import { traverse } from "./util";

export function attributeGroup(
  state: ids.SEM_PRE | ids.SEM_POST,
  chars: number[],
  phraseIndex: number,
  phraseLength: number,
  yard: Yard
): ids.SEM_OK | ids.SEM_SKIP {
  switch (state) {
    case ids.SEM_PRE:
      yard.pre("attributeGroup");
      break;

    case ids.SEM_POST:
      const { attributePath, expression } = yard.post("attributeGroup");

      if (attributePath.length !== 1) {
        throw new Error(
          `INVARIANT: Expected 1 attributePath, but got ${attributePath.length};`
        );
      }

      if (expression.length !== 1) {
        throw new Error(
          `INVARIANT: Expected 1 expression, but got ${expression.length};`
        );
      }

      yard.tracks.attributeGroup.push((data: any) =>
        expression[0](traverse(attributePath[0], data))
      );

      break;
  }

  return ids.SEM_OK;
}
