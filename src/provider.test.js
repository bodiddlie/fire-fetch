import React from 'react';
import { mount } from 'enzyme';

import FirebaseProvider, { FirebaseApp, withFbApp } from './provider';

const config = { test: 'test' };

test('calls the render prop method', () => {
  const render = jest.fn(() => <div />);
  const wrapper = mount(
    <FirebaseProvider config={config}>
      <FirebaseApp render={render} />
    </FirebaseProvider>
  );

  expect(render).toBeCalled();
});

test('withFbApp HOC passes fbapp as prop', () => {
  const MyComponent = withFbApp(() => <div />);
  const wrapper = mount(<MyComponent />, { context: { fbapp: { id: 1 } } });

  expect(
    wrapper
      .children()
      .first()
      .props().fbapp
  ).not.toBeNull();
});
