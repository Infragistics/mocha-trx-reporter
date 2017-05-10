# mocha-trx-reporter

> Reporter for the Visual Studio TRX format.

[![Build Status](https://travis-ci.org/Infragistics/mocha-trx-reporter.svg?branch=master)](https://travis-ci.org/Infragistics/mocha-trx-reporter)

## Usage

Install package

`$ npm install mocha-trx-reporter --save`

Run mocha with trx reporter

`$ mocha --reporter mocha-trx-reporter path/to/tests`

To save the output into a file, run:

`$ mocha --reporter mocha-trx-reporter --reporter-options output=myResult.trx path/to/tests`

or, if you want a more detailed filename:

`$ mocha --reporter mocha-trx-reporter --reporter-options output="$(whoami)_$(hostname)_$(date +%F_%H_%M_%S).trx" path/to/tests`

or you can set `MOCHA_REPORTER_FILE` environment var with the desired filename

### Reporter options

- **output** (string)  
  Outputs as a TRX file into the provided path. If not provided, outputs to stdout.
- **treatPendingAsNotExecuted** (boolean)  
  Pending tests (tests without implementation, or maked with `.skip`) have an  outcome of `NotExecuted` instead of
  `Pending` in the TRX file.
- **excludePending** (boolean)  
  Tests with a `Pending` state are excluded from the TRX file.
- **warnExcludedPending** (boolean)  
  When combined with *excludePending*, writes a warning to stderr with the number of
  tests that have been excluded because they had the state `Pending`, if the number is more than 0.

## Development

Clone repository and install dependencies

`$ npm install`

Running tests

`$ npm run test`

For generating sample trx file

`$ ./node_modules/mocha/bin/mocha --reporter lib/trx.js --reporter-options output=sampleResult.trx sampleTest/test.js`
