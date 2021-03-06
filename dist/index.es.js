import React from 'react';
import firebase from 'firebase';
import { createContext } from 'react-broadcast';
import PropTypes from 'prop-types';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var _createContext = createContext(null),
    Provider = _createContext.Provider,
    FirebaseApp = _createContext.Consumer;

var FirebaseProvider = function (_React$Component) {
  inherits(FirebaseProvider, _React$Component);

  function FirebaseProvider() {
    var _temp, _this, _ret;

    classCallCheck(this, FirebaseProvider);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
      fbapp: Provider.defaultValue
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  FirebaseProvider.prototype.componentDidMount = function componentDidMount() {
    var config = this.props.config;


    var fbapp = firebase.apps.length ? firebase.apps[0] : firebase.initializeApp(config);

    this.setState({ fbapp: fbapp });
  };

  FirebaseProvider.prototype.render = function render() {
    return this.state.fbapp === null ? null : React.createElement(
      Provider,
      { value: this.state.fbapp },
      this.props.children
    );
  };

  return FirebaseProvider;
}(React.Component);

function withFbApp(Component) {
  return function (_React$Component2) {
    inherits(_class, _React$Component2);

    function _class() {
      classCallCheck(this, _class);
      return possibleConstructorReturn(this, _React$Component2.apply(this, arguments));
    }

    _class.prototype.render = function render() {
      var _this3 = this;

      return React.createElement(
        FirebaseApp,
        null,
        function (fbapp) {
          return React.createElement(Component, _extends({ fbapp: fbapp }, _this3.props));
        }
      );
    };

    return _class;
  }(React.Component);
}

var _createContext$1 = createContext(''),
    Provider$1 = _createContext$1.Provider,
    GetRootRef = _createContext$1.Consumer;

var RootRef = function (_React$Component) {
  inherits(RootRef, _React$Component);

  function RootRef() {
    var _temp, _this, _ret;

    classCallCheck(this, RootRef);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
      rootPath: _this.props.path || Provider$1.defaultValue
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  RootRef.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    var path = this.props.path;


    if (path !== prevProps.path) {
      this.setState({ rootPath: path });
    }
  };

  RootRef.prototype.render = function render() {
    var rootPath = this.state.rootPath;


    return React.createElement(
      Provider$1,
      { value: rootPath },
      this.props.children
    );
  };

  return RootRef;
}(React.Component);

function withRootRef(Component) {
  return function (_React$Component2) {
    inherits(_class, _React$Component2);

    function _class() {
      classCallCheck(this, _class);
      return possibleConstructorReturn(this, _React$Component2.apply(this, arguments));
    }

    _class.prototype.render = function render() {
      var _this3 = this;

      return React.createElement(
        GetRootRef,
        null,
        function (rootPath) {
          return React.createElement(Component, _extends({ rootPath: rootPath }, _this3.props));
        }
      );
    };

    return _class;
  }(React.Component);
}

var FirebaseRef = function (_React$Component) {
  inherits(FirebaseRef, _React$Component);

  function FirebaseRef() {
    classCallCheck(this, FirebaseRef);
    return possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  FirebaseRef.prototype.getReferences = function getReferences() {
    var _props = this.props,
        path = _props.path,
        paths = _props.paths,
        fbapp = _props.fbapp,
        rootPath = _props.rootPath;


    if (path) {
      return [fbapp.database().ref(rootPath + '/' + path)];
    }

    return paths.map(function (path) {
      return fbapp.database().ref(rootPath + '/' + path);
    });
  };

  FirebaseRef.prototype.render = function render() {
    var _props2 = this.props,
        render = _props2.render,
        children = _props2.children;


    var refs = this.getReferences();

    return render ? render.apply(undefined, refs) : children.apply(undefined, refs);
  };

  return FirebaseRef;
}(React.Component);

var firebaseRef = withRootRef(withFbApp(FirebaseRef));

function objectToArray(object) {
  var obj = object;

  if (obj === null || obj === undefined) {
    obj = {};
  }

  return Object.keys(obj).reduce(function (acc, cur) {
    acc.push(obj[cur]);
    return acc;
  }, []);
}

var propTypes = {
  fbapp: PropTypes.func,
  rootPath: PropTypes.string,
  path: PropTypes.string,
  reference: PropTypes.func,
  on: PropTypes.oneOf([true, false, 'child_added', 'value', 'child_removed', 'child_changed', 'child_moved']),
  updateOnValue: PropTypes.bool,
  toArray: PropTypes.bool,
  onChange: PropTypes.func,
  once: PropTypes.oneOf([true, false, 'child_added', 'value', 'child_removed', 'child_changed', 'child_moved']),
  orderByChild: PropTypes.string,
  equalTo: PropTypes.bool,
  limitToLast: PropTypes.number,
  children: PropTypes.func,
  render: PropTypes.func
};

var onlyRefImpacting = function onlyRefImpacting(propKey) {
  return propKey !== 'render' && propKey !== 'children';
};

var shallowEqual = function shallowEqual(oldProps, newProps) {
  if (oldProps === newProps) {
    return true;
  }
  var keysToCompare = Object.keys(propTypes).filter(onlyRefImpacting);
  var shouldUpdate = keysToCompare.every(function (key) {
    return oldProps[key] === newProps[key];
  });
  return shouldUpdate;
};

var buildReference = function buildReference(_ref) {
  var path = _ref.path,
      reference = _ref.reference,
      fbapp = _ref.fbapp,
      rootPath = _ref.rootPath;

  if (reference) {
    return reference;
  } else {
    return fbapp.database().ref(rootPath + '/' + path);
  }
};

var FirebaseQuery = function (_React$Component) {
  inherits(FirebaseQuery, _React$Component);

  function FirebaseQuery() {
    var _temp, _this, _ret;

    classCallCheck(this, FirebaseQuery);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
      value: null,
      loading: true
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  FirebaseQuery.prototype.buildQuery = function buildQuery() {
    var _this2 = this;

    var _props = this.props,
        on = _props.on,
        toArray$$1 = _props.toArray,
        onChange = _props.onChange,
        once = _props.once,
        orderByChild = _props.orderByChild,
        equalTo = _props.equalTo,
        limitToLast = _props.limitToLast,
        updateOnValue = _props.updateOnValue;


    var reference = buildReference(this.props);

    if (orderByChild) {
      reference = reference.orderByChild(orderByChild);
    }

    if (equalTo || equalTo === false) {
      reference = reference.equalTo(equalTo);
    }

    if (limitToLast) {
      reference = reference.limitToLast(limitToLast);
    }

    var onValue = null;
    if (updateOnValue || typeof on === 'boolean' && on) {
      onValue = 'value';
    } else if (typeof on === 'string') {
      onValue = on;
    }

    if (!!onValue) {
      reference.on(onValue, function (snapshot) {
        var val = snapshot.val();
        var value = toArray$$1 ? objectToArray(val) : val;
        _this2.setState({ value: value, loading: false });
        if (onChange) {
          onChange(value);
        }
      });
    }

    var onceValue = null;
    if (typeof once === 'boolean' && once) {
      onceValue = 'value';
    } else if (typeof once === 'string') {
      onceValue = once;
    }

    if (!!onceValue) {
      reference.once(onceValue, function (snapshot) {
        var val = snapshot.val();
        var value = toArray$$1 ? objectToArray(val) : val;
        _this2.setState({ value: value, loading: false });
        if (onChange) {
          onChange(value);
        }
      });
    }

    return reference;
  };

  FirebaseQuery.prototype.componentDidMount = function componentDidMount() {
    var updatedReference = this.buildQuery();
    this.ref = updatedReference;
  };

  FirebaseQuery.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (!shallowEqual(prevProps, this.props)) {
      // Get the old reference and turn off subs
      this.ref.off();
      this.ref = undefined;
      var updatedReference = this.buildQuery();
      this.ref = updatedReference;
    }
  };

  FirebaseQuery.prototype.componentWillUnmount = function componentWillUnmount() {
    this.ref.off();
  };

  FirebaseQuery.prototype.render = function render() {
    var _props2 = this.props,
        render = _props2.render,
        children = _props2.children,
        toArray$$1 = _props2.toArray;
    var loading = this.state.loading;


    var value = toArray$$1 ? this.state.value || [] : this.state.value;

    return render ? render(value, loading, this.ref) : children(value, loading, this.ref);
  };

  return FirebaseQuery;
}(React.Component);

var firebaseQuery = withRootRef(withFbApp(FirebaseQuery));

var noop = function noop() {};

var _createContext$2 = createContext(null),
    UserProvider = _createContext$2.Provider,
    User = _createContext$2.Consumer;

var _createContext2 = createContext({
  signInProvider: noop,
  signInEmail: noop
}),
    SignInProvider = _createContext2.Provider,
    SignIn = _createContext2.Consumer;

var _createContext3 = createContext(noop),
    SignOutProvider = _createContext3.Provider,
    SignOut = _createContext3.Consumer;

var providers = {
  google: new firebase.auth.GoogleAuthProvider(),
  facebook: new firebase.auth.FacebookAuthProvider(),
  twitter: new firebase.auth.TwitterAuthProvider(),
  github: new firebase.auth.GithubAuthProvider()
};

function signInProvider(fbapp, provider, redirect) {
  if (redirect) {
    fbapp.auth().signInWithRedirect(provider);
  } else {
    fbapp.auth().signInWithPopup(provider);
  }
}

function signInEmail(fbapp, email, password, isCreating) {
  if (isCreating) {
    fbapp.auth().createUserWithEmailAndPassword(email, password);
  } else {
    fbapp.auth().signInWithEmailAndPassword(email, password);
  }
}

function signOut(fbapp) {
  fbapp.auth().signOut();
}

var AuthListener = function (_React$Component) {
  inherits(AuthListener, _React$Component);

  function AuthListener() {
    var _temp, _this, _ret;

    classCallCheck(this, AuthListener);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
      user: null
    }, _this.signInProvider = function (provider, redirect) {
      signInProvider(_this.props.fbapp, provider, redirect);
    }, _this.signInEmail = function (email, password, isCreating) {
      signInEmail(_this.props.fbapp, email, password, isCreating);
    }, _this.signOut = function () {
      signOut(_this.props.fbapp);
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  AuthListener.prototype.componentDidMount = function componentDidMount() {
    var _this2 = this;

    var fbapp = this.props.fbapp;


    if (!fbapp) return;

    this.unsubscribe = fbapp.auth().onAuthStateChanged(function (user) {
      _this2.setState({ user: user || false });
    });
  };

  AuthListener.prototype.componentWillUnmount = function componentWillUnmount() {
    this.unsubscribe();
  };

  AuthListener.prototype.render = function render() {
    var _props = this.props,
        render = _props.render,
        children = _props.children;
    var user = this.state.user;


    var renderFunc = render || children;
    var signInValue = {
      signInProvider: this.signInProvider,
      signInEmail: this.signInEmail
    };

    return React.createElement(
      UserProvider,
      { value: user },
      React.createElement(
        SignInProvider,
        { value: signInValue },
        React.createElement(
          SignOutProvider,
          { value: this.signOut },
          renderFunc(user)
        )
      )
    );
  };

  return AuthListener;
}(React.Component);

var authListener = withFbApp(AuthListener);

function withUser(Component) {
  return function (_React$Component2) {
    inherits(_class, _React$Component2);

    function _class() {
      classCallCheck(this, _class);
      return possibleConstructorReturn(this, _React$Component2.apply(this, arguments));
    }

    _class.prototype.render = function render() {
      var _this4 = this;

      return React.createElement(
        User,
        null,
        function (user) {
          return React.createElement(Component, _extends({ user: user }, _this4.props));
        }
      );
    };

    return _class;
  }(React.Component);
}

function withSignIn(Component) {
  return function (_React$Component3) {
    inherits(_class2, _React$Component3);

    function _class2() {
      classCallCheck(this, _class2);
      return possibleConstructorReturn(this, _React$Component3.apply(this, arguments));
    }

    _class2.prototype.render = function render() {
      var _this6 = this;

      return React.createElement(
        SignIn,
        null,
        function (funcs) {
          return React.createElement(Component, _extends({}, funcs, _this6.props));
        }
      );
    };

    return _class2;
  }(React.Component);
}

function withSignOut(Component) {
  return function (_React$Component4) {
    inherits(_class3, _React$Component4);

    function _class3() {
      classCallCheck(this, _class3);
      return possibleConstructorReturn(this, _React$Component4.apply(this, arguments));
    }

    _class3.prototype.render = function render() {
      var _this8 = this;

      return React.createElement(
        SignOut,
        null,
        function (signOut) {
          return React.createElement(Component, _extends({ signOut: signOut }, _this8.props));
        }
      );
    };

    return _class3;
  }(React.Component);
}

export { FirebaseProvider, FirebaseApp, withFbApp, RootRef, GetRootRef, withRootRef, firebaseRef as FirebaseRef, firebaseQuery as FirebaseQuery, authListener as AuthListener, User, withUser, SignIn, withSignIn, SignOut, withSignOut, providers };
