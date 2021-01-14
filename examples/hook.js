import { number, shape, string } from 'prop-types';
import { useUtilityConnect } from '@arcadia-eng/utility-connect-react';

const env = 'staging';
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

CreateCredentials.propTypes = {
  userId: number.isRequired,
  address: string,
  email: string,
};

export default CreateCredentials;
