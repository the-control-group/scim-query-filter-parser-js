import test from "ava";
import { compileFilter, compileSorter } from "./index";

// Specification and examples are defined here:
// https://tools.ietf.org/html/rfc7644#section-3.4.2.2

test("compileFilter() [invalid filter] - should error on invalid syntax", t => {
  t.throws(() => {
    compileFilter('userName eq ("some" thing');
  });
});
test("compileFilter() [invalid filter] - should error on unknown operator", t => {
  t.throws(() => {
    compileFilter('userName ba "foo"');
  });
});
test("compileFilter() [invalid filter] - should error on invalid JSON string", t => {
  t.throws(() => {
    compileFilter('userName eq "foo');
  });
});

const db = [
  {
    id: "75d350df-e2be-4f09-9c9a-f16f510e18b5",
    userName: "crouppulled",
    displayName: "Croup Pulled",
    name: {
      formatted: "Croup Pulled",
      familyName: "Pulled",
      givenName: "Croup"
    },
    emails: [
      { value: "crouppulled@example.com", type: "work", primary: true },
      { value: "crouppulled@example.org", type: "home", primary: false }
    ],
    active: true
  },
  {
    id: "da5364b5-5da2-4f55-b13c-75d350dfbdae",
    userName: "degreeskim",
    displayName: "Degre Eskim",
    name: {
      formatted: "Degre Eskim",
      familyName: "Eskim",
      givenName: "Degre"
    },
    emails: [{ value: "degreeskim@example.com", type: "work", primary: true }],
    active: false
  },
  {
    id: "df0fec8d-ca1b-41da-9cd4-0a955d47fd6e",
    userName: "gauzebrennand",
    displayName: "Gauze Brennand",
    name: {
      formatted: "Gauze Brennand",
      familyName: "Brennand",
      givenName: "Gauze"
    },
    emails: [
      { value: "gauzebrennand@example.com", type: "work", primary: true }
    ]
  },
  {
    id: "7fe14935-f678-4aeb-a21c-748924f4e6f9",
    userName: "impetuousnapkin",
    displayName: "Impet Uousnapkin",
    name: {
      formatted: "Impet Uousnapkin",
      familyName: "Uousnapkin",
      givenName: "Impet"
    },
    emails: [
      { value: "impetuousnapkin@example.com", type: "home", primary: true }
    ]
  }
];

test("compileFilter() - supports the `pr` operator", t => {
  const filter = compileFilter("active pr");
  const results = db.filter(filter);
  t.deepEqual(
    results.map(({ id }) => id),
    [
      "75d350df-e2be-4f09-9c9a-f16f510e18b5",
      "da5364b5-5da2-4f55-b13c-75d350dfbdae"
    ]
  );
});

test("compileFilter() - supports the `eq` operator", t => {
  const filter = compileFilter('id eq "75d350df-e2be-4f09-9c9a-f16f510e18b5"');
  const results = db.filter(filter);
  t.deepEqual(
    results.map(({ id }) => id),
    ["75d350df-e2be-4f09-9c9a-f16f510e18b5"]
  );
});

test("compileFilter() - supports the `co` operator", t => {
  const filter = compileFilter('id co "e2be"');
  const results = db.filter(filter);
  t.deepEqual(
    results.map(({ id }) => id),
    ["75d350df-e2be-4f09-9c9a-f16f510e18b5"]
  );
});

test("compileFilter() - supports the `sw` operator", t => {
  const filter = compileFilter('id sw "75d350df"');
  const results = db.filter(filter);
  t.deepEqual(
    results.map(({ id }) => id),
    ["75d350df-e2be-4f09-9c9a-f16f510e18b5"]
  );
});

test("compileFilter() - supports the `gt` operator", t => {
  const filter = compileFilter('id gt "da5364b5-5da2-4f55-b13c-75d350dfbdae"');
  const results = db.filter(filter);
  t.deepEqual(
    results.map(({ id }) => id),
    ["df0fec8d-ca1b-41da-9cd4-0a955d47fd6e"]
  );
});

test("compileFilter() - supports the `ge` operator", t => {
  const filter = compileFilter('id ge "da5364b5-5da2-4f55-b13c-75d350dfbdae"');
  const results = db.filter(filter);
  t.deepEqual(
    results.map(({ id }) => id),
    [
      "da5364b5-5da2-4f55-b13c-75d350dfbdae",
      "df0fec8d-ca1b-41da-9cd4-0a955d47fd6e"
    ]
  );
});

test("compileFilter() - supports the `lt` operator", t => {
  const filter = compileFilter('id lt "7fe14935-f678-4aeb-a21c-748924f4e6f9"');
  const results = db.filter(filter);
  t.deepEqual(
    results.map(({ id }) => id),
    ["75d350df-e2be-4f09-9c9a-f16f510e18b5"]
  );
});

test("compileFilter() - supports the `le` operator", t => {
  const filter = compileFilter('id le "7fe14935-f678-4aeb-a21c-748924f4e6f9"');
  const results = db.filter(filter);
  t.deepEqual(
    results.map(({ id }) => id),
    [
      "75d350df-e2be-4f09-9c9a-f16f510e18b5",
      "7fe14935-f678-4aeb-a21c-748924f4e6f9"
    ]
  );
});

test("compileFilter() - supports the `and` operator", t => {
  const filter = compileFilter('id co "75d350df" and active eq true');
  const results = db.filter(filter);
  t.deepEqual(
    results.map(({ id }) => id),
    ["75d350df-e2be-4f09-9c9a-f16f510e18b5"]
  );
});

test("compileFilter() - supports the `or` operator", t => {
  const filter = compileFilter(
    'id eq "75d350df-e2be-4f09-9c9a-f16f510e18b5" or id eq "7fe14935-f678-4aeb-a21c-748924f4e6f9"'
  );
  const results = db.filter(filter);
  t.deepEqual(
    results.map(({ id }) => id),
    [
      "75d350df-e2be-4f09-9c9a-f16f510e18b5",
      "7fe14935-f678-4aeb-a21c-748924f4e6f9"
    ]
  );
});

test("compileFilter() - supports nested operators", t => {
  const filter = compileFilter(
    'id co "a21c" or (active pr and userName eq "crouppulled")'
  );
  const results = db.filter(filter);
  t.deepEqual(
    results.map(({ id }) => id),
    [
      "75d350df-e2be-4f09-9c9a-f16f510e18b5",
      "7fe14935-f678-4aeb-a21c-748924f4e6f9"
    ]
  );
});

test("compileFilter() - supports non-string values", t => {
  const filter = compileFilter("active eq true");
  const results = db.filter(filter);
  t.deepEqual(
    results.map(({ id }) => id),
    ["75d350df-e2be-4f09-9c9a-f16f510e18b5"]
  );
});

test("compileFilter() - resolves operators case-insensitively", t => {
  const filter = compileFilter('id Eq "75d350df-e2be-4f09-9c9a-f16f510e18b5"');
  const results = db.filter(filter);
  t.deepEqual(
    results.map(({ id }) => id),
    ["75d350df-e2be-4f09-9c9a-f16f510e18b5"]
  );
});

test("compileFilter() - traverses attributes case-insensitively", t => {
  const filter = compileFilter('USERname eq "crouppulled"');
  const results = db.filter(filter);
  t.deepEqual(
    results.map(({ id }) => id),
    ["75d350df-e2be-4f09-9c9a-f16f510e18b5"]
  );
});

test("compileFilter() - operates on values case-insensitively", t => {
  const filter = compileFilter('id eq "75D350DF-e2be-4F09-9C9A-F16F510E18B5"');
  const results = db.filter(filter);
  t.deepEqual(
    results.map(({ id }) => id),
    ["75d350df-e2be-4f09-9c9a-f16f510e18b5"]
  );
});

test("compileFilter() - traverses complex attributes", t => {
  const filter = compileFilter('name.formatted eq "Croup Pulled"');
  const results = db.filter(filter);
  t.deepEqual(
    results.map(({ id }) => id),
    ["75d350df-e2be-4f09-9c9a-f16f510e18b5"]
  );
});

test("compileFilter() - matches on any matching multi-value attributes", t => {
  const filter = compileFilter('emails.value eq "crouppulled@example.org"');
  const results = db.filter(filter);
  t.deepEqual(
    results.map(({ id }) => id),
    ["75d350df-e2be-4f09-9c9a-f16f510e18b5"]
  );
});

test("compileFilter() - matches on any matching multi-value attributes with shorthand notation", t => {
  const filter = compileFilter('emails eq "crouppulled@example.org"');
  const results = db.filter(filter);
  t.deepEqual(
    results.map(({ id }) => id),
    ["75d350df-e2be-4f09-9c9a-f16f510e18b5"]
  );
});

test("compileFilter() - matching of multi-value attributes is distributive", t => {
  const filter = compileFilter(
    'emails[primary eq true] and emails[type eq "home"]'
  );
  const results = db.filter(filter);
  t.deepEqual(
    results.map(({ id }) => id),
    [
      "75d350df-e2be-4f09-9c9a-f16f510e18b5",
      "7fe14935-f678-4aeb-a21c-748924f4e6f9"
    ]
  );
});

test("compileFilter() - attribute groups limit distributivity", t => {
  const filter = compileFilter('emails[primary eq true and type eq "home"]');
  const results = db.filter(filter);
  t.deepEqual(
    results.map(({ id }) => id),
    ["7fe14935-f678-4aeb-a21c-748924f4e6f9"]
  );
});

test("compileSorter() - ", t => {
  const sorter = compileSorter("foo.bar");
  const results = [
    { id: 10, foo: [{ bar: [3] }] },
    { id: 9, foo: { bar: [{ value: "a" }, { value: "g", primary: true }] } },
    { id: 8, foo: { bar: [{ value: "c" }] } },
    { id: 7, foo: { bar: ["x", "e"] } },
    { id: 6, foo: { bar: ["b"] } },
    { id: 5, foo: { bar: [2] } },
    { id: 4, foo: { bar: "a" } },
    { id: 3, foo: { bar: 1 } },
    { id: 2, foo: {} },
    { id: 1 }
  ].sort(sorter);
  t.deepEqual(
    results.map(({ id }) => id),
    [2, 1, 3, 5, 10, 4, 6, 8, 9, 7]
  );
});
