import { useState, useEffect, useCallback } from 'react';
import useScript from 'react-script-hook';

const src = 'https://utility-connect-main.prod.arcadia.com/dist/v2.js';

const scriptLoadError = new Error(
  'Error fetching script - please check your internet connection.'
);
const initializeError = new Error(
  'Error loading Arcadia utility connect service - we are working to fix the issue.'
);

const getConfigError = errors => {
  const message = Object.values(errors).join(' ');
  return new Error(`Error setting configuration variables: ${message}`);
};

export const useUtilityConnect = () => {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [factory, setFactory] = useState();
  const [utilityConnect, setUtilityConnect] = useState();

  const [openOnScriptLoad, setOpenOnScriptLoad] = useState(false);
  const [savedOpenParams, setSavedOpenParams] = useState();

  const [scriptLoading, scriptError] = useScript({
    src,
    checkForExisting: true,
  });

  useEffect(() => {
    if (scriptLoading || scriptError) return;

    const { _ArcadiaUtilityConnect } = window;
    if (!_ArcadiaUtilityConnect) {
      setError(initializeError);
    } else {
      setFactory(window._ArcadiaUtilityConnect);
    }
  }, [scriptLoading, scriptError]);

  useEffect(() => {
    if (scriptError) setError(scriptLoadError);
  }, [scriptError, setError]);

  const open = useCallback(
    async config => {
      if (!factory) {
        setSavedOpenParams(config);
        setOpenOnScriptLoad(true);
        return;
      }

      setLoading(true);
      try {
        const configErrors = await factory.validate(config);
        if (configErrors) {
          setError(getConfigError(configErrors));
        } else {
          const onClose = () => {
            config?.callbacks?.onClose?.();
            setUtilityConnect(undefined);
          };

          const callbacks = { ...(config.callbacks || {}), onClose };
          const utilityConnect = factory.create({ ...config, callbacks });
          setUtilityConnect(utilityConnect);
        }
        setLoading(false);
      } catch (e) {
        setError(initializeError);
        setLoading(false);
      }
    },
    [factory]
  );

  useEffect(() => {
    if (factory && openOnScriptLoad) open(savedOpenParams);
  }, [factory, openOnScriptLoad, open, savedOpenParams]);

  return [
    { loading: loading || scriptLoading, error: error || scriptError },
    open,
  ];
};
