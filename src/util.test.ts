import test from "ava";
import { extractSortValue } from "./util";

test("empty path", t => {
  t.deepEqual(extractSortValue(["foo", "bar"], { id: 1 }), undefined);
});

test("empty value", t => {
  t.deepEqual(extractSortValue(["foo", "bar"], { id: 2, foo: {} }), undefined);
});

test("number", t => {
  t.deepEqual(extractSortValue(["foo", "bar"], { id: 3, foo: { bar: 1 } }), 1);
});

test("string", t => {
  t.deepEqual(
    extractSortValue(["foo", "bar"], { id: 4, foo: { bar: "a" } }),
    "a"
  );
});

test("multi number", t => {
  t.deepEqual(
    extractSortValue(["foo", "bar"], { id: 5, foo: { bar: [2] } }),
    2
  );
});

test("multi string", t => {
  t.deepEqual(
    extractSortValue(["foo", "bar"], { id: 6, foo: { bar: ["b"] } }),
    "b"
  );
});

test("multi string extracts first", t => {
  t.deepEqual(
    extractSortValue(["foo", "bar"], { id: 7, foo: { bar: ["x", "e"] } }),
    "x"
  );
});

test("multi complex object", t => {
  t.deepEqual(
    extractSortValue(["foo", "bar"], { id: 8, foo: { bar: [{ value: "c" }] } }),
    "c"
  );
});

test("multi complex object extracts primary", t => {
  t.deepEqual(
    extractSortValue(["foo", "bar"], {
      id: 9,
      foo: { bar: [{ value: "d" }, { value: "g", primary: true }] }
    }),
    "g"
  );
});

test("traverses nested multi", t => {
  t.deepEqual(
    extractSortValue(["foo", "bar"], { id: 10, foo: [{ bar: [3] }] }),
    3
  );
});
