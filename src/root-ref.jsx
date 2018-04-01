import React from 'react';
import { createContext } from 'react-broadcast';

const { Provider, Consumer: GetRootRef } = createContext('');

export default class RootRef extends React.Component {
  state = {
    rootPath: this.props.path || Provider.defaultValue,
  };

  componentDidUpdate(prevProps) {
    const { path } = this.props;

    if (path !== prevProps.path) {
      this.setState({ rootPath: path });
    }
  }

  render() {
    const { rootPath } = this.state;

    return <Provider value={rootPath}>{this.props.children}</Provider>;
  }
}

export { GetRootRef };

export function withRootRef(Component) {
  return class extends React.Component {
    render() {
      return (
        <GetRootRef>
          {rootPath => <Component rootPath={rootPath} {...this.props} />}
        </GetRootRef>
      );
    }
  };
}
