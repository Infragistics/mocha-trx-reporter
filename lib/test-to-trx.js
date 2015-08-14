var TRX = require('node-trx'),
    UnitTest = TRX.UnitTest;

module.exports = testToTrx;

/**
 * Transform mocha test to trx obj
 *
 * @param test
 * @param computerName
 * @returns {Object}
 */
function testToTrx(test, computerName) {
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