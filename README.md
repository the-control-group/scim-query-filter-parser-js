[![Build Status](https://travis-ci.org/the-control-group/scim-query-filter-parser-js.svg?branch=master)](https://travis-ci.org/the-control-group/scim-query-filter-parser-js)

## tl;dr

```js
import { compileFilter, compileSorter } from "scim-query-filter-parser";

const results = [{ userName: "somebody123" }, { userName: "somebody456" }]
  .filter(compileFilter('userName eq "somebody123"'))
  .sort(compileSorter("userName"));
```

## Description

This implements a parser and compiler for the [filtering](https://tools.ietf.org/html/rfc7644#section-3.4.2.2) and [sorting](https://tools.ietf.org/html/rfc7644#section-3.4.2.3) features defined in System for Cross-Domain Identity Management (SCIM) Protocol 2.0. It was originally built for use by [AuthX](https://github.com/the-control-group/authx);

## Methods & Properties

### `compileFilter(input: string): (data: any) => boolean`

Compile a SCIM filter expression into a function.

### `compileSorter(input: string): (a: any, b: any) => -1 | 0 | 1`

Compile a SCIM sort expression into a function.
