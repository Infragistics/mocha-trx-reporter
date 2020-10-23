const fs = require('fs');
const { reporters } = require('mocha');
const { TestRun } = require('node-trx');
const os = require('os');
const crypto = require('crypto');
const testToTrx = require('./test-to-trx');

const computerName = os.hostname();
const userName = os.userInfo().username;

module.exports = ReporterTrx;

/**
 * Initialize a new `TRX` reporter.
 *
 * @api public
 * @param {Runner} runner
 */
function ReporterTrx(runner, options) {
    reporters.Base.call(this, runner, options);

    const self = this;
    const tests = new Set();
    const cwd = process.cwd();
    let failedHook = null;

    runner.on('test', (test) => {
        test.start = new Date();
    });

    runner.on('test end', (test) => {
        test.end = new Date();
        tests.add(test);
    });

    runner.on('fail', (failed) => {
        if (failed.type === 'hook') {
            failedHook = failed;
        }
    });

    runner.on('suite end', (suite) => {
        if (failedHook && failedHook.parent === suite) {
            // Handle tests that couldn't be run due to a failed hook
            suite.eachTest((test) => {
                if (test.isPending() || !test.state) {
                    test.err = {
                        message: `Not executed due to ${failedHook.title} on "${failedHook.parent.fullTitle()}"`,
                        stack: failedHook.err.stack,
                    };

                    if (!test.state) {
                        test.state = 'failed';
                    }

                    tests.add(test);
                }
            });

            failedHook = null;
        }
    });

    runner.on('end', () => {
        const testResults = {
            stats: self.stats,
            tests: [...tests.values()],
        };

        runner.testResults = testResults;

        const now = (new Date()).toISOString();
        const testRunName = `${userName}@${computerName} ${now.substring(0, now.indexOf('.')).replace('T', ' ')}`;

        const run = new TestRun({
            name: testRunName,
            runUser: userName,
            settings: {
                name: 'default',
            },
            times: {
                creation: now,
                queuing: now,
                start: testResults.stats.start.toISOString(),
                finish: testResults.stats.end.toISOString(),
            },
        });

        const reporterOptions = options.reporterOptions || {};
        let excludedPendingCount = 0;

        testResults.tests.forEach((test) => {
            if (test.isPending() && reporterOptions.excludePending === true) {
                excludedPendingCount += 1;
                return;
            }
            run.addResult(testToTrx(test, computerName, cwd, reporterOptions));
        });

        if (reporterOptions.warnExcludedPending === true && excludedPendingCount > 0) {
            // eslint-disable-next-line no-console
            console.warn(
                `##[warning]${excludedPendingCount === 1
                    ? 'Excluded 1 test because it is marked as Pending.'
                    : `Excluded ${excludedPendingCount} tests because they are marked as Pending.`}`
            );
        }

        const filename = getFilename(reporterOptions);
        if (filename) {
            fs.writeFileSync(filename, run.toXml());
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
    let filePath = reporterOptions.output || process.env.MOCHA_REPORTER_FILE;
    if (filePath && filePath.indexOf('[hash]') !== -1) {
        filePath = filePath.replace('[hash]', crypto.randomBytes(16).toString("hex"));
    }
    return filePath;
}
