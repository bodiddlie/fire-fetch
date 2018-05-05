# Fire-fetch

A set of React components to provide basic [firebase](https://firebase.google.com) realt-time database and auth functionality in a declarative fashion.

## The problem

The standard firebase API has a very imperative style, requiring you to have a lot of imperative code
in your React components' lifecycle methods. React encourages and favors a more declarative style of writing code.

## The solution

The `fire-fetch` library provides a set of React components that wrap some of the basic functionality of the real-time database and authentication features of firebase. Instead of having to deal with a lot of imperative code in your lifecycles, you can use these components to declaratively access your firebase data and perform authentication actions.

**What this library is not**

`fire-fetch` is not a full replacement for the firebase api. This library was initially built to meet the needs of an app I was working on. I have open-sourced it with the intention of adding more functionality over time. The library does **not** currently cover all the functionality of the real-time database and authentication. If there is something missing that you want, I welcome all PRs and other contributions!

## Installation

This library is distributed via [npm](https://www.npmjs.com) which comes with [node](https://nodejs.org):

```
npm install --save fire-fetch
```

Alternatively, you can use [yarn](https://yarnpkg.com) to add it to your project:

```
yarn add fire-fetch
```

This library has a `peerDependencies` listing for `react`.

## Usage

```javascript
import React from 'react';
import {FirebaseProvider, AuthListener, RootRef, FirebaseQuery} from 'fire-fetch';

const config = {
  //firebase config goes in here, see official firebase docs for details
};

function App() {
  return (
    <FirebaseProvider config={config}>
      <AuthListener>
        {user => (
          {user === null (
            <div>Loading</div>
          ) : (
            <React.Fragment>
              {user ? (
                <RootRef path={`/users/${user.uid}`}>
                  <FirebaseQuery path="todos" toArray on>
                    {todos => (
                      <ul>
                        {todos.map(t => <li key={t.id}>{t.name}</li>)}
                      </ul>
                    )}
                  </FirebaseQuery>
                </RootRef>
              ) : (
                <LoginComponent />
              )}
            </React.Fragment>
          )
        )}
      </AuthListener>
    </FirebaseProvider>
  )
}
```

## Components

---

### FirebaseProvider

This is the root component for using firebase in your app. It will attempt to initialize a firebase app using a provided config object. Additional `FirebaseProvider`s can be nested, as the component will use the already initialized app to pass down.

#### Usage

```javascript
import React from 'react';
import { FirebaseProvider } from 'fire-fetch';

const config = {
  //firebase config object - see official firebase docs for details
};

const App = () => (
  <FirebaseProvider config={config}>
    <RestOfAppThatUsesFirebaseStuff />
  </FirebaseProvider>
);
```

#### Props

##### config

> `object` | _required_

This is the [firebase](https://firebase.google.com) config that you would use to initialize your app.

##### children

> `React.node` | _required_

The content of your app that will need access to firebase functionality.

#### Utility Exports

##### FirebaseApp & withFbApp

A render-prop component and higher-order component (HoC) for getting a reference to the initialized firebase app.

```javascript
import { FirebaseApp, withFbApp } from 'fire-fetch';

// Render Prop example
class RPExample extends React.Component {
  doSomething = fbapp => {
    //use the given firebase app reference to do imperative actions
    //not included in fire-fetch
  };

  render() {
    return (
      <FirebaseApp>
        {fbapp => (
          <button onClick={() => this.doSomething(fbapp)}>Do Something</button>
        )}
      </FirebaseApp>
    );
  }
}

// HoC example
class HocExample extends React.Component {
  doSomething = () => {
    const { fbapp } = this.props;
    //use fbapp from props to access firebase app
  };

  render() {
    return <button onClick={this.doSomething}>Do Something</button>;
  }
}

export default withFbApp(HocExample);
```

### AuthListener

The `AuthListener` component will setup listening for auth state change events from firebase and provides the root context for several methods of signing users in and for signing out.

#### Usage

```javascript
import { AuthListener } from 'fire-fetch';

const Example = () => (
  <AuthListener>
    {user => (
      <React.Fragment>
        {user === null ? (
          <div>Still waiting for initial auth state to come back</div>
        ) : (
          <React.Fragment>
            {user ? (
              <div>User id is {user.uid}</div>
            ) : (
              <div>No user logged in</div>
            )}
          </React.Fragment>
        )}
      </React.Fragment>
    )}
  </AuthListener>
);
```

#### Props

##### render

> `function(user)` | optional

A render-prop for rendering content within the component. Can be used instead of passing a render-prop as `children`. The render-prop function should take a single argument, which will be the user object from firebase.

##### children

> `function(user)` | optional

This is a render prop that can be passed as the child of the component. See the above `render` prop for details on the function signature.

#### Utility Exports

##### User & withUser

A render prop component and HoC for getting a reference to the logged in user.

```javascript
import { User, withUser } from 'fire-fetch';

// Render prop example
const RPExample = () => <User>{user => <div>User ID is {user.uid}</div>}</User>;

// HoC example
const HoCExample = ({ user }) => <div>User ID is {user.uid}</div>;
export default withUser(HocExample);
```

##### SignIn, withSignIn, & providers

A render prop component and HoC that provide utility functions for signing a user into the app, as well as a list of authentication providers. There are two functions for signing in:

1.  `signInProvider(provider, redirect)` which will sign in using a given provider from the list, and will either redirect to a log in portal for the provider or use a pop-up depending on the boolean value of `redirect`. The currently supported providers are Google, Facebook, Twitter, and GitHub.
2.  `signInEmail(email, password, isCreating)` will sign in a user using the given email and password. If `isCreating` is true, a new user will be created and then signed in.

**providers**

As mentioned above, there are 4 supported providers for authentication.

1.  Google - available in `providers.google`
2.  Facebook - available in `providers.facebook`
3.  Twitter - availble in `providers.twitter`
4.  GitHub - available in `providers.github`

Pass one of these providers to the `signInProvider` function to use that provider for authentication.

##### SignOut & withSignOut

A render prop component and HoC that provide a function to sign a user out of the app.

```javascript
import { SignOut, withSignOut } from 'fire-fetch';

const LogOut = ({ signOut }) => (
  <button onClick={signOut}>Click to log out</button>
);

// Render prop example
const RPExample = () => (
  <SignOut>{signOut => <LogOut signOut={signOut} />}</SignOut>
);

// just wrap in a HoC to get the signOut function
export default withSignOut(LogOut);
```

### RootRef

The `RootRef` component is a simple utility component for if your real-time database structure has a common root path that you need to reference throughout your app. For example, if your app has a root path of `/users` and then the logged in user will get their data from a child using their `uid`, you will be prepending `/users/{uid}` to all your firebase refs. This component will work with the `FirebaseRef` and `FirebaseQuery` components to eliminate the need to type that path all the time.

#### Usage

```javascript
import { RootRef, User } from 'fire-fetch';

const Example = () => (
  <User>
    {user => (
      <RootRef path={`/users/${user.uid}`}>
        <p>
          The rest of the app will now be able to automatically prepend the root
          path onto the paths passed to refs and queries.
        </p>
      </RootRef>
    )}
  </User>
);
```

#### Props

##### path

> `string` | optional | defaults to empty string

The path you want to set as the root path for the app.

#### Utility Exports

##### GetRootRef & withRootRef

In practice you shouldn't need these, but if you are needing to break out of the `fire-fetch` components to use the firebase imperative API, you can use these to have quick access to the root ref.

```javascript
import { GetRootRef, withRootRef } from 'fire-fetch';

const UsesRoot = ({ path }) => <div>{path}</div>;

const RPExample = () => (
  <GetRootRef>{rootPath => <UsesRoot path={rootPath} />}</GetRootRef>
);

export default withRootRef(UsesRoot);
```

### FirebaseRef

The `FirebaseRef` component will return a single or list of firebase refs depending on what props are passed to it. These refs can then be used for further querying or manipulation of data in the real-time database.

#### Usage

```javascript
import { RootRef, FirebaseRef } from 'fire-fetch';

const Root = () => (
  <RootRef path="/some/long/path">
    <UsesRef />
  </RootRef>
);

class UsesRef extends React.Component {
  doSomething = ref => {
    // now you can use the ref to do stuff
  };

  render() {
    // the ref below will have a path of /some/long/path/todos
    // because FirebaseRef will prepend the rootref
    return (
      <FirebaseRef path="todos">
        {ref => (
          <button onClick={() => this.doSomething(ref)}>Do something</button>
        )}
      </FirebaseRef>
    );
  }
}

class MultipleRefs extends React.Component {
  doSomethingWithFirst = ref => {};
  doSomethingWithSecond = ref => {};

  render() {
    return (
      <FirebaseRef paths={['first', 'second']}>
        {(first, second) => (
          <div>
            <button onClick={() => this.doSomethingWithFirst(first)}>
              First
            </button>
            <button onClick={() => this.doSomethingWithSecond(second)}>
              Second
            </button>
          </div>
        )}
      </FirebaseRef>
    );
  }
}
```

#### Props

##### path

> `string` | optional

If this prop is used to construct the ref, a single firebase ref will be passed to the render prop.

##### paths

> `Array<string>` | optional

If this prop is used to construct the ref, a number of refs equal to the length of the array will be passed to the render prop.

##### render & children

> `function(...refs)` | one required

Render prop functions to get the firebase ref(s). See the [official firebase docs](https://firebase.google.com/docs/reference/js/firebase.database.Reference) for details on the ref(s).

### FirebaseQuery

The `FirebaseQuery` component is used to query the real-time database at a given path.

#### Usage

```javascript
import { FirebaseQuery } from 'fire-fetch';

const Example = () => (
  <FirebaseQuery path="todos" toArray on>
    {todos => (
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.name} - {todo.completed}
          </li>
        ))}
      </ul>
    )}
  </FirebaseQuery>
);
```

#### Props

##### path

> `string` | optional

The path in the real-time database that query will use.

##### reference

> `Reference` | optional

You can pass a firebase ref to the query instead of a path.

##### toArray

> `boolean` | optional

Firebase queries return objects, not arrays, which can make lists of data strange to work with. If `toArray` is passed, the object will be transformed into an array for your use.

##### on

> `boolean` or `string` | optional

The `on` prop will setup a query to update whenver the given firebase event fires. `on` will accept any of the following event strings: `child_added`, `child_removed`, `child_changed`, `child_moved`, and `value`. It will also accept a boolean which will update on `value` events.

##### once

> `boolean` or `string` | optional

The `once` prop will setup a query to update whenver the given firebase event fires. `once` will accept any of the following event strings: `child_added`, `child_removed`, `child_changed`, `child_moved`, and `value`. It will also accept a boolean which will update on `value` events.

##### updateOnValue

> `boolean` | optional

Will set the query to update the returned value on all `value` events.

##### orderByChild

> `string` | optional

Will order the query off the given key.

##### equalTo

> `any` | optional

When paired with `orderByChild`, will allow for filtering the query using the key given to `orderByChild` and value given to `equalTo`.

##### limitToLast

> `number` | optional

Will limit the query results to the last `number` results.

##### onChange

> `function(value)` | optional

Occasionally, it may be necessary to perform calculations or updates based on the updated data from a query. You can use the `onChange` prop to perform these changes.

##### render & children

Render props for rendering content from this component. The function used should have signature:

```javascript
function(queryValue, loading, ref)
```

The parameters for this are:

1.  `queryValue` - the resulting value of the query
2.  `loading` - a boolean value indicating if the query is still loading or not
3.  `ref` - the backing ref for the query; can be used for further updates or as an escape hatch

## License

---

MIT
