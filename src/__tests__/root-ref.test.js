import React from 'react';
import { mount } from 'enzyme';

import RootRef, { GetRootRef, withRootRef } from '../root-ref';

const Dummy = () => <div>Hi</div>;
const path = 'test/path';

test('<RootRef /> sets empty string as rootPath if none provided', () => {
  const wrapper = mount(
    <RootRef>
      <Dummy />
    </RootRef>
  );
  expect(wrapper.state().rootPath).toEqual('');
});

test('<RootRef /> uses passed path as rootPath', () => {
  const wrapper = mount(
    <RootRef path={path}>
      <Dummy />
    </RootRef>
  );
  expect(wrapper.state().rootPath).toEqual(path);
});

test('<RootRef /> sets rootPath when updated', () => {
  const wrapper = mount(
    <RootRef>
      <Dummy />
    </RootRef>
  );
  expect(wrapper.state().rootPath).toEqual('');
  wrapper.setProps({ path });
  expect(wrapper.state().rootPath).toEqual(path);
});

test('<GetRootRef /> uses render prop when passed as render', () => {
  const render = jest.fn(rootPath => <Dummy />);
  const wrapper = mount(
    <RootRef path={path}>
      <GetRootRef render={render} />
    </RootRef>
  );

  expect(render).toHaveBeenCalledWith(path);
});

test('<GetRootRef /> uses render prop when passed as children', () => {
  const render = jest.fn(rootPath => <Dummy />);
  const wrapper = mount(
    <RootRef path={path}>
      <GetRootRef>{render}</GetRootRef>
    </RootRef>
  );

  expect(render).toHaveBeenCalledWith(path);
});

test('withRootRef passes rootPath on to component', () => {
  const MyComponent = withRootRef(Dummy);
  const wrapper = mount(
    <RootRef path={path}>
      <MyComponent />
    </RootRef>
  );

  expect(
    wrapper
      .find(Dummy)
      .first()
      .props().rootPath
  ).toEqual(path);
});
