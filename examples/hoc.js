import React from 'react';
import { bool, number, shape, string } from 'prop-types';
import { withConnect } from '@arcadia-eng/connect-react';

const config = {
  connectToken: 'this_is_a_super_secret_token',
  // Optional - for "create" mode you can pre-fill out a zip code
  newCredentialData: {
    zipCode: '11787',
  },
};

class CreateCredentials extends React.Component {
  static propTypes = {
    connect: shape({
      loading: bool.isRequired,
      error: object,
      open: func.isRequired,
    }),
  };

  onCredentialsSubmitted = ({ utility_credential_id }) => {
    // Optional - save credential id for future use
  };

  onOpen = () => {
    // optional - handle widget open here
  };

  onClose = ({ status }) => {
    // optional - handle widget close here with the given statuses
    // Statuses are 'verified', 'rejected', 'timed_out', 'pending', 'no_submit', 'error'
    switch (status) {
      case 'verified':
        // Move on
        return;
      case 'rejected':
        // Handle rejection
        // ...etc
        return;
    }
  };

  render() {
    const { loading, error, open } = this.props.connect;
    const configWithCallbacks = {
      ...config,
      callbacks: {
        onClose: this.onClose,
        onCredentialsSubmitted: this.onCredentialsSubmitted,
        onOpen: this.onOpen,
      },
    };

    if (error) {
      return <div>Failed to load credential widget: {error.message}</div>;
    }

    return (
      <button
        type="button"
        disabled={loading}
        onClick={() => open(configWithCallbacks)}
      >
        Connect credentials
      </button>
    );
  }
}

export default withConnect(CreateCredentials);
