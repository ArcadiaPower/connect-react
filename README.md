# @arcadia-eng/utility-connect-react

Arcadia's general Developer Platform API documentation can be found at [developers.arcadia.com](https://developers.arcadia.com). The purpose of this package is to embed a user-facing interface where your customers can securely enter their utility credentials and create UtilityCredentials and Users that can be managed through the Developer Platform API.

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

The Utility Connect widget can be instantiated for one of two user flows: 
1. creating a new User (obtaining their credentials for the first time)
2. updating an existing User (changing their credentials if Arcadia no longer has correct credentials). 

The user flow is selected with the `config.scope` parameter described in the component API Reference below.

Note that instantiating the Utility Connect widget requires a one-time-use OAuth access token in order to authenticate API requests. See [Creating OAuth Tokens](https://developers.arcadia.com/#operation/createOAuthToken) for instructions. Note that the type of token to use (`grant_type`) differs if you are creating a user or updating a user -- see `config.accessToken` in the component API Reference below for details.

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
  componentDidMount() {
    this.props.utilityConnect.setData({ ... });
    this.props.utilityConnect.setCallbacks({ ... });
  }

  render() {
    const { ready, error, open } = this.utilityConnect;

    return (
      <button type="button" disabled={ready} onClick={() => open(config)}>
        Connect credentials
      </button>
    );
  }
}

export default withUtilityConnect(CreateCredentials, config);
```

# API Reference 

Please note that this package is still under active development and the API is subject to change.

## Config Options

| Name          | Type     | Description                                | Options                              | Required | Default  |
| ------------- | -------- | ------------------------------------------ | ------------------------------------ | -------- | -------- |
| `scope`       | `string` | User flow type                             | `['create', 'update']`               | No       | 'create' |
| `data`        | `object` | Data passed to the API                     | Content depends on value of `scope`  | Yes      | none     |
| `accessToken` | `string` | API [OAuth token](https://developers.arcadia.com/#operation/createOAuthToken) |                                      | Yes      | none     |
| `env`         | `string` | API environment                            | `['local', 'sandbox', 'production']` | Yes      | none     |
| `client`      | `string` | Name used to reference organization in app |                                      | Yes      | none     |
| `callbacks`   | `object` | Callback functions                         |                                      | No       | none     |
| `uiTheme`     | `string` | UI color theme                             | `['light', 'dark']`                  | No       | 'light'  |

### `config.scope`

Specifies the user flow. Defaults to `create`.

- `create`: Opens the Utility Connect service in the "create user" flow - input credentials will be used to create a user and corresponding utility credential record.
- `update`: Opens the Utility Connect service in the "update utility credentials" flow - input credentials will be used to update an existing utility credential record. This flow requires that you add `user.id` and `utilityCredential.id` into the `data` object.


### `config.data`

Data used to hydrate the Utility Connect front-end and interface with the API. The format of the `data` object is dependent on the user flow specified by the `scope` parameter.

#### `config.data` for `scope: 'create'`:

Example `config.data` when in the "creating user" flow:

```javascript
{
  user: {
    email: 'fake_email@example.com',
    firstName: 'First',
    lastName: 'Last',
    zipCode: '20009',
  }
}
```

Data is expected in the following format for the `create` scope:

| Data field | Description       | Required |
| --------------------- | ----------------- | -------- |
| `user` | Object specifying the User submitting their credentials | yes |
| `user.email`      | user's email      | yes      |
| `user.firstName`  | user's first name | yes      |
| `user.lastName`   | user's last name  | yes      |
| `user.zipCode`    | user's zip code   | no       |


#### `config.data` for `scope: 'update'`

Example `config.data` when in the "updating user" flow:

```javascript
{
  user: {
    id: 1, // user's id in the API
  },
  utilityCredential: {
    id: 2 // utility credential id in the API
  }
}
```

Data is expected in the following format for the `update` scope:

| Data Field   | Description          | Required |
| ------------ | -------------------- | -------- |
| `user.id `   | User ID for user being updated | yes      |
| `utilityCredential.id `  | User's UtilityCredential ID being updated | yes      |


### `config.accessToken`

An OAuth access token to authenticate API requests. See [Creating OAuth Tokens](https://developers.arcadia.com/#operation/createOAuthToken).

Note that the type of `accessToken` to be used depends on the user flow selected with the `scope` config param:

- For `scope: 'create'` configs, the `accessToken` must have been created with `scope: 'utility_connect', grant_type: 'client_credentials'`
- For `scope: 'update'` configs, the `accessToken` must have been created with `scope: 'utility_connect', grant_type: 'password', user_id: xxx`


### `config.env`

Determines which API the Utility Connect front-end points to

- `local`: Use this if you are interfacing with a local API. **You will almost never need this option.**
- `sandbox`: This references our sandbox API. Use this in your development, staging or test environments.
- `production`: This references our production API. **Only use this in your production app.**


### `config.client`

The name used to reference the client organization.


### `config.callbacks`

Callback functions triggered at key points in the Utility Connect flow. Expects an object with key/value pairs where keys are as documented below.

**`onClose`**: callback function that is triggered when the Utility Connect component is closed.

**`onError`**: callback function that is triggered when an error occurs during the Utility Connect flow.

**`onOpen`**: callback function that is triggered when the Utility Connect component is opened.

**`onSuccess`**: callback function that is triggered when utility credentials are successfully verified.

**`onTimeout`**: callback function that is triggered when the Utility Connect component times out awaiting verification of the utility credentials.

```javascript
{
  onClose: () => { ... },
  onError: ({ error }) => { ... },
  onOpen: () => { ... },
  onSuccess: ({ data: UtilityCredentialObject }) => { ... },
  onTimeout: ({ data: UtilityCredentialObject }) => { ... }
}
```

Where the `UtilityCredentialObject` looks like the following:

```javascript
{
  id: 12345
  user_id: 54321,
  utility_id: 2234,
  username: great_customer,
  verification_status: 'unverified',
  flags: [],
  verification_updated_at: '2021-01-24T14:15:23Z',
  created_at: '2021-01-24T14:15:22Z',
  updated_at: '2021-01-24T14:15:22Z'
}
```

| Key                       | Type    | Desc                                                                                |
| ------------------------- | ------- | ----------------------------------------------------------------------------------- |
| `id`                      | Integer | The utility credential id                                                           |
| `user_id`                 | Integer | The user id                                                                         |
| `utility_id`              | Integer | The utility id                                                                      |
| `username`                | String  | The username for the utility credential                                             |
| `verification_status`     | String  | The current verification status -- may be unverified or correct                     |
| `flags`                   | Array   | Flags on the utility credential. A detailed list can be found in the developer docs |
| `verification_updated_at` | Date    | The timestamp for the last verification status change                               |
| `created_at`              | Date    | The timestamp for when the record was created                                       |
| `updated_at`              | Date    | The timestamp for when the record was last updated                                  |

### `config.uiTheme`

Determines the UI color theme. Defaults to `light`.
