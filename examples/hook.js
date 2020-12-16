import { useCallback } from 'react';
import { number, shape, string } from 'prop-types';
import { useCredentialSync } from '@arcadia/credential-sync-react';

const env = 'test';
const accessToken = 'this_is_a_super_secret_token';

const CreateCredentials = props => {
  const data = props;

  const onEmit = ({ error, data }) => {
    if (error) {
      // handle credential submission error here
    } else if (data) {
      // handle credential submission response here
    }
  };

  const onOpen = () => {
    // optional - handle widget open here
  };

  const onClose = () => {
    // optional - handle widget close here
  };

  const callbacks = { onEmit, onOpen, onClose };

  const config = {
    env,
    accessToken,
    data,
    callbacks,
    scope: 'create',
  };

  const [{ loading, error }, openCredentialSync] = useCredentialSync(config);

  if (error) {
    return <div>Failed to load credential widget: {error.message}</div>;
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => openCredentialSync()}
    >
      Connect credentials
    </button>
  );
};

CreateCredentials.propTypes = {
  userId: number.isRequired,
  address: string,
  email: string,
};

export default CreateCredentials;
