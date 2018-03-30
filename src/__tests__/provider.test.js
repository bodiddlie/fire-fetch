import React from 'react';
import { mount } from 'enzyme';
import firebase from 'firebase';

import FirebaseProvider, { FirebaseApp, withFbApp } from '../provider';

jest.mock('firebase');

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
