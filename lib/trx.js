var Base = require('mocha').reporters.Base,
    fs = require('fs'),
    TRX = require('node-trx'),
    TestRun = TRX.TestRun,
    UnitTest = TRX.UnitTest,
    computerName = 'pablopenen';

var filename = 'mocha.trx';

exports = module.exports = ReporterTrx;

/**
 * Initialize a new `TRX` reporter.
 *
 * @api public
 * @param {Runner} runner
 */
function ReporterTrx(runner) {
    Base.call(this, runner);

    var self = this;
    var tests = [];

    runner.on('test end', function (test) {
        tests.push(test);
    });

    runner.on('end', function () {
        var obj = {
            stats: self.stats,
            tests: tests.map(clean)
        };

        runner.testResults = obj;

        var run = new TestRun({
            name: 'Sample TRX Import',
            runUser: 'Pablito'
        });

        runner.testResults.tests.forEach(function (test) {
            run.addResult({
                test: new UnitTest({
                    name: test.fullTitle,
                    methodName: '',
                    methodCodeBase: '',
                    methodClassName: '',
                    description: ''
                }),
                computerName: computerName,
                outcome: formatOutcome(test.state),
                duration: test.duration, //'00:00:44.7811567',
                startTime: '', //'2010-11-16T08:48:29.9072393-08:00',
                endTime: '' //'2010-11-16T08:49:16.9694381-08:00'
            });
        });

        /**
         * Transform mocha test state to trx outcome
         *
         * input     | output
         * ---------------------
         * 'passed'  | 'Passed'
         * 'failed'  | 'Failed'
         * undefined | 'Inconclusive'
         *
         * @param input
         * @returns {*}
         */
        function formatOutcome(input) {
            var output;
            switch (input) {
                case 'passed':
                case 'failed':
                    output = input.charAt(0).toUpperCase() + input.slice(1);
                    break;
                default:
                    output = 'Inconclusive';
            }
            return output;
        }
        fs.writeFileSync(filename, run.toXml());
    });
}

function clean(test) {
    return {
        // remove smoke tag and test case number
        title: test.title.replace(' @smoke', '').replace(/ \[C\d+\]/, '')
        , fullTitle: test.fullTitle().replace(' @smoke', '').replace(/ \[C\d+\]/, '')
        , duration: test.duration || 0
        , err: test.err
        , state: test.state
    }
}
