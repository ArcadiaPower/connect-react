import { useConnect } from '@arcadia-eng/connect-react';

const config = {
  connectToken: 'this_is_a_super_secret_token',
  // Optional - for "create" mode you can pre-fill out a zip code
  newCredentialData: {
    zipCode: '11787',
  },
};

const CreateCredentials = props => {
  onCredentialsSubmitted = ({ utilityCredentialId }) => {
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

  const callbacks = { onCredentialsSubmitted, onOpen, onClose };

  const configWithCallbacks = {
    ...config,
    callbacks,
  };

  const [{ loading, error }, open] = useConnect();

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
};

export default CreateCredentials;
