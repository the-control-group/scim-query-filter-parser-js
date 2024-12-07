[![Build Status](https://travis-ci.org/the-control-group/scim-query-filter-parser-js.svg?branch=master)](https://travis-ci.org/the-control-group/scim-query-filter-parser-js)

## tl;dr

```js
import { compileFilter, compileSorter } from "scim-query-filter-parser";

const results = [{ userName: "somebody123" }, { userName: "somebody456" }]
  .filter(compileFilter('userName eq "somebody123"'))
  .sort(compileSorter("userName"));
```

## Description

This implements a parser and compiler for the [filtering](https://tools.ietf.org/html/rfc7644#section-3.4.2.2), [sorting](https://tools.ietf.org/html/rfc7644#section-3.4.2.3), and [path](https://tools.ietf.org/html/rfc7644#section-3.5.2) features defined in System for Cross-Domain Identity Management (SCIM) Protocol 2.0. It was originally built for use by [AuthX](https://github.com/the-control-group/authx);

## Methods & Properties

### `compileFilter(input: string): (data: any) => boolean`

Compile a SCIM filter expression into a function.

### `compileSorter(input: string): (a: any, b: any) => -1 | 0 | 1`

Compile a SCIM sort expression into a function.

### `compilePath(input: string): { path: string, filter?: Expression, subpath?: string }`

Compile a SCIM PATCH path into a path, with an optional subpath and filter expression function. The subpath will only be present if there's a filter separating it from the path. Otherwise, the path includes the subpath. The compiled path may then be used to differentiate paths with or without filters, subpaths, etc.
