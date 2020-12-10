import { useCallback } from 'react';
import { number, shape, string } from 'prop-types';
import { useCredentialSync } from '@arcadia/credential-sync-react';

const env = 'test';
const accessToken = 'this_is_a_super_secret_token';
const products = ['data_access', 'remittance'];

const CreateCredentials = props => {
  const data = props.user;

  const onEmit = useCallback((emitType, metadata) => {
    if (emitType === 'success') {
      // handle successful credential submission here
    } else if (emitType === 'error') {
      // handle unsuccessful credential submission here
    }
  });

  const onOpen = useCallback(() => {
    // optional - handle widget open here
  }, []);

  const onClose = useCallback(() => {
    // optional - handle widget close here
  }, []);

  const callbacks = { onEmit, onOpen, onClose };

  const config = {
    env,
    accessToken,
    products,
    data,
    callbacks,
    scope: 'create',
  };

  const [{ loading, error }, openCredentialSync] = useCredentialSync(config);

  const errorMessage = (
    <div>Failed to load credential widget: {error.message}</div>
  );

  if (error) return errorMessage;

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
  user: shape({
    id: number.isRequired,
    address: string,
    email: string,
  }),
};

export default CreateCredentials;
