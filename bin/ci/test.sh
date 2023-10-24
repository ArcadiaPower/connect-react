#!/bin/bash
dir=${GITHUB_WORKSPACE:-${HOME}}
echo $dir
curl -L https://codeclimate.com/downloads/test-reporter/test-reporter-latest-linux-amd64 > "${dir}/bin/cc-test-reporter" && chmod +x "${dir}/bin/cc-test-reporter"

set -euo pipefail
IFS=$'\n\t'

npm run lint
cc-test-reporter before-build
npm run test:coverage

cc-test-reporter after-build --exit-code $? --prefix /home/rof/src/github.com/ArcadiaPower/utility-connect-react
