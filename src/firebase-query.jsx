import React from 'react';

import { objectToArray } from './util';
import { withRootRef } from './root-ref';
import { withFbApp } from './provider';

const PropTypes = {};
const propTypes = {
  fbapp: PropTypes.func,
  rootPath: PropTypes.string,
  path: PropTypes.string,
  reference: PropTypes.func,
  on: PropTypes.func,
  toArray: PropTypes.bool,
  onChange: PropTypes.func,
  once: PropTypes.bool,
  orderByChild: PropTypes.string,
  equalTo: PropTypes.bool,
  limitToLast: PropTypes.number,
  children: PropTypes.func,
  render: PropTypes.func,
};

const onlyRefImpacting = propKey => propKey !== 'render' && propKey !== 'children';

const shallowEqual = (oldProps, newProps) => {
  if (oldProps === newProps) {
    return true;
  }
  const keysToCompare = Object.keys(propTypes).filter(onlyRefImpacting);
  const shouldUpdate = keysToCompare.every(key => oldProps[key] === newProps[key]);
  return shouldUpdate;
};

const buildReference = ({ path, reference, fbapp, rootPath }) => {
  if (reference) {
    return reference;
  } else {
    return fbapp.database().ref(`${rootPath}/${path}`);
  }
}

export class FirebaseQuery extends React.Component {
  state = {
    value: null,
    loading: true,
  };

  buildQuery() {
    const {
      on,
      toArray,
      onChange,
      once,
      orderByChild,
      equalTo,
      limitToLast,
    } = this.props;

    let reference = buildReference(this.props);

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

    return reference;
  }

  componentDidMount() {
    const updatedReference = this.buildQuery();
    this.ref = updatedReference;
  }

  componentDidUpdate(prevProps) {
    if (!shallowEqual(prevProps, this.props)) {
      // Get the old reference and turn off subs
      this.ref.off();
      this.ref = undefined;
      const updatedReference = this.buildQuery();
      this.ref = updatedReference;
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
