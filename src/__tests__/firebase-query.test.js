import React from 'react';
import { mount } from 'enzyme';

import { FirebaseQuery } from '../firebase-query';

const Dummy = () => <div>Test</div>;

test('null value with toArray returns empty array', () => {
  const app = makeApp();
  const render = jest.fn((value, loading, ref) => <Dummy />);
  mount(
    <FirebaseQuery fbapp={app} rootPath="" path="" toArray>
      {render}
    </FirebaseQuery>
  );

  expect(render.mock.calls[0][0]).toEqual([]);
});

test('null value without toArray returns null', () => {
  const app = makeApp();
  const render = jest.fn((value, loading, ref) => <Dummy />);
  mount(
    <FirebaseQuery fbapp={app} rootPath="" path="">
      {render}
    </FirebaseQuery>
  );

  expect(render.mock.calls[0][0]).toBeNull();
});

function makeApp() {
  return {
    database: () => {
      return {
        ref: path => ({ path }),
      };
    },
  };
}
