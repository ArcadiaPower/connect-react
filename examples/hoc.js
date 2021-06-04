import React from 'react';
import { bool, number, shape, string } from 'prop-types';
import { withUtilityConnect } from '@arcadia-eng/utility-connect-react';

const config = {
  env: 'sandbox',
  client: 'Test Co.',
  accessToken: 'this_is_a_super_secret_token',
};

const data = {
  user: {
    email: 'this_is_a_fake_email@example.com',
    firstName: 'Falsey',
    lastName: 'Farsicle',
  },
};

class CreateCredentials extends React.Component {
  static propTypes = {
    utilityConnect: shape({
      loading: bool.isRequired,
      error: object,
      open: func.isRequired,
    }),
  };

  onEmit = ({ error, data }) => {
    if (error) {
      // handle credential submission error here
    } else if (data) {
      // handle credential submission response here
    }
  };

  onOpen = () => {
    // optional - handle widget open here
  };

  onClose = () => {
    // optional - handle widget close here
  };

  render() {
    const { loading, error, open } = this.props.utilityConnect;

    if (error) {
      return <div>Failed to load credential widget: {error.message}</div>;
    }

    return (
      <button type="button" disabled={loading} onClick={() => open(config)}>
        Connect credentials
      </button>
    );
  }
}

export default withUtilityConnect(CreateCredentials);
