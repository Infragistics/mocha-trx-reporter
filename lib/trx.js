var reporters = require('mocha').reporters,
    Base = reporters.Base,
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
    var reporterOptions = options.reporterOptions || {};
    var outputFile = reporterOptions.output || process.env.MOCHA_REPORTER_FILE;

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

        var excludedPendingCount = 0;

        runner.testResults.tests.forEach(function (test) {
            if (test.isPending() && reporterOptions.excludePending === true) {
                excludedPendingCount++;
                return;
            }
            run.addResult(testToTrx(test, computerName, reporterOptions));
        });

        if (reporterOptions.warnExcludedPending === true && excludedPendingCount > 0) {
            console.warn(
                '##[warning]' + (excludedPendingCount === 1
                    ? 'Excluded 1 test because it is marked as Pending.'
                    : 'Excluded ' + excludedPendingCount + ' tests because they are marked as Pending.'));
        }

        if (outputFile) {
            require('fs').writeFileSync(outputFile, run.toXml());
        } else {
            process.stdout.write(run.toXml());
        }
    });

    if (outputFile && reporterOptions.secondary) {
        var secondaryReporter = reporters[reporterOptions.secondary];
        // Try to load reporters from process.cwd() and node_modules
        if (!secondaryReporter) {
            try {
                secondaryReporter = require(reporterOptions.secondary);
            } catch (err) {
                err.message.indexOf('Cannot find module') !== -1
                    ? console.warn('"' + reporterOptions.secondary + '" reporter not found')
                    : console.warn('"' + reporterOptions.secondary + '" reporter blew up with error:\n' + err.stack);
            }
        }
        if (!secondaryReporter) {
            throw new Error('invalid reporter "' + reporterOptions.secondary + '"');
        }
        var secondaryReporterOptions = {};
        for (option in reporterOptions) {
            if (option.indexOf('secondary_') === 0) {
                secondaryReporterOptions[option.substring(10)] = reporterOptions[option];
            }
        }
        this.secondaryReporterInstance = new secondaryReporter(runner, secondaryReporterOptions);
    }
}

ReporterTrx.prototype.done = function (failures, fn) {
    if (this.secondaryReporterInstance && this.secondaryReporterInstance.done) {
        this.secondaryReporterInstance.done(failures);
    }
    fn && fn(failures);
}