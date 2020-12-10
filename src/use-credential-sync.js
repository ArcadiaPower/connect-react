import { useState, useEffect } from 'react';
import useScript from 'react-script-hook';

const src = 'https://arcadia.com/developers/credential-sync/stable/';
const loadError = 'Error loading Arcadia credential sync widget';

const useCredentialSync = config => {
  const [error, setError] = useState(undefined);
  const [factory, setFactory] = useState(undefined);
  const [credentialSync, setCredentialSync] = useState(undefined);

  const [loading, scriptError] = useScript({ src, checkForExisting: true });

  useEffect(() => {
    if (loading || scriptError) return;

    const { _ArcadiaCredentialSync } = window;
    if (!_ArcadiaCredentialSync) {
      setError(new Error(loadError));
    } else {
      setFactory(window._ArcadiaCredentialSync);
    }
  }, [loading, error]);

  const open = () => {
    if (!factory) return;

    const onClose = () => {
      config.onClose();
      setCredentialSync(undefined);
    };

    const credentialSync = factory.create({ ...config, onClose });
    setCredentialSync(credentialSync);
  };

  return [{ loading, error: scriptError || error }, open];
};
