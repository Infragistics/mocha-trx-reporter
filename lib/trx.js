var Base = require('mocha').reporters.Base,
    fs = require('fs'),
    TRX = require('node-trx'),
    TestRun = TRX.TestRun,
    UnitTest = TRX.UnitTest,
    os = require('os'),
    computerName = os.hostname(),
    userName = process.env.USER;

var filename = 'mocha.trx';

// for debugging purposes because mocha handles errors internally
if (process.env.NODE_ENV && process.env.NODE_ENV === 'development'){
    process.on('uncaughtException', function(err) {
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
        var run = new TestRun({
            name: userName + '@' + computerName + ' ' + now.substring(0, now.indexOf('.')).replace('T', ' '),
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

            run.addResult(mochaTestResultToTrx(test));
        });

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

/**
 * Transform mocha test result to trx result
 *
 * @param test
 * @returns {Object}
 */
function mochaTestResultToTrx(test) {

    return {
        test: new UnitTest({
            name: test.fullTitle,
            methodName: '', //??
            methodCodeBase: '', //??
            methodClassName: '', //??
            description: test.title
        }),
        computerName: computerName,
        outcome: formatOutcome(test.state),
        duration: formatDuration(test.duration),
        startTime: test.start && test.start.toISOString() || '', //'2010-11-16T08:48:29.9072393-08:00',
        endTime: test.end && test.end.toISOString() || '', //'2010-11-16T08:49:16.9694381-08:00'
        errorMessage: test.err && test.err._message || '',
        errorStacktrace: test.err && test.err.stack || ''
    };
}

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
 * @returns {string}
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

/**
 * Transform mocha test duration to trx format
 *
 * input     | output
 * ---------------------
 * 2         | '00:00:0.002'
 *
 * @param milliseconds
 * @returns {string}
 */
function formatDuration(milliseconds) {
    // we get duration ISO string
    var duration = (new Date(milliseconds)).toISOString();
    // we return time part only and remove Z char
    return duration.substring(duration.indexOf('T') + 1).replace('Z', '');
}