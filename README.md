## @arcadia-eng/utility-connect-react

This package is a React wrapper around Arcadia's Utility Connect service. It provides two ways to integrate the component into your React application - via hooks and via HoCs (higher order components).

## Installation

Via npm:

```
npm i @arcadia-eng/utility-connect-react
```

Via yarn:

```
yarn add @arcadia-eng/utility-connect-react
```

## Quick start

### Hook implementation

This is the recommended implementation strategy. See [/examples/hooks.js](./examples/hook.js) for a full example with callback functions defined. Note the required configuration options [below](#config-options).

```javascript
import { useUtilityConnect } from '@arcadia-eng/utility-connect-react';

const CreateCredentials = props => {
  const config = { ... };

  const [{ loading, error }, open] = useUtilityConnect(config);

  return (
    <button type="button" disabled={loading} onClick={() => open()}>
      Connect credentials
    </button>
  );
};

export default CreateCredentials;
```

### HoC implementation

We provide a HoC strategy in case you are using class components. Note that this implementation still leverages hooks under the hood. See [/examples/hoc.js](./examples/hoc.js) for the full example with callback functions defined. Note the required configuration options [below](#config-options)

```javascript
import { withUtilityConnect } from '@arcadia-eng/utility-connect-react';

const config = { ... };

class CreateCredentials extends React.Component {
  componentDidMount() {
    this.props.utilityConnect.setData({ ... });
    this.props.utilityConnect.setCallbacks({ ... });
  }

  render() {
    const { ready, error, open } = this.utilityConnect;

    return (
      <button type="button" disabled={ready} onClick={() => open()}>
        Connect credentials
      </button>
    );
  }
}

export default withUtilityConnect(CreateCredentials, config);
```

## Documentation

Arcadia's Enterprise API documentation can be found [here](https://arcadiapower.github.io/enterprise-api/).

Please note that this package is still under active development and has yet to release a stable version. More comprehensive documentation will be released alongside a stable version of this package.

### Config options

| Name          | Type     | Description                                | Options                              | Required | Default  |
| ------------- | -------- | ------------------------------------------ | ------------------------------------ | -------- | -------  |
| `scope`       | `string` | User flow type                             | `['create', 'update']`               | No       | 'create' |
| `env`         | `string` | API environment                            | `['local', 'staging', 'production']` | Yes      | none     |
| `accessToken` | `string` | API token for authenticating requests      |                                      | Yes      | none     |
| `client`      | `string` | Name used to reference organization in app |                                      | Yes      | none     |
| `data`        | `object` | Data passed to the api                     |                                      | Yes      | none     |
| `callbacks`   | `object` | Callback functions                         |                                      | No       | none     |
| `uiTheme`     | `string` | UI color theme                             | `['light', 'dark']`                  | No       | 'light'  |

#### scope

Specifies the user flow. Defaults to `create`.

- `create`: Opens the Utility Connect service in the "create user" flow - input credentials will be used to create a user and corresponding utility credential record.
- `update`: Opens the Utility Connect service in the "update utility credentials" flow - input credentials will be used to update an existing utility credential record. This flow requires that you add `user.id` and `utilityCredential.id` into the `data` object.

#### env

Determines which API the Utility Connect front-end points to

- `local`: Use this if you are interfacing with a local API. **You will almost never need this option.**
- `staging`: This references our staging API. Use this in your development and staging environments.
- `production`: This references our production API. **Only use this in your production app.**

#### accessToken

This is the token used to authenticate API requests. If you are integrating with this tool you should have instructions on how to generate tokens for your client. Note that the type of `accessToken` needed to instantiate the component depends on the "user flow."

#### `create` scope

The component needs a standard server-side generated access token. More details on generating standard server-side tokens can be found in the [API documentation](https://arcadiapower.github.io/enterprise-api/).

#### `update` scope

The `accessToken` must be scoped to the user in order to update a user's utility credentials. More details on creating scoped tokens can be found in the [API documentation](https://arcadiapower.github.io/enterprise-api/).

#### client

The name used to reference the client organization.

#### data

Data used to hydrate the Utility Connect front-end and interface with the API.

#### `create` scope

Data is expected in the following format for the `create` scope:

```javascript
{
  user: {
    email: 'fake_email@example.com', // user's email
    firstName: 'First', // user's first name
    lastName: 'Last' // user's last name
  }
}
```

#### `update` scope

Data is expected in the following format for the `update` scope:

```javascript
{
  user: {
    id: 1, // user's id in API
  },
  utilityCredential: {
    id: 2 // utility credential id in API
  }
}
```

#### callbacks

Callback functions triggered at key points in the Utility Connect flow. Expects an object with key/value pairs where keys are as documented below.

**`onEmit`**: callback function that is triggered when utility credentials are either created or updated in the API.

**`onOpen`**: callback function that is triggered when the Utility Connect component is opened.

**`onClose`**: callback function that is triggered when the Utility Connect component is closed.

```javascript
{
  onEmit: ({ error, data }) => { ... },
  onOpen: () => { ... },
  onClose: () => { ... }
}
```

#### uiTheme

Determines the UI color theme. Defaults to `light`.
