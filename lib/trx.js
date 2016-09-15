var Base = require('mocha').reporters.Base,
    TRX = require('node-trx'),
    TestRun = TRX.TestRun,
    os = require('os'),
    computerName = os.hostname(),
    userName = process.env.USER;

var testToTrx = require('./test-to-trx');

exports = module.exports = ReporterTrx;

/**
 * Initialize a new `TRX` reporter.
 *
 * @api public
 * @param {Runner} runner
 */
function ReporterTrx(runner, options) {
    Base.call(this, runner, options);

    var self = this;
    var tests = [];

    runner.on('test', function (test) {
        test.start = new Date();
    });

    runner.on('test end', function (test) {
        test.end = new Date();
        tests.push(test);
    });

    runner.on('end', function () {
        var obj = {
            stats: self.stats,
            tests: tests
        };

        runner.testResults = obj;

        var now = (new Date()).toISOString();
        var testRunName = userName + '@' + computerName + ' ' + now.substring(0, now.indexOf('.')).replace('T', ' ');

        var run = new TestRun({
            name: testRunName,
            runUser: userName,
            settings: {
                name: 'default'
            },
            times: {
                creation: now,
                queuing: now,
                start: obj.stats.start.toISOString(),
                finish: obj.stats.end.toISOString()
            }
        });

        runner.testResults.tests.forEach(function (test) {
            run.addResult(testToTrx(test, computerName));
        });

        var filename = getFilename(options ? options.reporterOptions : null);
        if (filename) {
            require('fs').writeFileSync(filename, run.toXml());
        } else {
            process.stdout.write(run.toXml());
        }
    });
}

/**
 * Gets filename from:
 *
 * - reporter options (as given by mocha's --reporter-options output=>filename>
 * or
 * - env var: MOCHA_REPORTER_FILE
 *
 * prioritizing process arg variable
 *
 * @returns {boolean|*}
 */
function getFilename(reporterOptions) {
    return (reporterOptions ? reporterOptions.output : null)
        || process.env.MOCHA_REPORTER_FILE;
}
