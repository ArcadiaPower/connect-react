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

This is the recommended implementation strategy. See [/examples/hooks.js](./examples/hook.js) for the full example.

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

We provide an HoC strategy in case you are using class components. Note that this implementation is still leveraging hooks under the hood. See [/examples/hoc.js](./examples/hoc.js) for the full example.

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

If you are looking for the API documentation, you can find that [here](https://arcadiapower.github.io/enterprise-api/).

Please note that this package is still under active development and has yet to release a stable version. More comprehensive documentation will be released along with a stable version.

### Config options

| Name          | Type     | Description                                | Options                              | Required |
| ------------- | -------- | ------------------------------------------ | ------------------------------------ | -------- |
| `scope`       | `string` | User flow type                             | `['create', 'update']`               | No       |
| `env`         | `string` | API environment                            | `['local', 'staging', 'production']` | Yes      |
| `accessToken` | `string` | API token for authenticating requests      |                                      | Yes      |
| `client`      | `string` | Name used to reference organization in app |                                      | Yes      |
| `data`        | `object` | Data passed to the api                     |                                      | Yes      |
| `callbacks`   | `object` | Callback functions                         |                                      | No       |
| `uiTheme`     | `string` | UI color theme                             | `['light', 'dark']`                  | No       |

#### scope

Specifies the user flow. Defaults to `create`.

- `create`: Opens the Utility Connect service in the "create" flow - input credentials will be used to create a user and corresponding utility credential record.
- `update`: Opens the Utility Connect service in the "update" flow - input credentials will be used to update an existing utility credential record. Requires that you add `user.id` and `utilityCredential.id` in the `data` object.

#### env

Determines which API the Utility Connect front-end points to

- `local`: Use this if you are interfacing with a local API. **You will almost never need this option.**
- `staging`: This references our staging API. Use this in your development and staging environments.
- `production`: This references our production API. **Only use this in your production app.**

#### accessToken

Token used to authenticate API requests. If you are integrating with this tool you should have instructions on how to generate such a token. Future documentation will be built out to explicitly document this process.

#### client

The name used to reference the client organization.

#### data

Data used to hydrate the Utility Connect front-end and interface with the API.

Expect data in this shape for the `create` scope:

```javascript
{
  user: {
    email: 'fake_email@example.com', // user's email
    firstName: 'Falsey', // user's first name
    lastName: 'Farcicle' // user's last name
  }
}
```

Expect data in this shape for the `update` scope:

```javascript
{
  user: {
    id: 1, // user's id in API
    email: 'fake_email@example.com', // user's email
    firstName: 'Falsey', // user's first name
    lastName: 'Farcicle' // user's last name
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
