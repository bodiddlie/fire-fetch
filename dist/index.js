'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var firebase = _interopDefault(require('firebase'));
var PropTypes = _interopDefault(require('prop-types'));

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

var FirebaseProvider = function (_React$Component) {
  inherits(FirebaseProvider, _React$Component);

  function FirebaseProvider() {
    var _temp, _this, _ret;

    classCallCheck(this, FirebaseProvider);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
      fbapp: null
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  FirebaseProvider.prototype.getChildContext = function getChildContext() {
    return _extends({}, this.state);
  };

  FirebaseProvider.prototype.componentDidMount = function componentDidMount() {
    var config = this.props.config;


    var fbapp = firebase.apps.length ? firebase.apps[0] : firebase.initializeApp(config);

    this.setState({ fbapp: fbapp });
  };

  FirebaseProvider.prototype.render = function render() {
    return this.state.fbapp === null ? null : this.props.children;
  };

  return FirebaseProvider;
}(React.Component);

FirebaseProvider.childContextTypes = {
  fbapp: PropTypes.object
};

var FirebaseApp = function (_React$Component2) {
  inherits(FirebaseApp, _React$Component2);

  function FirebaseApp() {
    classCallCheck(this, FirebaseApp);
    return possibleConstructorReturn(this, _React$Component2.apply(this, arguments));
  }

  FirebaseApp.prototype.render = function render() {
    var _props = this.props,
        render = _props.render,
        children = _props.children;


    if (render) {
      return render(this.context.fbapp);
    } else {
      return children(this.context.fbapp);
    }
  };

  return FirebaseApp;
}(React.Component);

FirebaseApp.contextTypes = {
  fbapp: PropTypes.object
};
function withFbApp(Component) {
  return function (_React$Component3) {
    inherits(_class, _React$Component3);

    function _class() {
      classCallCheck(this, _class);
      return possibleConstructorReturn(this, _React$Component3.apply(this, arguments));
    }

    _class.prototype.render = function render() {
      var _this4 = this;

      return React.createElement(
        FirebaseApp,
        null,
        function (fbapp) {
          return React.createElement(Component, _extends({ fbapp: fbapp }, _this4.props));
        }
      );
    };

    return _class;
  }(React.Component);
}

var RootRef = function (_React$Component) {
  inherits(RootRef, _React$Component);

  function RootRef() {
    var _temp, _this, _ret;

    classCallCheck(this, RootRef);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
      rootPath: _this.props.path || ''
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  RootRef.prototype.getChildContext = function getChildContext() {
    return this.state;
  };

  RootRef.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    var path = this.props.path;


    if (path !== prevProps.path) {
      this.setState({ rootPath: path });
    }
  };

  RootRef.prototype.render = function render() {
    return this.props.children;
  };

  return RootRef;
}(React.Component);

RootRef.childContextTypes = {
  rootPath: PropTypes.string
};

var GetRootRef = function (_React$Component2) {
  inherits(GetRootRef, _React$Component2);

  function GetRootRef() {
    classCallCheck(this, GetRootRef);
    return possibleConstructorReturn(this, _React$Component2.apply(this, arguments));
  }

  GetRootRef.prototype.render = function render() {
    var render = this.props.render || this.props.children;

    return render(this.context.rootPath);
  };

  return GetRootRef;
}(React.Component);

GetRootRef.contextTypes = {
  rootPath: PropTypes.string
};
function withRootRef(Component) {
  return function (_React$Component3) {
    inherits(_class, _React$Component3);

    function _class() {
      classCallCheck(this, _class);
      return possibleConstructorReturn(this, _React$Component3.apply(this, arguments));
    }

    _class.prototype.render = function render() {
      var _this4 = this;

      return React.createElement(
        GetRootRef,
        null,
        function (rootPath) {
          return React.createElement(Component, _extends({ rootPath: rootPath }, _this4.props));
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

  FirebaseQuery.prototype.getReference = function getReference() {
    var _props = this.props,
        path = _props.path,
        reference = _props.reference,
        fbapp = _props.fbapp,
        rootPath = _props.rootPath;

    if (reference) {
      return reference;
    } else {
      return fbapp.database().ref(rootPath + '/' + path);
    }
  };

  FirebaseQuery.prototype.buildQuery = function buildQuery() {
    var _this2 = this;

    var _props2 = this.props,
        on = _props2.on,
        toArray$$1 = _props2.toArray,
        onChange = _props2.onChange,
        once = _props2.once,
        orderByChild = _props2.orderByChild,
        equalTo = _props2.equalTo,
        limitToLast = _props2.limitToLast;


    this.ref = this.getReference();

    if (orderByChild) {
      this.ref = this.ref.orderByChild(orderByChild);
    }

    if (equalTo || equalTo === false) {
      this.ref = this.ref.equalTo(equalTo);
    }

    if (limitToLast) {
      this.ref = this.ref.limitToLast(limitToLast);
    }

    if (on) {
      this.ref.on('value', function (snapshot) {
        var val = snapshot.val();
        var value = toArray$$1 ? objectToArray(val) : val;
        _this2.setState({ value: value, loading: false });
        if (onChange) {
          onChange(value);
        }
      });
    }

    if (once) {
      this.ref.once('value', function (snapshot) {
        var val = snapshot.val();
        var value = toArray$$1 ? objectToArray(val) : val;
        _this2.setState({ value: value, loading: false });
        if (onChange) {
          onChange(value);
        }
      });
    }
  };

  FirebaseQuery.prototype.componentDidMount = function componentDidMount() {
    this.buildQuery();
  };

  FirebaseQuery.prototype.componentWillUnmount = function componentWillUnmount() {
    this.ref.off();
  };

  FirebaseQuery.prototype.render = function render() {
    var _props3 = this.props,
        render = _props3.render,
        children = _props3.children,
        toArray$$1 = _props3.toArray;
    var loading = this.state.loading;


    var value = toArray$$1 ? this.state.value || [] : this.state.value;

    return render ? render(value, loading, this.ref) : children(value, loading, this.ref);
  };

  return FirebaseQuery;
}(React.Component);

var firebaseQuery = withRootRef(withFbApp(FirebaseQuery));

var providers = {
  google: new firebase.auth.GoogleAuthProvider(),
  facebook: new firebase.auth.FacebookAuthProvider(),
  twitter: new firebase.auth.TwitterAuthProvider(),
  github: new firebase.auth.GithubAuthProvider()
};

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
    }, _this.signInProvider = function (method, redirect) {
      if (redirect) {
        _this.props.fbapp.auth().signInWithRedirect(providers[method]).catch(alert);
      } else {
        _this.props.fbapp.auth().signInWithPopup(providers[method]);
      }
    }, _this.signInEmail = function (email, password, isCreating) {
      if (isCreating) {
        _this.props.fbapp.auth().createUserWithEmailAndPassword(email, password);
      } else {
        _this.props.fbapp.auth().signInWithEmailAndPassword(email, password);
      }
    }, _this.signOut = function () {
      _this.props.fbapp.auth().signOut();
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  AuthListener.prototype.getChildContext = function getChildContext() {
    return {
      user: this.state.user,
      signInProvider: this.signInProvider,
      signInEmail: this.signInEmail,
      signOut: this.signOut
    };
  };

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


    if (render) {
      return render(this.state.user);
    } else {
      return children(this.state.user);
    }
  };

  return AuthListener;
}(React.Component);

AuthListener.childContextTypes = {
  user: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  signInProvider: PropTypes.func,
  signInEmail: PropTypes.func,
  signOut: PropTypes.func
};


var authListener = withFbApp(AuthListener);

var User = function (_React$Component2) {
  inherits(User, _React$Component2);

  function User() {
    classCallCheck(this, User);
    return possibleConstructorReturn(this, _React$Component2.apply(this, arguments));
  }

  User.prototype.render = function render() {
    return this.props.children(this.context.user);
  };

  return User;
}(React.Component);

User.contextTypes = {
  user: PropTypes.object
};
function withUser(Component) {
  return function (_React$Component3) {
    inherits(_class, _React$Component3);

    function _class() {
      classCallCheck(this, _class);
      return possibleConstructorReturn(this, _React$Component3.apply(this, arguments));
    }

    _class.prototype.render = function render() {
      var _this5 = this;

      return React.createElement(
        User,
        null,
        function (user) {
          return React.createElement(Component, _extends({ user: user }, _this5.props));
        }
      );
    };

    return _class;
  }(React.Component);
}

var SignIn = function (_React$Component4) {
  inherits(SignIn, _React$Component4);

  function SignIn() {
    classCallCheck(this, SignIn);
    return possibleConstructorReturn(this, _React$Component4.apply(this, arguments));
  }

  SignIn.prototype.render = function render() {
    return this.props.children(_extends({}, this.context));
  };

  return SignIn;
}(React.Component);

SignIn.contextTypes = {
  signInProvider: PropTypes.func,
  signInEmail: PropTypes.func
};
function withSignIn(Component) {
  return function (_React$Component5) {
    inherits(_class2, _React$Component5);

    function _class2() {
      classCallCheck(this, _class2);
      return possibleConstructorReturn(this, _React$Component5.apply(this, arguments));
    }

    _class2.prototype.render = function render() {
      var _this8 = this;

      return React.createElement(
        SignIn,
        null,
        function (funcs) {
          return React.createElement(Component, _extends({}, funcs, _this8.props));
        }
      );
    };

    return _class2;
  }(React.Component);
}

var SignOut = function (_React$Component6) {
  inherits(SignOut, _React$Component6);

  function SignOut() {
    classCallCheck(this, SignOut);
    return possibleConstructorReturn(this, _React$Component6.apply(this, arguments));
  }

  SignOut.prototype.render = function render() {
    var _props2 = this.props,
        render = _props2.render,
        children = _props2.children;

    if (render) {
      return render(this.context.signOut);
    } else {
      return children(this.context.signOut);
    }
  };

  return SignOut;
}(React.Component);

SignOut.contextTypes = {
  signOut: PropTypes.func
};
function withSignOut(Component) {
  return function (_React$Component7) {
    inherits(_class3, _React$Component7);

    function _class3() {
      classCallCheck(this, _class3);
      return possibleConstructorReturn(this, _React$Component7.apply(this, arguments));
    }

    _class3.prototype.render = function render() {
      var _this11 = this;

      return React.createElement(
        SignOut,
        null,
        function (signOut) {
          return React.createElement(Component, _extends({ signOut: signOut }, _this11.props));
        }
      );
    };

    return _class3;
  }(React.Component);
}

exports.FirebaseProvider = FirebaseProvider;
exports.FirebaseApp = FirebaseApp;
exports.withFbApp = withFbApp;
exports.RootRef = RootRef;
exports.GetRootRef = GetRootRef;
exports.withRootRef = withRootRef;
exports.FirebaseRef = firebaseRef;
exports.FirebaseQuery = firebaseQuery;
exports.AuthListener = authListener;
exports.User = User;
exports.withUser = withUser;
exports.SignIn = SignIn;
exports.withSignIn = withSignIn;
exports.SignOut = SignOut;
exports.withSignOut = withSignOut;
