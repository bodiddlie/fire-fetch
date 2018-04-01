import { objectToArray } from '../util';

test('null returns empty array', () => {
  expect(objectToArray(null)).toEqual([]);
});

test('undefined return empty array', () => {
  expect(objectToArray()).toEqual([]);
});

test('empty object returns array', () => {
  expect(objectToArray({})).toEqual([]);
});

test('normalized object returns array', () => {
  const first = { id: 1, name: 'first' };
  const second = { id: 2, name: 'second' };
  const obj = { 1: first, 2: second };
  expect(objectToArray(obj)).toEqual([first, second]);
});
