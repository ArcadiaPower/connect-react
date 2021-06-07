# Changelog

## 0.0.1

Internal testing version

## 3.0.0

- Errors in `use-utility-connect` now return a consistent `Error` object
- `with-utility-connect` now matches the current implementation of `use-utility-connect`
  - **Breaking Change**: The `ready` prop is no longer passed down by the HOC. Please use `loading` instead.
