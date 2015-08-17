# mocha-trx-reporter

> Reporter for the Visual Studio TRX format.

## Usage

Install package

`$ npm install mocha-trx-reporter --save`

Run mocha with trx reporter

`$ ./node_modules/mocha/bin/mocha --reporter mocha-trx-reporter path/to/tests`

To save the output into a file, run:

`$ ./node_modules/mocha/bin/mocha --reporter mocha-trx-reporter --reporter-file myResult.trx path/to/tests`

or, if you want a more detailed filename:

`$ ./node_modules/mocha/bin/mocha --reporter mocha-trx-reporter --reporter-file "$(whoami)_$(hostname)_$(date +%F_%H_%M_%S).trx" path/to/tests`

or you can set `MOCHA_REPORTER_FILE` environment var with the desired filename

## Development

Clone repository and install dependencies

`$ npm install`

Running tests

`$ npm run test`

For generating sample trx file

`$ ./node_modules/mocha/bin/mocha --reporter lib/trx.js --reporter-file sampleResult.trx sampleTest/test.js`
