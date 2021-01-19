import { useState, useEffect } from 'react';
import useScript from 'react-script-hook';

const src = 'https://utility-connect-main.prod.arcadia.com/dist/index.js';

const scriptLoadError =
  'Error fetching script - please check your internet connection.';
const initializeError =
  'Error loading Arcadia utility connect service - we are working to fix the issue.';

const getConfigError = errors => {
  const message = Object.values(errors).join(' ');
  return new Error(`Error setting configuration variables: ${message}`);
};

export const useUtilityConnect = config => {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [factory, setFactory] = useState();
  const [utilityConnect, setUtilityConnect] = useState();

  const [scriptLoading, scriptError] = useScript({
    src,
    checkForExisting: true,
  });

  useEffect(() => {
    if (scriptLoading || scriptError) return;

    const { _ArcadiaUtilityConnect } = window;
    if (!_ArcadiaUtilityConnect) {
      setError(new Error(initializeError));
    } else {
      setFactory(window._ArcadiaUtilityConnect);
    }
  }, [scriptLoading, scriptError]);

  const open = async () => {
    if (!factory) return;

    setLoading(true);
    try {
      const configErrors = await factory.validate(config);
      if (configErrors) {
        setError(getConfigError(configErrors));
      } else {
        const onClose = () => {
          config?.callbacks?.onClose();
          setUtilityConnect(undefined);
        };

        const callbacks = { ...config.callbacks, onClose };
        const utilityConnect = factory.create({ ...config, callbacks });
        setUtilityConnect(utilityConnect);
      }
      setLoading(false);
    } catch (e) {
      setError(initializeError);
      setLoading(false);
    }
  };

  return [
    { loading: loading || scriptLoading, error: error || scriptError },
    open,
  ];
};
