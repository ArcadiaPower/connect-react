import { useUtilityConnect } from './use-utility-connect';

export const withUtilityConnect = (Component, config) => props => {
  const [data, setData] = useState(undefined);
  const [callbacks, setCallbacks] = useState(undefined);

  const [{ loading, error }, open] = useUtilityConnect({
    ...config,
    callbacks,
  });

  const ready = !loading && !error && !!data && !!callbacks;

  const utilityConnect = {
    ready,
    loading,
    error,
    open,
    setData,
    setCallbacks,
  };

  return <Component {...props} utilityConnect={utilityConnect} />;
};
