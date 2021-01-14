import React from 'react';
import { number, shape, string } from 'prop-types';
import { withUtilityConnect } from '@arcadia-eng/utility-connect-react';

const config = {
  env: 'test',
  accessToken: 'this_is_a_super_secret_token',
};

class CreateCredentials extends React.Component {
  static propTypes = {
    userId: number.isRequired,
    address: string,
    email: string,
    utilityConnect: shape({
      ready: bool.isRequired,
      error: object,
      open: func.isRequired,
      setData: func.isRequired,
      setCallbacks: func.isRequired,
    }),
  };

  constructor(props) {
    super(props);
    const { userId, address, email, utilityConnect } = props;
    this.data = { userId, address, email };
    this.utilityConnect = utilityConnect;
  }

  componentDidMount() {
    this.utilityConnect.setData(this.data);
    this.utilityConnect.setCallbacks({
      onEmit: this.onEmit,
      onOpen: this.onOpen,
      onClose: this.onClose,
    });
  }

  onEmit({ error, dadta }) {
    if (error) {
      // handle credential submission error here
    } else if (data) {
      // handle credential submission response here
    }
  }

  onOpen() {
    // optional - handle widget open here
  }

  onClose() {
    // optional - handle widget close here
  }

  render() {
    const { ready, error, open } = this.utilityConnect;

    if (error) {
      return <div>Failed to load credential widget: {error.message}</div>;
    }

    return (
      <button type="button" disabled={ready} onClick={() => open()}>
        Connect credentials
      </button>
    );
  }
}

export default withUtilityConnect(CreateCredentials, config);
