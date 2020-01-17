const collator = new Intl.Collator(undefined, { sensitivity: "base" });
export function traverse(path: string[], resource: any): unknown[] {
  if (typeof resource !== "object" || !resource) {
    return [];
  }

  if (Array.isArray(resource)) {
    return resource
      .map(resource => traverse(path, resource))
      .reduce((l, r) => [...l, ...r]);
  }

  const [segment, ...remaining] = path;
  const key = Object.keys(resource).find(
    key => collator.compare(segment, key) === 0
  );

  if (key === undefined) {
    return [];
  }

  const value = resource[key];
  if (remaining.length) {
    return traverse(remaining, value);
  }

  return Array.isArray(value) ? value : [value];
}

export function extractSortValue(path: string[], data: any): any {
  const raw = traverse(path, data);
  const normalized: any[] = [];
  for (let i = 0; i <= raw.length; i++) {
    const x = raw[i];

    // Use a scalar value.
    if (
      typeof x === "string" ||
      typeof x === "number" ||
      typeof x === "boolean"
    ) {
      if (
        Object.prototype.propertyIsEnumerable.call(x, "primary") &&
        (x as any).primary === true
      ) {
        return x;
      }

      normalized.push(x);
      continue;
    }

    // Descend into the "value" attribute of a "multi-value" object.
    if (
      typeof x === "object" &&
      x &&
      Object.prototype.propertyIsEnumerable.call(x, "value")
    ) {
      const v = (x as any).value;
      if (
        typeof v === "string" ||
        typeof v === "number" ||
        typeof v === "boolean"
      ) {
        // If one is marked as primary, use this one.
        if (
          Object.prototype.propertyIsEnumerable.call(x, "primary") &&
          (x as any).primary === true
        ) {
          return v;
        }

        normalized.push(v);
        continue;
      }
    }
  }

  // If we didn't encounter a "primary" value, return the first one.
  return normalized[0];
}
