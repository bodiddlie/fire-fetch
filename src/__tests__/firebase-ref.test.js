import React from 'react';
import { mount } from 'enzyme';

import { FirebaseRef } from '../firebase-ref';

const Dummy = () => <div>Test</div>;

const rootPath = 'app/root';
const path = 'test/path';

test('<FirebaseRef /> returns singular ref if given single path', () => {
  const fbapp = makeApp();
  const render = jest.fn(ref => <Dummy />);
  mount(
    <FirebaseRef fbapp={fbapp} rootPath={rootPath} path={path}>
      {render}
    </FirebaseRef>
  );

  expect(render.mock.calls[0][0].path).toEqual(`${rootPath}/${path}`);
});

test('<FirebaseRef /> returns array of refs if given paths', () => {
  const fbapp = makeApp();
  const render = jest.fn((first, second) => <Dummy />);
  const secondPath = 'second/path';
  mount(
    <FirebaseRef fbapp={fbapp} rootPath={rootPath} paths={[path, secondPath]}>
      {render}
    </FirebaseRef>
  );

  expect(render.mock.calls[0][0].path).toEqual(`${rootPath}/${path}`);
  expect(render.mock.calls[0][1].path).toEqual(`${rootPath}/${secondPath}`);
});

test('<FirebaseRef /> works with render prop passed as render', () => {
  const fbapp = makeApp();
  const render = jest.fn(ref => <Dummy />);
  mount(
    <FirebaseRef
      fbapp={fbapp}
      rootPath={rootPath}
      path={path}
      render={render}
    />
  );

  expect(render.mock.calls[0][0].path).toEqual(`${rootPath}/${path}`);
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
