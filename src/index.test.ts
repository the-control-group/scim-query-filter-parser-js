import test from "ava";
import compile from "./index";

// Specification and examples are defined here:
// https://tools.ietf.org/html/rfc7644#section-3.4.2.2

test("compile() [invalid filter] - should error on invalid syntax", t => {
  t.throws(() => {
    compile('userName eq ("some" thing');
  });
});
test("compile() [invalid filter] - should error on unknown operator", t => {
  t.throws(() => {
    compile('userName ba "foo"');
  });
});
test("compile() [invalid filter] - should error on invalid JSON string", t => {
  t.throws(() => {
    compile('userName eq "foo');
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
      { value: "crouppulled@example.org", type: "work", primary: true }
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
      { value: "impetuousnapkin@example.com", type: "work", primary: true }
    ]
  }
  // {
  //   id: '803eba9d-1e73-40e6-9630-225533bed0d3',
  //   userName: 'sulkyode',
  //   displayName: 'Sulky Ode',
  //   name: {formatted: 'Sulky Ode', familyName: 'Ode', givenName: 'Sulky'},
  //   emails: [{value: 'sulkyode@example.com', type: 'work', primary: true}],
  // },
  // {
  //   id: 'cfcbb3b8-9986-4e4d-951e-ab93e11649aa',
  //   userName: 'dewpegasus',
  //   displayName: 'Dewpe Gasus',
  //   name: {formatted: 'Dewpe Gasus', familyName: 'Gasus', givenName: 'Dewpe'},
  //   emails: [{value: 'dewpegasus@example.com', type: 'work', primary: true}],
  // },
  // {
  //   id: 'a4b32adb-b38e-4258-8a30-8e02bcd83692',
  //   userName: 'laugherncelery',
  //   displayName: 'Laugh Erncelery',
  //   name: {formatted: 'Laugh Erncelery', familyName: 'Erncelery', givenName: 'Laugh'},
  //   emails: [{value: 'laugherncelery@example.com', type: 'work', primary: true}],
  // },
];

test("filter - should support the `pr` operator", t => {
  const filter = compile("active pr");
  const results = db.filter(filter);
  t.deepEqual(results.length, 2);
  t.deepEqual(results[0].id, "75d350df-e2be-4f09-9c9a-f16f510e18b5");
  t.deepEqual(results[1].id, "da5364b5-5da2-4f55-b13c-75d350dfbdae");
});

test("filter - should support the `eq` operator", t => {
  const filter = compile('id eq "75d350df-e2be-4f09-9c9a-f16f510e18b5"');
  const results = db.filter(filter);
  t.deepEqual(results.length, 1);
  t.deepEqual(results[0].id, "75d350df-e2be-4f09-9c9a-f16f510e18b5");
});

test("filter - should support the `co` operator", t => {
  const filter = compile('id co "e2be"');
  const results = db.filter(filter);
  t.deepEqual(results.length, 1);
  t.deepEqual(results[0].id, "75d350df-e2be-4f09-9c9a-f16f510e18b5");
});

test("filter - should support the `sw` operator", t => {
  const filter = compile('id sw "75d350df"');
  const results = db.filter(filter);
  t.deepEqual(results.length, 1);
  t.deepEqual(results[0].id, "75d350df-e2be-4f09-9c9a-f16f510e18b5");
});

test("filter - should support the `gt` operator", t => {
  const filter = compile('id gt "da5364b5-5da2-4f55-b13c-75d350dfbdae"');
  const results = db.filter(filter);
  t.deepEqual(results.length, 1);
  t.deepEqual(results[0].id, "df0fec8d-ca1b-41da-9cd4-0a955d47fd6e");
});

test("filter - should support the `ge` operator", t => {
  const filter = compile('id ge "da5364b5-5da2-4f55-b13c-75d350dfbdae"');
  const results = db.filter(filter);
  t.deepEqual(results.length, 2);
  t.deepEqual(results[0].id, "da5364b5-5da2-4f55-b13c-75d350dfbdae");
  t.deepEqual(results[1].id, "df0fec8d-ca1b-41da-9cd4-0a955d47fd6e");
});

test("filter - should support the `lt` operator", t => {
  const filter = compile('id lt "7fe14935-f678-4aeb-a21c-748924f4e6f9"');
  const results = db.filter(filter);
  t.deepEqual(results.length, 1);
  t.deepEqual(results[0].id, "75d350df-e2be-4f09-9c9a-f16f510e18b5");
});

test("filter - should support the `le` operator", t => {
  const filter = compile('id le "7fe14935-f678-4aeb-a21c-748924f4e6f9"');
  const results = db.filter(filter);
  t.deepEqual(results.length, 2);
  t.deepEqual(results[0].id, "75d350df-e2be-4f09-9c9a-f16f510e18b5");
  t.deepEqual(results[1].id, "7fe14935-f678-4aeb-a21c-748924f4e6f9");
});

test("filter - should support the `and` operator", t => {
  const filter = compile('id co "75d350df" and active eq true');
  const results = db.filter(filter);
  t.deepEqual(results.length, 1);
  t.deepEqual(results[0].id, "75d350df-e2be-4f09-9c9a-f16f510e18b5");
});

test("filter - should support the `or` operator", t => {
  const filter = compile(
    'id eq "75d350df-e2be-4f09-9c9a-f16f510e18b5" or id eq "7fe14935-f678-4aeb-a21c-748924f4e6f9"'
  );
  const results = db.filter(filter);
  t.deepEqual(results.length, 2);
  t.deepEqual(results[0].id, "75d350df-e2be-4f09-9c9a-f16f510e18b5");
  t.deepEqual(results[1].id, "7fe14935-f678-4aeb-a21c-748924f4e6f9");
});

test("filter - should support nested operators", t => {
  const filter = compile(
    'id co "a21c" or (active pr and userName eq "crouppulled")'
  );
  const results = db.filter(filter);
  t.deepEqual(results.length, 2);
  t.deepEqual(results[0].id, "75d350df-e2be-4f09-9c9a-f16f510e18b5");
  t.deepEqual(results[1].id, "7fe14935-f678-4aeb-a21c-748924f4e6f9");
});

test("filter - should support non-string values", t => {
  const filter = compile("active eq true");
  const results = db.filter(filter);
  t.deepEqual(results.length, 1);
  t.deepEqual(results[0].id, "75d350df-e2be-4f09-9c9a-f16f510e18b5");
});

test("filter - should resolve operators case-insensitively", t => {
  const filter = compile('id Eq "75d350df-e2be-4f09-9c9a-f16f510e18b5"');
  const results = db.filter(filter);
  t.deepEqual(results.length, 1);
  t.deepEqual(results[0].id, "75d350df-e2be-4f09-9c9a-f16f510e18b5");
});

test("filter - should traverse attributes case-insensitively", t => {
  const filter = compile('USERname eq "crouppulled"');
  const results = db.filter(filter);
  t.deepEqual(results.length, 1);
  t.deepEqual(results[0].id, "75d350df-e2be-4f09-9c9a-f16f510e18b5");
});

test("filter - should operate on values case-insensitively", t => {
  const filter = compile('id eq "75D350DF-e2be-4F09-9C9A-F16F510E18B5"');
  const results = db.filter(filter);
  t.deepEqual(results.length, 1);
  t.deepEqual(results[0].id, "75d350df-e2be-4f09-9c9a-f16f510e18b5");
});

test("filter - should traverse complex attributes", t => {
  const filter = compile('name.formatted eq "Croup Pulled"');
  const results = db.filter(filter);
  t.deepEqual(results.length, 1);
  t.deepEqual(results[0].id, "75d350df-e2be-4f09-9c9a-f16f510e18b5");
});

test("filter - should match on any matching multi-value attributes", t => {
  const filter = compile('emails eq "crouppulled@example.org"');
  const results = db.filter(filter);
  t.deepEqual(results.length, 1);
  t.deepEqual(results[0].id, "75d350df-e2be-4f09-9c9a-f16f510e18b5");
});
