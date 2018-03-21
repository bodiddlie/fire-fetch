import React from 'react';
import { mount } from 'enzyme';
import firebase from 'firebase';

jest.mock('firebase');

import FirebaseProvider, { FirebaseApp, withFbApp } from '../provider';

const config = { test: 'test' };

const fbapp = { id: 1 };

test('provider renders null if the app doesnt exist', () => {
  firebase.initializeApp.mockImplementationOnce(() => null);
  const wrapper = mount(
    <FirebaseProvider config={config}>
      <div>Hi</div>
    </FirebaseProvider>
  );
  expect(wrapper.find(FirebaseApp).children().length).toBe(0);
});

test('provider renders children if app exists', () => {
  const wrapper = mount(
    <FirebaseProvider config={config}>
      <div>Hi</div>
    </FirebaseProvider>
  );

  expect(wrapper.contains(<div>Hi</div>)).toBeTruthy();
});

test('provider gives fbapp as context', () => {
  const wrapper = mount(
    <FirebaseProvider config={config}>
      <div>Hi</div>
    </FirebaseProvider>
  );
  expect(wrapper.instance().getChildContext()).toHaveProperty('fbapp');
});

test('calls the render prop method if passed as render', () => {
  const render = jest.fn(() => <div />);
  const wrapper = mount(<FirebaseApp render={render} />, {
    context: { fbapp },
  });

  expect(render).toBeCalledWith(fbapp);
});

test('calls the render prop method is passed as children', () => {
  const render = jest.fn(() => <div />);
  const wrapper = mount(<FirebaseApp>{render}</FirebaseApp>, {
    context: { fbapp },
  });

  expect(render).toBeCalledWith(fbapp);
});

test('withFbApp HOC passes fbapp as prop', () => {
  const Inner = props => <div>Hi</div>;
  const MyComponent = withFbApp(Inner);
  const wrapper = mount(
    <FirebaseProvider config={config}>
      <MyComponent />
    </FirebaseProvider>
  );

  expect(wrapper.find(Inner).props().fbapp).toEqual(fbapp);
});
