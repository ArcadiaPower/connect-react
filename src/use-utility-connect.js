import { useState, useEffect } from 'react';
import useScript from 'react-script-hook';

const src = 'https://utility-connect-main.prod.arcadia.com/dist/index.js';
const initializeErrorMessage = 'Error loading Arcadia utility connect widget';

export const useUtilityConnect = config => {
  const [initializeError, setInitializeError] = useState();
  const [factory, setFactory] = useState();
  const [utilityConnect, setUtilityConnect] = useState();

  const [loading, error] = useScript({ src, checkForExisting: true });

  useEffect(() => {
    if (loading || error) return;

    const { _ArcadiaUtilityConnect } = window;
    if (!_ArcadiaUtilityConnect) {
      setInitializeError(new Error(initializeErrorMessage));
    } else {
      setFactory(window._ArcadiaUtilityConnect);
    }
  }, [loading, error]);

  const open = () => {
    if (!factory) return;

    const onClose = () => {
      config?.onClose();
      setUtilityConnect(undefined);
    };

    const utilityConnect = factory.create({ ...config, onClose });
    setUtilityConnect(utilityConnect);
  };

  return [{ loading, error: error || initializeError }, open];
};
