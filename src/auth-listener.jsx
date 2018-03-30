import React from 'react';
import firebase from 'firebase';
import { createContext } from 'react-broadcast';

import { withFbApp } from './provider';

const noop = () => {};
const { Provider: UserProvider, Consumer: User } = createContext(null);

const { Provider: SignInProvider, Consumer: SignIn } = createContext({
  signInProvider: noop,
  signInEmail: noop,
});

const { Provider: SignOutProvider, Consumer: SignOut } = createContext(noop);

export { User, SignIn, SignOut };

export const providers = {
  google: new firebase.auth.GoogleAuthProvider(),
  facebook: new firebase.auth.FacebookAuthProvider(),
  twitter: new firebase.auth.TwitterAuthProvider(),
  github: new firebase.auth.GithubAuthProvider(),
};

export function signInProvider(fbapp, provider, redirect) {
  if (redirect) {
    fbapp.auth().signInWithRedirect(provider);
  } else {
    fbapp.auth().signInWithPopup(provider);
  }
}

export function signInEmail(fbapp, email, password, isCreating) {
  if (isCreating) {
    fbapp.auth().createUserWithEmailAndPassword(email, password);
  } else {
    fbapp.auth().signInWithEmailAndPassword(email, password);
  }
}

export function signOut(fbapp) {
  fbapp.auth().signOut();
}

export class AuthListener extends React.Component {
  state = {
    user: null,
  };

  componentDidMount() {
    const { fbapp } = this.props;

    if (!fbapp) return;

    this.unsubscribe = fbapp.auth().onAuthStateChanged(user => {
      this.setState({ user: user || false });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  signInProvider = (provider, redirect) => {
    signInProvider(this.props.fbapp, provider, redirect);
  };

  signInEmail = (email, password, isCreating) => {
    signInEmail(this.props.fbapp, email, password, isCreating);
  };

  signOut = () => {
    signOut(this.props.fbapp);
  };

  render() {
    const { render, children } = this.props;
    const { user } = this.state;

    const renderFunc = render || children;
    const signInValue = {
      signInProvider: this.signInProvider,
      signInEmail: this.signInEmail,
    };

    return (
      <UserProvider value={user}>
        <SignInProvider value={signInValue}>
          <SignOutProvider value={this.signOut}>
            {renderFunc(user)}
          </SignOutProvider>
        </SignInProvider>
      </UserProvider>
    );
  }
}

export default withFbApp(AuthListener);

export function withUser(Component) {
  return class extends React.Component {
    render() {
      return <User>{user => <Component user={user} {...this.props} />}</User>;
    }
  };
}

export function withSignIn(Component) {
  return class extends React.Component {
    render() {
      return (
        <SignIn>{funcs => <Component {...funcs} {...this.props} />}</SignIn>
      );
    }
  };
}

export function withSignOut(Component) {
  return class extends React.Component {
    render() {
      return (
        <SignOut>
          {signOut => <Component signOut={signOut} {...this.props} />}
        </SignOut>
      );
    }
  };
}
