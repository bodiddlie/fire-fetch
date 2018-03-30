import React from 'react';
import { mount } from 'enzyme';

import {
  AuthListener,
  signInProvider,
  signInEmail,
  signOut,
  providers,
} from '../auth-listener';

const Dummy = () => <div>Test</div>;

const mockcb = cb => {
  cb({ test: 'test' });
  return jest.fn();
};
const onAuthStateChanged = jest.fn();
const signInWithRedirect = jest.fn();
const signInWithPopup = jest.fn();
const createUserWithEmailAndPassword = jest.fn();
const signInWithEmailAndPassword = jest.fn();
const mockSignOut = jest.fn();

test('sets a subscription when it mounts', () => {
  jest.resetAllMocks();
  onAuthStateChanged.mockImplementation(mockcb);
  const fbapp = makeApp();
  const render = jest.fn(user => <Dummy />);
  const wrapper = mount(<AuthListener fbapp={fbapp}>{render}</AuthListener>);
  expect(onAuthStateChanged).toHaveBeenCalled();
  const unsub = jest.fn();
  wrapper.instance().unsubscribe = unsub;
  wrapper.unmount();
  expect(unsub).toHaveBeenCalled();
});

test('signs in via redirect with a given provider', () => {
  jest.resetAllMocks();
  const fbapp = makeApp();
  signInProvider(fbapp, providers.google, true);
  expect(signInWithRedirect).toHaveBeenCalledWith(providers.google);
});

test('signs in via popup with a given provider', () => {
  jest.resetAllMocks();
  const fbapp = makeApp();
  signInProvider(fbapp, providers.google, false);
  expect(signInWithPopup).toHaveBeenCalledWith(providers.google);
});

test('creates a new user with email and password', () => {
  jest.resetAllMocks();
  const fbapp = makeApp();
  signInEmail(fbapp, 'email', 'password', true);
  expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
    'email',
    'password'
  );
});

test('signs in with email and password', () => {
  jest.resetAllMocks();
  const fbapp = makeApp();
  signInEmail(fbapp, 'email', 'password', false);
  expect(signInWithEmailAndPassword).toHaveBeenCalledWith('email', 'password');
});

test('can sign out of firebase', () => {
  jest.resetAllMocks();
  const fbapp = makeApp();
  signOut(fbapp);
  expect(mockSignOut).toHaveBeenCalledTimes(1);
});

test('<AuthListener /> uses render prop when passed render', () => {
  jest.resetAllMocks();
  const render = jest.fn(user => <Dummy />);
  onAuthStateChanged.mockImplementation(mockcb);
  const fbapp = makeApp();
  mount(<AuthListener fbapp={fbapp} render={render} />);
  expect(render).toHaveBeenCalledWith({ test: 'test' });
});

test('<AuthListener /> uses children as render prop', () => {
  jest.resetAllMocks();
  const render = jest.fn(user => <Dummy />);
  onAuthStateChanged.mockImplementation(mockcb);
  const fbapp = makeApp();
  mount(<AuthListener fbapp={fbapp}>{render}</AuthListener>);
  expect(render).toHaveBeenCalledWith({ test: 'test' });
});

//---------------------------
// UTILS
//---------------------------

function makeApp() {
  return {
    auth: () => ({
      onAuthStateChanged,
      signInWithRedirect,
      signInWithPopup,
      createUserWithEmailAndPassword,
      signInWithEmailAndPassword,
      signOut: mockSignOut,
    }),
  };
}
