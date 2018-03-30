import React from 'react';
import firebase from 'firebase';
import { createContext } from 'react-broadcast';

const { Provider, Consumer: FirebaseApp } = createContext(null);

export { FirebaseApp };

class FirebaseProvider extends React.Component {
  state = {
    fbapp: Provider.defaultValue,
  };

  componentDidMount() {
    const { config } = this.props;

    const fbapp = firebase.apps.length
      ? firebase.apps[0]
      : firebase.initializeApp(config);

    this.setState({ fbapp });
  }

  render() {
    return this.state.fbapp === null ? null : (
      <Provider value={this.state.fbapp}>{this.props.children}</Provider>
    );
  }
}

export default FirebaseProvider;

export function withFbApp(Component) {
  return class extends React.Component {
    render() {
      return (
        <FirebaseApp>
          {fbapp => <Component fbapp={fbapp} {...this.props} />}
        </FirebaseApp>
      );
    }
  };
}
