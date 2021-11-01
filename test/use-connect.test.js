import { act, renderHook } from '@testing-library/react-hooks';
import useScript from 'react-script-hook';
import { generateUseScriptMock } from './test-utils';
import { useConnect } from '../src/use-connect';

jest.mock('react-script-hook', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('useConnect', () => {
  beforeEach(() => {
    useScript.mockImplementation(generateUseScriptMock());
  });

  afterEach(() => {
    delete global.window._ArcConnect;
  });

  it('has the expected values on load', async () => {
    const { result } = renderHook(() => useConnect());
    const [{ loading, error }, open] = result.current;
    expect(loading).toEqual(true);
    expect(error).toEqual(null);
  });

  it('returns the expected values if the script fails to load', async () => {
    useScript.mockImplementation(
      generateUseScriptMock({ throwScriptError: true })
    );
    const { result, waitFor } = renderHook(() => useConnect());
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
    const { result, waitFor } = renderHook(() => useConnect());
    let [{ loading, error }] = result.current;
    expect(loading).toEqual(true);
    expect(error).toEqual(null);
    await waitFor(() => expect(result.current[0].loading).toEqual(false));
    [{ loading, error }] = result.current;
    expect(loading).toEqual(false);
    expect(error.message).toMatch(/Error loading Connect/);
  });

  describe('calling open', () => {
    it('can call open', async () => {
      const { result, waitFor } = renderHook(() => useConnect());
      const [{ loading, error }, open] = result.current;
      const sampleConfig = { ok: 'then' };
      await waitFor(() => expect(result.current[0].loading).toEqual(false));
      await act(async () => {
        await open(sampleConfig);
      });
      expect(window._ArcConnect.create).toHaveBeenCalledWith(
        expect.objectContaining(sampleConfig)
      );
    });

    it('calls open once the script loads if you try to call it before the component has loaded', async () => {
      useScript.mockImplementation(generateUseScriptMock({ longLoad: true }));

      const { result, waitFor } = renderHook(() => useConnect());
      let [{ loading, error }, open] = result.current;
      expect(loading).toEqual(true);
      const sampleConfig = { ok: 'then' };
      await act(async () => {
        await open(sampleConfig);
      });
      expect(window._ArcConnect).toBeUndefined();
      await waitFor(() => expect(window._ArcConnect).not.toBeUndefined());
      expect(window._ArcConnect.create).toHaveBeenCalledWith(
        expect.objectContaining(sampleConfig)
      );
    });

    it("validates the configuration, and, if it's invalid, it throws an error", async () => {
      useScript.mockImplementation(
        generateUseScriptMock({ validationErrors: true })
      );
      const { result, waitFor } = renderHook(() => useConnect());
      await waitFor(() => expect(result.current[0].loading).toEqual(false));
      const open = result.current[1];
      const sampleConfig = { ok: 'then' };
      await act(async () => {
        await open(sampleConfig);
      });
      const [{ loading, error }] = result.current;
      expect(loading).toEqual(false);
      expect(window._ArcConnect.validate).toHaveBeenCalledWith(sampleConfig);
      expect(error.message).toMatch(/Error setting configuration variables/);
      expect(error.message).toMatch(/Missing \"connectToken\" value/);
      expect(error.message).toMatch(/Missing \"somethingImportant\" value/);
      expect(window._ArcConnect.create).not.toHaveBeenCalled();
    });

    it("shows an error if Arcadia's create function fails for any reason", async () => {
      useScript.mockImplementation(
        generateUseScriptMock({ createError: true })
      );
      const { result, waitFor } = renderHook(() => useConnect());
      await waitFor(() => expect(result.current[0].loading).toEqual(false));
      const open = result.current[1];
      await act(async () => {
        await open({});
      });
      const [{ loading, error }] = result.current;
      expect(loading).toEqual(false);
      expect(error.message).toMatch(/Error loading Connect/);
    });

    it('can pass an onClose function via the configuration Connect', async () => {
      const { result, waitFor } = renderHook(() => useConnect());
      await waitFor(() => expect(result.current[0].loading).toEqual(false));
      const open = result.current[1];
      const sampleConfig = { callbacks: { onClose: jest.fn() } };
      await act(async () => {
        await open(sampleConfig);
      });
      const initializationObject = window._ArcConnect.create.mock.calls[0][0];
      act(() => {
        initializationObject.callbacks.onClose();
      });
      expect(sampleConfig.callbacks.onClose).toHaveBeenCalled();
    });
  });
});
