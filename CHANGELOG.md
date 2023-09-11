# Changelog

## 7.2.0

- Updates node version to LTS 18.12.0

## 7.1.0

- Updates react-script-hook to 1.7.2
- Expands peer dependencies to include react 18

# 7.0.0

- Fixes major issue with Connect source url
- **Breaking change**: All prior versions will be marked as deprecated

### 6.0.4

- Documentation updates

### 6.0.3

- Close Connect on unmount

# 6.0.0

- New branding
- **Breaking change**: the `uiTheme` config option is removed.

# 5.0.0

- Renamed the package from `utility-connect-react` to `connect-react`. Please reinstall from npm `npm i @arcadia-eng/connect-react`
  - `useUtilityConnect` hook renamed to `useConnect`
  - `withUtilityConnect` HoC renamed to `withConnect`
  - `config.UtilityConnectToken` renamed to `config.ConnectToken`

# 4.0.0

- **Breaking change**: New callback and config format

# 3.0.0

- Errors in `use-utility-connect` now return a consistent `Error` object
- `with-utility-connect` now matches the current implementation of `use-utility-connect`
  - **Breaking Change**: The `ready` prop is no longer passed down by the HOC. Please use `loading` instead.

### 0.0.1

Internal testing version
