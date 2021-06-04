import { act, renderHook } from '@testing-library/react-hooks';
import useScript from 'react-script-hook';
import { generateUseScriptMock } from './test-utils';
import { useUtilityConnect } from '../src/use-utility-connect';

jest.mock('react-script-hook', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('useUtilityConnect', () => {
  beforeEach(() => {
    useScript.mockImplementation(generateUseScriptMock());
  });

  afterEach(() => {
    delete global.window._ArcadiaUtilityConnect;
  });

  it('has the expected values on load', async () => {
    const { result } = renderHook(() => useUtilityConnect());
    const [{ loading, error }, open] = result.current;
    expect(loading).toEqual(true);
    expect(error).toEqual(null);
  });

  it('returns the expected values if the script fails to load', async () => {
    useScript.mockImplementation(
      generateUseScriptMock({ throwScriptError: true })
    );
    const { result, waitFor } = renderHook(() => useUtilityConnect());
    let [{ loading, error }] = result.current;
    expect(loading).toEqual(true);
    expect(error).toEqual(null);
    await waitFor(() => expect(result.current[0].loading).toEqual(false));
    [{ loading, error }] = result.current;
    expect(loading).toEqual(false);
    expect(error.message).toMatch(/Error fetching script/);
  });

  it('returns the initialization error if the script loads but has trouble initializing', async () => {
    useScript.mockImplementation(
      generateUseScriptMock({ loadArcadiaElementSuccessfully: false })
    );
    const { result, waitFor } = renderHook(() => useUtilityConnect());
    let [{ loading, error }] = result.current;
    expect(loading).toEqual(true);
    expect(error).toEqual(null);
    await waitFor(() => expect(result.current[0].loading).toEqual(false));
    [{ loading, error }] = result.current;
    expect(loading).toEqual(false);
    expect(error.message).toMatch(
      /Error loading Arcadia utility connect service/
    );
  });

  describe('calling open', () => {
    it('can call open', async () => {
      const { result, waitFor } = renderHook(() => useUtilityConnect());
      const [{ loading, error }, open] = result.current;
      const sampleConfig = { ok: 'then' };
      await waitFor(() => expect(result.current[0].loading).toEqual(false));
      await act(async () => {
        await open(sampleConfig);
      });
      expect(window._ArcadiaUtilityConnect.create).toHaveBeenCalledWith(
        expect.objectContaining(sampleConfig)
      );
    });

    it('calls open once the script loads if you try to call it before the component has loaded', async () => {
      useScript.mockImplementation(generateUseScriptMock({ longLoad: true }));

      const { result, waitFor } = renderHook(() => useUtilityConnect());
      let [{ loading, error }, open] = result.current;
      expect(loading).toEqual(true);
      const sampleConfig = { ok: 'then' };
      await act(async () => {
        await open(sampleConfig);
      });
      expect(window._ArcadiaUtilityConnect).toBeUndefined();
      await waitFor(() =>
        expect(window._ArcadiaUtilityConnect).not.toBeUndefined()
      );
      expect(window._ArcadiaUtilityConnect.create).toHaveBeenCalledWith(
        expect.objectContaining(sampleConfig)
      );
    });

    it("validates the configuration, and, if it's invalid, it throws an error", async () => {
      useScript.mockImplementation(
        generateUseScriptMock({ validationErrors: true })
      );
      const { result, waitFor } = renderHook(() => useUtilityConnect());
      await waitFor(() => expect(result.current[0].loading).toEqual(false));
      const open = result.current[1];
      const sampleConfig = { ok: 'then' };
      await act(async () => {
        await open(sampleConfig);
      });
      const [{ loading, error }] = result.current;
      expect(loading).toEqual(false);
      expect(window._ArcadiaUtilityConnect.validate).toHaveBeenCalledWith(
        sampleConfig
      );
      expect(error.message).toMatch(/Error setting configuration variables/);
      expect(error.message).toMatch(/Missing \"accessToken\" value/);
      expect(error.message).toMatch(/Missing \"client\" value/);
      expect(window._ArcadiaUtilityConnect.create).not.toHaveBeenCalled();
    });

    it("shows an error if Arcadia's create function fails for any reason", async () => {
      useScript.mockImplementation(
        generateUseScriptMock({ createError: true })
      );
      const { result, waitFor } = renderHook(() => useUtilityConnect());
      await waitFor(() => expect(result.current[0].loading).toEqual(false));
      const open = result.current[1];
      await act(async () => {
        await open({});
      });
      const [{ loading, error }] = result.current;
      expect(loading).toEqual(false);
      expect(error.message).toMatch(
        /Error loading Arcadia utility connect service/
      );
    });

    it('can pass an onClose function via the configuration to the utility connect component', async () => {
      const { result, waitFor } = renderHook(() => useUtilityConnect());
      await waitFor(() => expect(result.current[0].loading).toEqual(false));
      const open = result.current[1];
      const sampleConfig = { callbacks: { onClose: jest.fn() } };
      await act(async () => {
        await open(sampleConfig);
      });
      const initializationObject =
        window._ArcadiaUtilityConnect.create.mock.calls[0][0];
      act(() => {
        initializationObject.callbacks.onClose();
      });
      expect(sampleConfig.callbacks.onClose).toHaveBeenCalled();
    });
  });
});
