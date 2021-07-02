# @arcadia-eng/utility-connect-react

Arcadia's general Developer Platform API documentation can be found at [developers.arcadia.com](https://developers.arcadia.com). The purpose of this package is to embed a user-facing interface where your customers can securely enter their utility credentials. The submission of their utility-related credentials will create UtilityCredentials and UtilityAccounts that can be managed through the Platform API.

This package is a React wrapper around Arcadia's Utility Connect service. It provides two ways to integrate the component into your React application - via hooks and via HoCs (higher order components).

# Installation

Via npm:

```
npm i @arcadia-eng/utility-connect-react
```

Via yarn:

```
yarn add @arcadia-eng/utility-connect-react
```

# Quick Start

Instantiating the Utility Connect component requires a Utility Connect Token in order to authenticate API requests. See [Creating Utility Connect Tokens](https://developers.arcadia.com/#section/Authentication/Utility-Connect) for instructions. Note that an Access Token will not work for this purpose.

If the Utility Connect Token is instantiated with an exisiting `utility_credential_id`, then Utility Connect will update the existing UtilityCredential. This is referred to in the documentation as 'update' mode. Otherwise, Utility Connect will create a new, unique UtilityCredential which is referred to as 'create' mode.

Utility Connect automatically infers the correct user flow (either 'update' or 'create') from the Utility Connect Token. When in 'create' mode, the user will pass through the entire Utility Connect flow, including the Consent Pane (accepting terms of service), Utility Pane (selecting a utility), and Credential Pane (entering utility credentials). When in 'update' mode, the user will be immediately placed on the Credentials Pane in order to reduce user friction. 


## Hook implementation

This is the recommended implementation strategy. See [/examples/hooks.js](./examples/hook.js) for a full example with callback functions defined. Note the required configuration options [below](#config-options).

```javascript
import { useUtilityConnect } from '@arcadia-eng/utility-connect-react';

const CreateCredentials = props => {
  const config = { ... }; // See "Config Options" in the API Reference

  const [{ loading, error }, open] = useUtilityConnect();

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
import { withUtilityConnect } from '@arcadia-eng/utility-connect-react';

const config = { ... }; // See "Config Options" in the API Reference

class CreateCredentials extends React.Component {
  render() {
    const { loading, error, open } = this.props.utilityConnect;

    return (
      <button type="button" disabled={loading} onClick={() => open(config)}>
        Connect credentials
      </button>
    );
  }
}

export default withUtilityConnect(CreateCredentials);
```

# API Reference

Please note that this package is still under active development and the API is subject to change.

## Config Options

| Name                  | Type     | Description                                                                                     | Options                     | Required | Default |
| --------------------- | -------- | ----------------------------------------------------------------------------------------------- | --------------------------- | -------- | ------- |
| `utilityConnectToken` | `string` | [Utility Connect Token](https://developers.arcadia.com/#section/Authentication/Utility-Connect) |                             | Yes      | none    |
| `env`                 | `string` | API environment                                                                                 | `['sandbox', 'production']` | Yes      | none    |
| `newCredentialData`   | `object` | Data used to prefill new credentials - only available in 'create' mode                          |                             | No       | none    |
| `callbacks`           | `object` | Callback functions                                                                              |                             | No       | none    |
| `uiTheme`             | `string` | UI color theme                                                                                  | `['light', 'dark']`         | No       | 'light' |

### `config.newCredentialData`

Data that would be used to pre-fill fields prior to credential submission of a new user. Only available for a Utility Connect Token in `create` mode. If this field is not `null` but the Utility Connect Token is associated with an existing UtilityCredential (ie. 'update' mode), an error will be thrown.

Example `config.newCredentialData` when in the "creating user" flow:

```javascript
{
  zipCode: '11787';
}
```

Data is expected in the following format:

| Data field | Description     | Required |
| ---------- | --------------- | -------- |
| `zipCode`  | user's zip code | no       |

### `config.utilityConnectToken`

An access token to create or update credentials. See [Utility Connect Auth](https://developers.arcadia.com/#section/Authentication/Utility-Connect) for more details on how to create a Utility Connect Token.

### `config.env`

Determines which API the Utility Connect front-end points to

- `sandbox`: This references our sandbox API. Use this in your development, staging or test environments.
- `production`: This references our production API. **Only use this in your production app.**

### `config.callbacks`

Callback functions triggered at key points in the Utility Connect flow. Expects an object with key/value pairs where keys are as documented below.

**`onCredentialsSubmitted`**: callback function that is triggered when the user has clicked the button to submit their credentials. Passes along an object with `utilityCredentialId` which can optionally be used by the containing application to poll the status of credential verification via the client's backend (which has awareness of the associated `client_user_id`).
**`onOpen`**: callback function that is triggered when the Utility Connect component is opened.
**`onError`**: callback function that is triggered when an error occurs during the Utility Connect flow.
**`onClose`**: callback function that is triggered when the Utility Connect is closed. The user could have closed it by clicking outside the modal or clicking a button to dismiss the modal after an error, a successful credential validation or a timeout. Provided `status` string parameter indicates the final credential submission state when Utility Component was closed. If Utility Connect was manually closed via the `close` function, the latest credential submission state will be returned. Possible states:

- `'verified'` : the credentials were confirmed to be correct
- `'rejected'` : the credentials were confirmed to be incorrect
- `'timed_out'`: Utility Connect times out awaiting verification of the utility credentials. In this case, if clients later receive the `UtilityCredentialRejected` webhook or confirm rejection through the UtilityCredentials API endpoint, client will likely want to redirect the user back Utility Connect (via in-app notifications or emails). If the user needs to update their credentials, the client should fetch a `UtilityConnectToken` with the pre-existing `utility_credential_id` so that Utility Connect opens in "update" mode.
- `'pending_verification'`: the user submitted credentials but closed Utility Connect before the component could get updated with the result
- `'no_submit'`: the user never submitted their credentials
- `'error'`: there was an API error during the Utility Connect flow and the user clicked a button to confirm as such and close Utility Connect

```javascript
{
  onCredentialsSubmitted: ({ utilityCredentialId }) => { ... },
  onClose: ({ status }) => { ... },
  onError: ({ error }) => { ... },
  onOpen: () => { ... },
}
```

### `config.uiTheme`

Determines the UI color theme. Defaults to `light`.
