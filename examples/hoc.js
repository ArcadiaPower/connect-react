import React from 'react';
import { number, shape, string } from 'prop-types';
import { withCredentialSync } from '@arcadia/credential-sync-react';

const config = {
  env: 'test',
  accessToken: 'this_is_a_super_secret_token',
  products: ['data_access', 'remittance'],
};

class CreateCredentials extends React.Component {
  static propTypes = {
    user: shape({
      id: number.isRequired,
      address: string,
      email: string,
    }),
    credentialSync: shape({
      ready: bool.isRequired,
      error: object,
      openCredentialSync: func.isRequired,
    }),
  };

  constructor(props) {
    super(props);
    this.credentialSync = props.credentialSync;
  }

  componentDidMount() {
    this.credentialSync.setData(this.props.user);
    this.credentialSync.setCallbacks({
      onEmit: this.onEmit,
      onOpen: this.onOpen,
      onClose: this.onClose,
    });
  }

  onEmit(emitType, metadata) {
    if (emitType === 'success') {
      // handle successful credential submission here
    } else if (emitType === 'error') {
      // handle unsuccessful credential submission here
    }
  }

  onOpen() {
    // optional - handle widget open here
  }

  onClose() {
    // optional - handle widget close here
  }

  render() {
    const { ready, error, open } = this.credentialSync;

    if (error) {
      return <div>Failed to load credential widget: {error.message}</div>;
    }

    return (
      <button
        type="button"
        disabled={ready}
        onClick={() => openCredentialSync()}
      >
        Connect credentials
      </button>
    );
  }
}

export default withCredentialSync(CreateCredentials, config);
