import { useUtilityConnect } from '@arcadia-eng/utility-connect-react';

const env = 'staging';
const accessToken = 'this_is_a_super_secret_token';
const client = 'Test Co.';

const data = {
  user: {
    email: 'this_is_a_fake_email@example.com',
    address: '123 Fake St',
    firstName: 'Falsey',
    lastName: 'Farsicle',
  },
};

const CreateCredentials = props => {
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
    client,
    data,
    callbacks,
    scope: 'create',
  };

  const [{ loading, error }, open] = useUtilityConnect(config);

  if (error) {
    return <div>Failed to load credential widget: {error.message}</div>;
  }

  return (
    <button type="button" disabled={loading} onClick={() => open()}>
      Connect credentials
    </button>
  );
};

export default CreateCredentials;
