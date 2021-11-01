import React from 'react';
import {
  act,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useScript from 'react-script-hook';
import { generateUseScriptMock } from './test-utils';
import { withConnect } from '../src/with-connect';

jest.mock('react-script-hook', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const generateSampleConfig = () => ({
  env: 'sandbox',
  connectToken: 'this_is_a_super_secret_token',
});

class MockCredentialComponentClass extends React.Component {
  render() {
    const config = this.props.config ?? generateSampleConfig();
    const { loading, error, open } = this.props.connect;
    return (
      <div>
        {loading && <div>Loading...</div>}
        {error && <div role="alert">{error.message}</div>}
        <button type="button" disabled={loading} onClick={() => open(config)}>
          {this.props.buttonLabel}
        </button>
      </div>
    );
  }
}

const MockCredentialComponentWithHOC = withConnect(
  MockCredentialComponentClass
);

describe('withConnect', () => {
  let props;
  beforeEach(() => {
    useScript.mockImplementation(generateUseScriptMock());
    props = { buttonLabel: 'Click me!' };
  });

  afterEach(() => {
    delete global.window._ArcConnect;
  });

  it("can forward props to the component it's wrapping", () => {
    render(<MockCredentialComponentWithHOC {...props} />);
    expect(
      screen.getByRole('button', { name: 'Click me!' })
    ).toBeInTheDocument();
  });

  it('properly passes loading and error on initialization', () => {
    render(<MockCredentialComponentWithHOC {...props} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('passes an error if the script fails to load', async () => {
    useScript.mockImplementation(
      generateUseScriptMock({ throwScriptError: true })
    );
    render(<MockCredentialComponentWithHOC {...props} />);
    const alert = await screen.findByRole('alert');
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(alert).toHaveTextContent(/Error fetching script/);
  });

  it('returns the initialization error if the script loads but has trouble initializing', async () => {
    useScript.mockImplementation(
      generateUseScriptMock({ loadArcadiaElementSuccessfully: false })
    );
    render(<MockCredentialComponentWithHOC {...props} />);
    const alert = await screen.findByRole('alert');
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(alert).toHaveTextContent(/Error loading Connect/);
  });

  describe('calling open', () => {
    let mockConfig;
    beforeEach(() => {
      mockConfig = generateSampleConfig();
    });

    const clickOpen = async () => {
      await waitFor(() => expect(screen.getByRole('button')).toBeEnabled());
      userEvent.click(screen.getByRole('button', { name: 'Click me!' }));
      await waitForElementToBeRemoved(screen.getByText('Loading...'));
    };

    it('can call open', async () => {
      render(<MockCredentialComponentWithHOC {...props} />);
      await clickOpen();
      expect(window._ArcConnect.create).toHaveBeenCalledWith(
        expect.objectContaining(mockConfig)
      );
    });

    it("validates the configuration, and, if it's invalid, it throws an error", async () => {
      useScript.mockImplementation(
        generateUseScriptMock({ validationErrors: true })
      );
      render(<MockCredentialComponentWithHOC {...props} />);
      await clickOpen();
      expect(window._ArcConnect.validate).toHaveBeenCalledWith(mockConfig);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent(/Error setting configuration variables/);
      expect(alert).toHaveTextContent(/Missing \"connectToken\" value/);
      expect(alert).toHaveTextContent(/Missing \"somethingImportant\" value/);
      expect(window._ArcConnect.create).not.toHaveBeenCalled();
    });

    it("shows an error if Arcadia's create function fails for any reason", async () => {
      useScript.mockImplementation(
        generateUseScriptMock({ createError: true })
      );
      render(<MockCredentialComponentWithHOC {...props} />);
      await clickOpen();
      expect(window._ArcConnect.validate).toHaveBeenCalledWith(mockConfig);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent(/Error loading Connect/);
    });

    it('can pass an onClose function via the configuration to the utility connect component', async () => {
      mockConfig = { callbacks: { onClose: jest.fn() } };
      props.config = mockConfig;

      render(<MockCredentialComponentWithHOC {...props} />);
      await clickOpen();
      const initializationObject = window._ArcConnect.create.mock.calls[0][0];
      await act(async () => {
        await initializationObject.callbacks.onClose();
      });
      expect(mockConfig.callbacks.onClose).toHaveBeenCalled();
    });
  });
});
