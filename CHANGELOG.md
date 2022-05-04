# Changelog

## 0.0.1

Internal testing version

## 3.0.0

- Errors in `use-utility-connect` now return a consistent `Error` object
- `with-utility-connect` now matches the current implementation of `use-utility-connect`
  - **Breaking Change**: The `ready` prop is no longer passed down by the HOC. Please use `loading` instead.

## 4.0.0

- **Breaking change**: New callback and config format

## 5.0.0

- Renamed the package from `utility-connect-react` to `connect-react`. Please reinstall from npm `npm i @arcadia-eng/connect-react`
  - `useUtilityConnect` hook renamed to `useConnect`
  - `withUtilityConnect` HoC renamed to `withConnect`
  - `config.UtilityConnectToken` renamed to `config.ConnectToken`

## 6.0.0

- New branding
- **Breaking change**: the `uiTheme` config option is removed.

## 6.0.3

- Close Connect on unmount
