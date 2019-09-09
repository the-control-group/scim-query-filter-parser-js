import { ids, utils } from "apg-lib";
import { Yard } from "./Yard";
import { traverse } from "./util";

// TODO: implement unicode string comparisons using
// String.prototype.localeCompare()

function eq(path: string[], value: any, data: any): boolean {
  return traverse(path, data).some(
    x =>
      x === value ||
      (typeof x === "string" &&
        typeof value === "string" &&
        value.localeCompare(x, undefined, { sensitivity: "base" }) === 0)
  );
}

function ne(path: string[], value: any, data: any): boolean {
  return traverse(path, data).some(
    x =>
      x !== value ||
      (typeof x === "string" &&
        typeof value === "string" &&
        value.localeCompare(x, undefined, { sensitivity: "base" }) === 0)
  );
}

function co(path: string[], value: any, data: any): boolean {
  return traverse(path, data).some(
    x => typeof x === "string" && x.includes(value)
  );
}

function sw(path: string[], value: any, data: any): boolean {
  return traverse(path, data).some(
    x => typeof x === "string" && x.substring(0, value.length) === value
  );
}

function ew(path: string[], value: any, data: any): boolean {
  return traverse(path, data).some(
    x =>
      typeof x === "string" &&
      x.length >= value.length &&
      x.substring(x.length - value.length) === value
  );
}

function gt(path: string[], value: any, data: any): boolean {
  return traverse(path, data).some(
    (x: any) => typeof x === typeof value && x > value
  );
}

function ge(path: string[], value: any, data: any): boolean {
  return traverse(path, data).some(
    (x: any) => typeof x === typeof value && x >= value
  );
}

function lt(path: string[], value: any, data: any): boolean {
  return traverse(path, data).some(
    (x: any) => typeof x === typeof value && x < value
  );
}

function le(path: string[], value: any, data: any): boolean {
  return traverse(path, data).some(
    (x: any) => typeof x === typeof value && x <= value
  );
}

const map = {
  eq,
  ne,
  co,
  sw,
  ew,
  gt,
  ge,
  lt,
  le
};

export function infixAssertionOperator(
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
      const op = utils
        .charsToString(chars, phraseIndex, phraseLength, yard)
        .toLowerCase();
      const fn = map[op as keyof typeof map];
      if (!fn) {
        throw new Error(
          `INVARIANT: No such infix assertion operator \`${op}\`.`
        );
      }

      yard.tracks.infixAssertionOperator.push(fn);
      break;
  }

  return ids.SEM_OK;
}
