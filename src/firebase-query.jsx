import React from 'react';

import { objectToArray } from './util';
import { withRootRef } from './root-ref';
import { withFbApp } from './provider';

export class FirebaseQuery extends React.Component {
  state = {
    value: null,
    loading: true,
  };

  getReference(args) {
    const { path, reference, fbapp, rootPath } = args;
    if (reference) {
      return reference;
    } else {
      return fbapp.database().ref(`${rootPath}/${path}`);
    }
  }

  buildQuery(reference) {
    const {
      on,
      toArray,
      onChange,
      once,
      orderByChild,
      equalTo,
      limitToLast,
    } = this.props;

    if (orderByChild) {
      reference = reference.orderByChild(orderByChild);
    }

    if (equalTo || equalTo === false) {
      reference = reference.equalTo(equalTo);
    }

    if (limitToLast) {
      reference = reference.limitToLast(limitToLast);
    }

    if (on) {
      reference.on('value', snapshot => {
        const val = snapshot.val();
        const value = toArray ? objectToArray(val) : val;
        this.setState({ value, loading: false });
        if (onChange) {
          onChange(value);
        }
      });
    }

    if (once) {
      reference.once('value', snapshot => {
        const val = snapshot.val();
        const value = toArray ? objectToArray(val) : val;
        this.setState({ value, loading: false });
        if (onChange) {
          onChange(value);
        }
      });
    }
  }

  componentDidMount() {
    const currentRef = this.getReference(this.props);
    this.ref = currentRef;
    this.buildQuery(currentRef);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.path !== this.props.path) {
      // Get the old reference and turn off subs
      this.ref.off();
      this.ref = undefined;
      const newReference = this.getReference(this.props);
      this.ref = newReference;
      this.buildQuery(newReference);
    }
  }

  componentWillUnmount() {
    this.ref.off();
  }

  render() {
    const { render, children, toArray } = this.props;
    const { loading } = this.state;

    const value = toArray ? this.state.value || [] : this.state.value;

    return render
      ? render(value, loading, this.ref)
      : children(value, loading, this.ref);
  }
}

export default withRootRef(withFbApp(FirebaseQuery));
