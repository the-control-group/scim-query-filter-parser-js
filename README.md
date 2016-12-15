Synopsis
--------

This implements a parser for the filtering syntax [defined in  System for Cross-Domain Identity Management (SCIM) Protocol 1.1](http://www.simplecloud.info/specs/draft-scim-api-01.html#rfc.section.3.2.2.1). It is a direct port of [scim-query-filter-parser-rb](https://github.com/ingydotnet/scim-query-filter-parser-rb) which is in Ruby.

```js
    const Filter = require('scim-query-filter-parser');

    const filter = new Filter(filterQueryString);

    // get the parsed filter as an RPN stack
    const rpn = filter.rpn;

    // get the parsed filter as an expression tree
    const tree = filter.tree;
```

Description
-----------

The SCIM spec describes a simple filter query language here:
http://www.simplecloud.info/specs/draft-scim-api-01.html#query-resources

This package can parse one of these filter queries and produce a [Reverse Polish
Notation (RPN) stack representation](https://en.wikipedia.org/wiki/Reverse_Polish_notation).

For example, parse this filter query string:

```
userType eq "Employee" and (emails co "example.com" or emails co "example.org")
```

Into this RPN stack (array):

```js
['userType', '"Employee"', 'eq', 'emails', '"example.com"', 'co', 'emails', '"example.org"', 'co', 'or', 'and']
```

Or, optionally into this expression tree:

```js
['and', ['eq', 'userType', '"Employee"'], ['or', ['co', 'emails', '"example.com"'], ['co', 'emails', '"example.org"']]]
```

= Methods

`const filter = new Filter(filterQueryString);`:
    Parse a SCIM filter query and return a `Filter` object.

`const rpn = filter.rpn;`:
    Get the RPN array created by the most recent parse.

`const tree = filter.tree;`::
    Get the parse result converted to a tree form.
