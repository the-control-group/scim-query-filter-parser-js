import { ids } from "apg-lib";
import { Yard } from "./Yard";

export function prefixLogicalExpression(
  state: ids.SEM_PRE | ids.SEM_POST,
  chars: number[],
  phraseIndex: number,
  phraseLength: number,
  yard: Yard
): ids.SEM_OK | ids.SEM_SKIP {
  switch (state) {
    case ids.SEM_PRE:
      yard.pre("prefixLogicalExpression");
      break;

    case ids.SEM_POST:
      const { prefixLogicalExpressionOperator, precedenceGroup } = yard.post(
        "prefixLogicalExpression"
      );

      if (prefixLogicalExpressionOperator.length !== 1) {
        throw new Error(
          `INVARIANT: Expected 1 prefixLogicalExpressionOperator, but got ${prefixLogicalExpressionOperator.length};`
        );
      }

      if (precedenceGroup.length !== 1) {
        throw new Error(
          `INVARIANT: Expected 1 precedenceGroup, but got ${precedenceGroup.length};`
        );
      }

      yard.tracks.prefixLogicalExpression.push((data: any) =>
        prefixLogicalExpressionOperator[0](precedenceGroup[0], data)
      );

      break;
  }

  return ids.SEM_OK;
}
