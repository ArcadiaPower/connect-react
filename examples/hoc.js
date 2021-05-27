import React from 'react';
import { number, shape, string } from 'prop-types';
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
      ready: bool.isRequired,
      error: object,
      open: func.isRequired,
      setData: func.isRequired,
      setCallbacks: func.isRequired,
    }),
  };

  componentDidMount() {
    this.props.utilityConnect.setData(data);
    this.props.utilityConnect.setCallbacks({
      onEmit: this.onEmit,
      onOpen: this.onOpen,
      onClose: this.onClose,
    });
  }

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
    const { ready, error, open } = this.utilityConnect;

    if (error) {
      return <div>Failed to load credential widget: {error.message}</div>;
    }

    return (
      <button type="button" disabled={ready} onClick={() => open(config)}>
        Connect credentials
      </button>
    );
  }
}

export default withUtilityConnect(CreateCredentials, config);
