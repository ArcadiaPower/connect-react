import { useState, useEffect, useCallback, useRef } from 'react';
import useScript from 'react-script-hook';

const MAX_POLL_NUMBER = 3;
const POLLING_INTERVAL = 100;

const src = 'https://connect-main.prod.arcadia.com/dist/v5.js';

const scriptLoadError = new Error(
  'Error fetching script - please check your internet connection.'
);
const initializeError = new Error(
  'Error loading Connect - we are working to fix the issue.'
);

const getConfigError = errors => {
  const message = Object.values(errors).join(' ');
  return new Error(`Error setting configuration variables: ${message}`);
};

export const useConnect = () => {
  const [utilityConnectError, setUtilityConnectError] = useState();
  const [widgetOpening, setWidgetOpening] = useState(false);
  const [factory, setFactory] = useState();

  const [openOnScriptLoad, setOpenOnScriptLoad] = useState(false);
  const [savedOpenParams, setSavedOpenParams] = useState();
  const pollForFactoryTimeout = useRef(null);

  const pollingCount = useRef(0);

  const [scriptLoading, scriptError] = useScript({
    src,
    checkForExisting: true,
  });

  const pollForFactory = useCallback(() => {
    const { _ArcConnect } = window;
    if (_ArcConnect) {
      setFactory(_ArcConnect);
      return;
    }

    if (pollingCount.current === MAX_POLL_NUMBER) {
      pollingCount.current = 0;
      setUtilityConnectError(initializeError);
    } else {
      pollingCount.current += 1;
      pollForFactoryTimeout.current = setTimeout(
        pollForFactory,
        POLLING_INTERVAL
      );
    }
  }, []);

  useEffect(() => {
    if (scriptLoading || scriptError) return;

    /**
     * Note: 2021-07-13
     * There is an issue with the underlying package where sometimes scriptLoading
     * will be false while the script is still executing (https://github.com/hupe1980/react-script-hook/issues/17)
     *
     * Because of this issue, we should poll for the factory for a short period
     * of time before returning an error
     */
    pollForFactory();

    return () => clearTimeout(pollForFactoryTimeout.current);
  }, [scriptLoading, scriptError, pollForFactory]);

  useEffect(() => {
    if (scriptError) setUtilityConnectError(scriptLoadError);
  }, [scriptError]);

  const open = useCallback(
    async config => {
      if (!factory) {
        setSavedOpenParams(config);
        setOpenOnScriptLoad(true);
        return;
      }

      setWidgetOpening(true);
      try {
        const configErrors = await factory.validate(config);
        if (configErrors) {
          setUtilityConnectError(getConfigError(configErrors));
        } else {
          const utilityConnect = await factory.create(config);
        }
        setWidgetOpening(false);
      } catch (e) {
        setUtilityConnectError(initializeError);
        setWidgetOpening(false);
      }
    },
    [factory]
  );

  useEffect(() => {
    if (factory && openOnScriptLoad) open(savedOpenParams);
  }, [factory, openOnScriptLoad, open, savedOpenParams]);

  const error = utilityConnectError || scriptError;

  return [
    {
      loading: (!factory && !error) || widgetOpening,
      error,
    },
    open,
  ];
};
