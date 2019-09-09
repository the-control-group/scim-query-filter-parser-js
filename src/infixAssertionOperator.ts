import { ids, utils } from "apg-lib";
import { Yard } from "./Yard";
import { traverse } from "./util";

// TODO: implement unicode string comparisons using
// String.prototype.localeCompare()

function eq(path: string[], value: any, data: any): boolean {
  return traverse(path, data).some((x: any) => {
    const v =
      typeof x === typeof value
        ? x
        : typeof x === "object" &&
          x &&
          Object.prototype.propertyIsEnumerable.call(x, "value") &&
          typeof x.value == typeof value
        ? x.value
        : undefined;

    return typeof v === "string" && typeof value === "string"
      ? value.localeCompare(v, undefined, { sensitivity: "base" }) === 0
      : v === value;
  });
}

function ne(path: string[], value: any, data: any): boolean {
  return traverse(path, data).some((x: any) => {
    const v =
      typeof x === typeof value
        ? x
        : typeof x === "object" &&
          x &&
          Object.prototype.propertyIsEnumerable.call(x, "value") &&
          typeof x.value == typeof value
        ? x.value
        : undefined;

    return typeof v === "string" && typeof value === "string"
      ? value.localeCompare(v, undefined, { sensitivity: "base" }) !== 0
      : v !== value;
  });
}

function co(path: string[], value: any, data: any): boolean {
  return traverse(path, data).some((x: any) => {
    const v =
      typeof x === typeof value
        ? x
        : typeof x === "object" &&
          x &&
          Object.prototype.propertyIsEnumerable.call(x, "value") &&
          typeof x.value == typeof value
        ? x.value
        : undefined;

    return typeof v === "string" && v.includes(value);
  });
}

function sw(path: string[], value: any, data: any): boolean {
  return traverse(path, data).some((x: any) => {
    const v =
      typeof x === typeof value
        ? x
        : typeof x === "object" &&
          x &&
          Object.prototype.propertyIsEnumerable.call(x, "value") &&
          typeof x.value == typeof value
        ? x.value
        : undefined;

    return typeof v === "string" && v.substring(0, value.length) === value;
  });
}

function ew(path: string[], value: any, data: any): boolean {
  return traverse(path, data).some((x: any) => {
    const v =
      typeof x === typeof value
        ? x
        : typeof x === "object" &&
          x &&
          Object.prototype.propertyIsEnumerable.call(x, "value") &&
          typeof x.value == typeof value
        ? x.value
        : undefined;

    return (
      typeof v === "string" &&
      v.length >= value.length &&
      v.substring(v.length - value.length) === value
    );
  });
}

function gt(path: string[], value: any, data: any): boolean {
  return traverse(path, data).some((x: any) => {
    const v =
      typeof x === typeof value
        ? x
        : typeof x === "object" &&
          x &&
          Object.prototype.propertyIsEnumerable.call(x, "value") &&
          typeof x.value == typeof value
        ? x.value
        : undefined;

    return v > value;
  });
}

function ge(path: string[], value: any, data: any): boolean {
  return traverse(path, data).some((x: any) => {
    const v =
      typeof x === typeof value
        ? x
        : typeof x === "object" &&
          x &&
          Object.prototype.propertyIsEnumerable.call(x, "value") &&
          typeof x.value == typeof value
        ? x.value
        : undefined;

    return v >= value;
  });
}

function lt(path: string[], value: any, data: any): boolean {
  return traverse(path, data).some((x: any) => {
    const v =
      typeof x === typeof value
        ? x
        : typeof x === "object" &&
          x &&
          Object.prototype.propertyIsEnumerable.call(x, "value") &&
          typeof x.value == typeof value
        ? x.value
        : undefined;

    return v < value;
  });
}

function le(path: string[], value: any, data: any): boolean {
  return traverse(path, data).some((x: any) => {
    {
      const v =
        typeof x === typeof value
          ? x
          : typeof x === "object" &&
            x &&
            Object.prototype.propertyIsEnumerable.call(x, "value") &&
            typeof x.value == typeof value
          ? x.value
          : undefined;

      return v <= value;
    }
  });
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
      const op = utils
        .charsToString(chars, phraseIndex, phraseLength)
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
