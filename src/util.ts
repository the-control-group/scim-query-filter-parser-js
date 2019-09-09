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
    key => segment.localeCompare(key, undefined, { sensitivity: "base" }) === 0
  );

  if (key === undefined) {
    return [];
  }

  const value = resource[key];
  if (remaining.length) {
    return traverse(remaining, value);
  }

  return [value];
}
