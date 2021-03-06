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

test('calls orderByChild if given', () => {
  const app = makeApp();
  const render = jest.fn((value, loading, ref) => <Dummy />);
  mount(
    <FirebaseQuery fbapp={app} rootPath="root" path="test" orderByChild on>
      {render}
    </FirebaseQuery>
  );

  expect(render.mock.calls[1][2].orderByChild).toHaveBeenCalled();
});

test('uses passed ref if given', () => {
  const myRef = makeRef('myref');
  const render = jest.fn((value, loading, ref) => <Dummy />);
  mount(
    <FirebaseQuery reference={myRef} on>
      {render}
    </FirebaseQuery>
  );

  expect(render.mock.calls[1][2]).toEqual(myRef);
});

test('calls equalTo if given', () => {
  const app = makeApp();
  const render = jest.fn((value, loading, ref) => <Dummy />);
  mount(
    <FirebaseQuery fbapp={app} rootPath="root" path="test" equalTo="test" on>
      {render}
    </FirebaseQuery>
  );

  expect(render.mock.calls[1][2].equalTo).toHaveBeenCalledWith('test');
});

test('calls equalTo if given false', () => {
  const app = makeApp();
  const render = jest.fn((value, loading, ref) => <Dummy />);
  mount(
    <FirebaseQuery fbapp={app} rootPath="root" path="test" equalTo={false} on>
      {render}
    </FirebaseQuery>
  );

  expect(render.mock.calls[1][2].equalTo).toHaveBeenCalledWith(false);
});

test('calls limitToLast if given', () => {
  const app = makeApp();
  const render = jest.fn((value, loading, ref) => <Dummy />);
  mount(
    <FirebaseQuery
      fbapp={app}
      rootPath="root"
      path="test"
      limitToLast="test"
      on
    >
      {render}
    </FirebaseQuery>
  );

  expect(render.mock.calls[1][2].limitToLast).toHaveBeenCalledWith('test');
});

test('sets the value if on is given', () => {
  const app = makeApp();
  const render = jest.fn((value, loading, ref) => <Dummy />);
  mount(
    <FirebaseQuery fbapp={app} rootPath="root" path="test" on>
      {render}
    </FirebaseQuery>
  );

  expect(render.mock.calls[1][0].value).toEqual('testvalue');
});

test('sets to an array if given toArray', () => {
  const app = makeApp();
  const render = jest.fn((value, loading, ref) => <Dummy />);
  mount(
    <FirebaseQuery fbapp={app} rootPath="root" path="test" on toArray>
      {render}
    </FirebaseQuery>
  );

  expect(render.mock.calls[1][0]).toEqual(['testvalue']);
});

test('calls the onchange handler with the value if given', () => {
  const app = makeApp();
  const render = jest.fn((value, loading, ref) => <Dummy />);
  const onchange = jest.fn();
  mount(
    <FirebaseQuery
      fbapp={app}
      rootPath="root"
      path="test"
      on
      toArray
      onChange={onchange}
    >
      {render}
    </FirebaseQuery>
  );

  expect(render.mock.calls[1][0]).toEqual(['testvalue']);
  expect(onchange).toHaveBeenCalledWith(['testvalue']);
});

test('sets the value if once is given', () => {
  const app = makeApp();
  const render = jest.fn((value, loading, ref) => <Dummy />);
  mount(
    <FirebaseQuery fbapp={app} rootPath="root" path="test" once>
      {render}
    </FirebaseQuery>
  );

  expect(render.mock.calls[1][0].value).toEqual('testvalue');
});

test('sets to an array if given to array', () => {
  const app = makeApp();
  const render = jest.fn((value, loading, ref) => <Dummy />);
  mount(
    <FirebaseQuery fbapp={app} rootPath="root" path="test" once toArray>
      {render}
    </FirebaseQuery>
  );

  expect(render.mock.calls[1][0]).toEqual(['testvalue']);
});

test('calls the onchange handler with the value if given', () => {
  const app = makeApp();
  const render = jest.fn((value, loading, ref) => <Dummy />);
  const onchange = jest.fn();
  mount(
    <FirebaseQuery
      fbapp={app}
      rootPath="root"
      path="test"
      once
      toArray
      onChange={onchange}
    >
      {render}
    </FirebaseQuery>
  );

  expect(render.mock.calls[1][0]).toEqual(['testvalue']);
  expect(onchange).toHaveBeenCalledWith(['testvalue']);
});

test('calls off when unmounted', () => {
  const app = makeApp();
  const myRef = makeRef('myref');
  const render = jest.fn((value, loading, ref) => <Dummy />);
  const wrapper = mount(
    <FirebaseQuery fbapp={app} reference={myRef} once toArray>
      {render}
    </FirebaseQuery>
  );
  wrapper.unmount();

  expect(myRef.off).toHaveBeenCalled();
});

test('detaches old ref if it needs to be updated', () => {
  const app = makeApp();
  const myRef = makeRef('myref');
  const render = jest.fn((value, loading, ref) => <Dummy />);
  const wrapper = mount(
    <FirebaseQuery fbapp={app} reference={myRef} once toArray>
      {render}
    </FirebaseQuery>
  );
  const preUpdateRef = wrapper.instance().ref;
  wrapper.setProps({ path: 'newPath' });
  expect(preUpdateRef.off).toHaveBeenCalled();
});

test('attaches new ref if it needs to be updated', () => {
  const app = makeApp();
  const render = jest.fn((value, loading, ref) => <Dummy />);
  const wrapper = mount(
    <FirebaseQuery fbapp={app} once toArray>
      {render}
    </FirebaseQuery>
  );
  const originalRef = wrapper.instance().ref;
  wrapper.setProps({ path: 'newPath' });
  wrapper.update();
  expect(wrapper.instance().ref).not.toBe(originalRef);
});

test('updates on any ref impacting prop', () => {
  const app = makeApp();
  const render = jest.fn((value, loading, ref) => <Dummy />);
  const propsThatUpdateRef = {
    fbapp: makeApp(),
    rootPath: 'newRootPath',
    path: 'newPath',
    reference: makeRef('someOtherPath'),
    on: () => {},
    toArray: true,
    onChange: () => {},
    once: true,
    orderByChild: 'someStringToOrderBy',
    equalTo: 'string',
    limitToLast: 5,
  };
  Object.keys(propsThatUpdateRef).forEach(keyThatUpdates => {
    const newProp = { [keyThatUpdates]: propsThatUpdateRef[keyThatUpdates] };
    const wrapper = mount(<FirebaseQuery fbapp={app}>{render}</FirebaseQuery>);
    const originalRef = wrapper.instance().ref;
    wrapper.setProps(newProp);
    wrapper.update();
    const newRef = wrapper.instance().ref;

    expect(originalRef.off).toHaveBeenCalled();
    expect(newRef).not.toBe(originalRef);
  });
});

test('it calls on if updateOnValue is true', () => {
  const app = makeApp();
  const render = jest.fn((value, loading, ref) => <Dummy />);
  mount(
    <FirebaseQuery fbapp={app} rootPath="root" path="test" updateOnValue>
      {render}
    </FirebaseQuery>
  );

  expect(render.mock.calls[1][2].on.mock.calls[0][0]).toBe('value');
});

test('it calls on with the given child event if a string is given', () => {
  const app = makeApp();
  const render = jest.fn((value, loading, ref) => <Dummy />);
  mount(
    <FirebaseQuery fbapp={app} rootPath="root" path="test" on="child_added">
      {render}
    </FirebaseQuery>
  );

  expect(render.mock.calls[1][2].on.mock.calls[0][0]).toBe('child_added');
});

test('it call once with the given child event if a string is given', () => {
  const app = makeApp();
  const render = jest.fn((value, loading, ref) => <Dummy />);
  mount(
    <FirebaseQuery fbapp={app} rootPath="root" path="test" once="child_added">
      {render}
    </FirebaseQuery>
  );

  expect(render.mock.calls[1][2].once.mock.calls[0][0]).toBe('child_added');
});
//---------------------------------------------
// UTIL
//---------------------------------------------
function makeApp() {
  return {
    database: () => {
      return {
        ref: path => makeRef(path),
      };
    },
  };
}

function makeRef(path) {
  const ref = {
    path,
  };
  ref.orderByChild = jest.fn(() => ref);
  ref.equalTo = jest.fn(() => ref);
  ref.limitToLast = jest.fn(() => ref);
  ref.on = jest.fn((event, cb) => {
    cb({ val: () => ({ value: 'testvalue' }) });
  });
  ref.once = jest.fn((event, cb) => {
    cb({ val: () => ({ value: 'testvalue' }) });
  });
  ref.off = jest.fn();
  return ref;
}
