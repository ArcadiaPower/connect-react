import { useEffect, useRef, useState } from 'react';

export const generateUseScriptMock = ({
  createError = false,
  throwScriptError = false,
  loadArcadiaElementSuccessfully = true,
  longLoad = false,
  validationErrors = false,
} = {}) => {
  const mockArcadiaUtilityConnect = {
    create: jest.fn(),
    validate: jest.fn().mockReturnValue(),
  };

  if (validationErrors)
    mockArcadiaUtilityConnect.validate.mockReturnValue([
      'Missing "accessToken" value.',
      'Missing "client" value.',
    ]);

  if (createError)
    mockArcadiaUtilityConnect.create.mockImplementation(() => {
      throw new Error('Oh no');
    });

  const useScript = () => {
    const [scriptLoading, setScriptLoading] = useState(true);
    const [scriptError, setScriptError] = useState(null);
    const simulatedLoadCancelled = useRef(false);

    useEffect(() => {
      const simulateLoad = async () => {
        // Wait 1 "tick" so we can see test the initial loading state
        const loadTime = longLoad ? 200 : 0;
        await new Promise(r => setTimeout(r, loadTime));

        // Prevent state updates after unmount
        if (simulatedLoadCancelled.current) return;

        setScriptLoading(false);
        if (throwScriptError) {
          setScriptError(new Error('Something went wrong'));
        } else if (loadArcadiaElementSuccessfully) {
          window._ArcadiaUtilityConnect = mockArcadiaUtilityConnect;
        }
      };
      simulateLoad();
      return () => (simulatedLoadCancelled.current = true);
    }, []);
    return [scriptLoading, scriptError];
  };
  return useScript;
};
