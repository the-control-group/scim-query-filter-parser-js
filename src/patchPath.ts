import { ids } from "apg-lib";
import { Yard } from "./Yard";

export function patchPath(
  state: typeof ids.SEM_PRE | typeof ids.SEM_POST,
  chars: number[],
  phraseIndex: number,
  phraseLength: number,
  yard: Yard
): typeof ids.SEM_OK | typeof ids.SEM_SKIP {
  switch (state) {
    case ids.SEM_PRE:
      yard.pre("patchPath");
      break;

    case ids.SEM_POST:
      const { attributePath, attributeGroup, attributePathSegment } = yard.post(
        "patchPath"
      );

      const children = [...attributePath, ...attributeGroup];

      if (children.length !== 1) {
        throw new Error(
          `INVARIANT: Expected 1 patchPath, but got ${children.length};`
        );
      }

      if (attributePath.length) {
        yard.tracks.patchPath.push({
          path: attributePath[0].join("."),
          subpath: null,
          filter: null
        });
      } else {
        const nestedAttributePath = attributeGroup[0][0];
        yard.tracks.patchPath.push({
          path: nestedAttributePath[0].join("."),
          filter: attributeGroup[0][1],
          subpath: attributePathSegment.length
            ? attributePathSegment.reverse().join(".")
            : null
        });
      }

      break;
  }

  return ids.SEM_OK;
}
