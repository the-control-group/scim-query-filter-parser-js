export function traverse(path: string[], resource: any): unknown {
  let cursor: any = resource;
  for (let i = 0; i < path.length; i++) {
    if (typeof cursor !== "object" || !cursor) {
      return undefined;
    }

    // Do a case-insensitive lookup of keys.
    const segment = path[i].toLowerCase();
    cursor = Object.keys(cursor).find(key => key.toLowerCase() === segment);
  }

  return cursor;
}
