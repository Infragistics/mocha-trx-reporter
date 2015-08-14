var Base = require('mocha').reporters.Base,
    fs = require('fs'),
    TRX = require('node-trx'),
    TestRun = TRX.TestRun,
    os = require('os'),
    computerName = os.hostname(),
    userName = process.env.USER;

var testToTrx = require('./test-to-trx');

// for debugging purposes because mocha handles errors internally
if (process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
    process.on('uncaughtException', function (err) {
        throw err;
    });
}

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
            tests: tests.map(mask)
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

        var filename = process.env.TRX_REPORT_FILE || testRunName.replace(/[:, , @]/g, '_') + '.trx';
        fs.writeFileSync(filename, run.toXml());
    });
}

/**
 * Masks mocha test object
 *
 * @param test
 * @returns {Object}
 */
function mask(test) {
    return {
        // remove smoke tag and test case number
        title: test.title.replace(' @smoke', '').replace(/ \[C\d+\]/, ''),
        fullTitle: test.fullTitle().replace(' @smoke', '').replace(/ \[C\d+\]/, ''),
        duration: test.duration || 0,
        err: test.err,
        state: test.state,
        start: test.start,
        end: test.end
    }
}
