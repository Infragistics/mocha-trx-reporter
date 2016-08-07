var should = require('should');
var testToTrx = require('../lib/test-to-trx');

describe('Module test-to-trx', function () {

    var computerName = 'mycomputer';

    it('should generate correct trx object for passed test', function () {
        var mochaTestMock = {
            title: '1 should be 1',
            fullTitle: function() { return 'On sample test 1 should be 1'; },
            duration: 1243,
            err: undefined,
            pending: false,
            state: 'passed',
            start: new Date('2015-08-10T00:00:00.000Z'),
            end: new Date('2015-08-10T00:00:01.234Z')
        };

        var trxTest = testToTrx(mochaTestMock, computerName);

        trxTest.should.be.instanceOf(Object);
        trxTest.should.have.property('computerName', 'mycomputer');
        trxTest.should.have.property('outcome', 'Passed');
        trxTest.should.have.property('duration', '00:00:01.243');
        trxTest.should.have.property('startTime', '2015-08-10T00:00:00.000Z');
        trxTest.should.have.property('endTime', '2015-08-10T00:00:01.234Z');
        trxTest.should.have.property('errorMessage', '');
        trxTest.should.have.property('errorStacktrace', '');


        trxTest.should.have.property('test');
        trxTest.test.should.be.instanceOf(Object);
        trxTest.test.should.have.property('id');
        trxTest.test.should.have.property('name', 'On sample test 1 should be 1');
        trxTest.test.should.have.property('type');
        trxTest.test.should.have.property('methodName', '');
        trxTest.test.should.have.property('methodCodeBase', '');
        trxTest.test.should.have.property('methodClassName', '');
        trxTest.test.should.have.property('description', '1 should be 1');
    });

    it('should generate correct trx object for failed test', function () {
        var mochaTestMock = {
            title: '1 should be 3',
            fullTitle: function() { return 'On sample test 1 should be 3'; },
            duration: 10000,
            pending: false,
            state: 'failed',
            start: new Date('2015-08-10T00:00:00.000Z'),
            end: new Date('2015-08-10T00:00:10.000Z'),
            err: {
                stack: 'error stack trace',
                _message: 'expected 1 to be 3'
            }
        };

        var trxTest = testToTrx(mochaTestMock, computerName);

        trxTest.should.be.instanceOf(Object);
        trxTest.should.have.property('computerName', 'mycomputer');
        trxTest.should.have.property('outcome', 'Failed');
        trxTest.should.have.property('duration', '00:00:10.000');
        trxTest.should.have.property('startTime', '2015-08-10T00:00:00.000Z');
        trxTest.should.have.property('endTime', '2015-08-10T00:00:10.000Z');
        trxTest.should.have.property('errorMessage', 'expected 1 to be 3');
        trxTest.should.have.property('errorStacktrace', 'error stack trace');


        trxTest.should.have.property('test');
        trxTest.test.should.be.instanceOf(Object);
    });

    it('should generate correct trx object for timed out test', function () {
        var mochaTestMock = {
            title: '1 should be 2',
            fullTitle: function() { return 'On sample test 1 should be 2'; },
            duration: 0,
            err: undefined,
            timedOut: true,
            pending: false,
            state: undefined,
            start: new Date('2015-08-10T00:00:00.000Z'),
            end: undefined
        };

        var trxTest = testToTrx(mochaTestMock, computerName);

        trxTest.should.be.instanceOf(Object);
        trxTest.should.have.property('computerName', 'mycomputer');
        trxTest.should.have.property('outcome', 'Timeout');
        trxTest.should.have.property('duration', '00:00:00.000');
        trxTest.should.have.property('startTime', '2015-08-10T00:00:00.000Z');
        trxTest.should.have.property('endTime', '');
        trxTest.should.have.property('errorMessage', '');
        trxTest.should.have.property('errorStacktrace', '');


        trxTest.should.have.property('test');
        trxTest.test.should.be.instanceOf(Object);
    });

    it('should generate correct trx object for pending (skipped) test', function () {
        var mochaTestMock = {
            title: '1 should be 2',
            fullTitle: function() { return 'On sample test 1 should be 2'; },
            duration: 0,
            err: undefined,
            pending: true,
            state: undefined,
            start: new Date('2015-08-10T00:00:00.000Z'),
            end: undefined
        };

        var trxTest = testToTrx(mochaTestMock, computerName);

        trxTest.should.be.instanceOf(Object);
        trxTest.should.have.property('computerName', 'mycomputer');
        trxTest.should.have.property('outcome', 'Pending');
        trxTest.should.have.property('duration', '00:00:00.000');
        trxTest.should.have.property('startTime', '2015-08-10T00:00:00.000Z');
        trxTest.should.have.property('endTime', '');
        trxTest.should.have.property('errorMessage', '');
        trxTest.should.have.property('errorStacktrace', '');


        trxTest.should.have.property('test');
        trxTest.test.should.be.instanceOf(Object);
    });

    it('should generate correct trx object for unknown test result', function () {
        var mochaTestMock = {
            title: '1 should be 2',
            fullTitle: function() { return 'On sample test 1 should be 2'; },
            duration: 0,
            err: undefined,
            pending: false,
            state: undefined,
            start: new Date('2015-08-10T00:00:00.000Z'),
            end: undefined
        };

        var trxTest = testToTrx(mochaTestMock, computerName);

        trxTest.should.be.instanceOf(Object);
        trxTest.should.have.property('computerName', 'mycomputer');
        trxTest.should.have.property('outcome', 'Inconclusive');
        trxTest.should.have.property('duration', '00:00:00.000');
        trxTest.should.have.property('startTime', '2015-08-10T00:00:00.000Z');
        trxTest.should.have.property('endTime', '');
        trxTest.should.have.property('errorMessage', '');
        trxTest.should.have.property('errorStacktrace', '');


        trxTest.should.have.property('test');
        trxTest.test.should.be.instanceOf(Object);
    });
});