import { useCredentialSync } from './use-credential-sync';

export const withCredentialSync = (Component, config) => props => {
  const [data, setData] = useState(undefined);
  const [callbacks, setCallbacks] = useState(undefined);

  const [{ loading, error }, open] = useCredentialSync({
    ...config,
    callbacks,
  });

  const ready = !loading && !error && !!data && !!callbacks;

  const credentialSync = {
    ready,
    loading,
    error,
    open,
    setData,
    setCallbacks,
  };

  return <Component {...props} credentialSync={credentialSync} />;
};
