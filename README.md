# @arcadia-eng/connect-react

Arcadia's general Developer Platform API documentation can be found at [docs.arcadia.com](https://docs.arcadia.com). The purpose of this package is to embed a user-facing interface where your customers can securely enter their utility credentials. The submission of user's utility-related credentials will create UtilityCredentials and UtilityAccounts that can be managed through the Arc API.

This package is a React wrapper around Arc's Connect. It provides two ways to integrate the component into your React application - via hooks and via HoCs (higher order components).

As an alternative to using this package, Arc’s Connect can also be presented to your user through a URL. A Connect URL can be generated through [this endpoint](https://docs.arcadia.com/reference/createconnecturl). The URL approach differs from this React package in that the URL does not have any [config options](https://docs.arcadia.com/reference/createconnecturl) and does not respond with [callbacks](https://docs.arcadia.com/reference/createconnecturl) for an application to interpret.

# Installation

Via npm:

```
npm i @arcadia-eng/connect-react
```

Via yarn:

```
yarn add @arcadia-eng/connect-react
```

# Quick Start

A Connect Token is required to instantiate Connect. See [Getting a Connect Token to initialize Connect](https://docs.arcadia.com/docs#getting-a-connect-token-to-initialize-connect) for instructions. Keep in mind the following:

- A general Access Token will not work to instantiate Connect
- Using sandbox API keys to create a Connect Token will create resources in the sandbox environment
- Using production API keys to create a Connect Token will create resources in the production environment

Connect Tokens can be created for a new or existing connection. Connect automatically infers the correct user flow (either 'update' or 'create') from the Connect Token. When in 'create' mode, the user will pass through the entire Connect flow, including the Consent Pane (accepting terms of service), Utility Pane (selecting a utility), and Credential Pane (entering utility credentials). When in 'update' mode, the user will bypass entry content and be placed directly on the Credentials Pane.

## Hook implementation

This is the recommended implementation strategy. See [/examples/hooks.js](./examples/hook.js) for a full example with callback functions defined. Note the required configuration options [below](#config-options).

```javascript
import { useConnect } from '@arcadia-eng/connect-react';

const CreateCredentials = props => {
  const config = { ... }; // See "Config Options" in the API Reference

  const [{ loading, error }, open] = useConnect();

  return (
    <button type="button" disabled={loading} onClick={() => open(config)}>
      Connect credentials
    </button>
  );
};

export default CreateCredentials;
```

## HoC implementation

We provide a HoC strategy in case you are using class components. Note that this implementation still leverages hooks under the hood. See [/examples/hoc.js](./examples/hoc.js) for the full example with callback functions defined. Note the required configuration options [below](#config-options)

```javascript
import { withConnect } from '@arcadia-eng/connect-react';

const config = { ... }; // See "Config Options" in the API Reference

class CreateCredentials extends React.Component {
  render() {
    const { loading, error, open } = this.props.connect;

    return (
      <button type="button" disabled={loading} onClick={() => open(config)}>
        Connect credentials
      </button>
    );
  }
}

export default withConnect(CreateCredentials);
```

# API Reference

Please note that this package is still under active development and the API is subject to change.

## Config Options

| Name                | Type     | Description                                                                     | Options | Required | Default |
| ------------------- | -------- | ------------------------------------------------------------------------------- | ------- | -------- | ------- |
| `connectToken`      | `string` | [Connect Token](https://docs.arcadia.com/reference/createconnecttoken) |         | Yes      | none    |
| `newCredentialData` | `object` | Data used to prefill new credentials - only available in 'create' mode          |         | No       | none    |
| `callbacks`         | `object` | Callback functions                                                              |         | No       | none    |

### `config.newCredentialData`

Data that would be used to pre-fill fields prior to credential submission of a new user. Only available for a Connect Token in `create` mode. An error will be thrown if this field is populated in 'update' mode.

Example `config.newCredentialData` when in the "creating user" flow:

```javascript
{
  zipCode: '11216',
  utilityId: '2337'
}
```

Data is expected in the following format:

| Data field  | Description                                                                             | Required |
| ----------- | --------------------------------------------------------------------------------------- | -------- |
| `zipCode`   | user's zip code                                                                         | no       |
| `utilityId` | [ID of the user's utility](https://arc.arcadia.com/coverage) | no       |

### `config.ConnectToken`

An access token to create or update credentials. See [Getting a Connect Token to initialize Connect](https://docs.arcadia.com/docs#getting-a-connect-token-to-initialize-connect) for more details on how to create a Connect Token.

### `config.callbacks`

Callback functions triggered at key points in the Connect flow. Expects an object with key/value pairs where keys are as documented below.

**`onCredentialsSubmitted`**: callback function that is triggered when the user has clicked the button to submit their credentials. Passes along an object with `utilityCredentialId` which can optionally be used by the containing application to poll the status of credential verification via the client's backend (which has awareness of the associated `client_user_id`).

**`onOpen`**: callback function that is triggered when the Connect component is opened.

**`onError`**: callback function that is triggered when an error occurs during the Connect flow.

**`onClose`**: callback function that is triggered when Connect is closed. The user could have closed it by clicking outside the modal or clicking a button to dismiss the modal after an error, a successful credential validation or a timeout. Provided `status` string parameter indicates the final credential submission state when Utility Component was closed. If Connect was manually closed via the `close` function, the latest credential submission state will be returned. Possible states:

- `'verified'` : The credentials were confirmed to be correct
- `'rejected'` : The credentials were confirmed to be incorrect
- `'timed_out'`: Connect times out awaiting verification of the utility credentials. In this case, if clients later receive the `UtilityCredentialRejected` webhook or confirm rejection through the UtilityCredentials API endpoint, client will likely want to redirect the user back Connect (via in-app notifications or emails). If the user needs to update their credentials, the client should fetch a `UtilityConnectToken` with the pre-existing `utility_credential_id` so that Connect opens in "update" mode.
- `'pending'`: The user submitted credentials but closed Connect before the component could get updated with the result
- `'no_submit'`: The user never submitted their credentials
- `'error'`: There was an API error during the Connect flow. The user clicked to confirm the error and closed Connect.

```javascript
{
  onCredentialsSubmitted: ({ utilityCredentialId }) => { ... },
  onClose: ({ status }) => { ... },
  onError: ({ error }) => { ... },
  onOpen: () => { ... },
}
```
