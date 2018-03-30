import React from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase';

import { withFbApp } from './provider';

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

  static childContextTypes = {
    user: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    signInProvider: PropTypes.func,
    signInEmail: PropTypes.func,
    signOut: PropTypes.func,
  };

  getChildContext() {
    return {
      user: this.state.user,
      signInProvider: this.signInProvider,
      signInEmail: this.signInEmail,
      signOut: this.signOut,
    };
  }

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

    if (render) {
      return render(this.state.user);
    } else {
      return children(this.state.user);
    }
  }
}

export default withFbApp(AuthListener);

export class User extends React.Component {
  static contextTypes = {
    user: PropTypes.object,
  };

  render() {
    return this.props.children(this.context.user);
  }
}

export function withUser(Component) {
  return class extends React.Component {
    render() {
      return <User>{user => <Component user={user} {...this.props} />}</User>;
    }
  };
}

export class SignIn extends React.Component {
  static contextTypes = {
    signInProvider: PropTypes.func,
    signInEmail: PropTypes.func,
  };

  render() {
    return this.props.children({ ...this.context });
  }
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

export class SignOut extends React.Component {
  static contextTypes = {
    signOut: PropTypes.func,
  };

  render() {
    const { render, children } = this.props;
    if (render) {
      return render(this.context.signOut);
    } else {
      return children(this.context.signOut);
    }
  }
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
