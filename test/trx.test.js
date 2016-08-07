var Mocha = require('mocha')
var Suite = Mocha.Suite,
    Runner = Mocha.Runner,
    Test = Mocha.Test;

var trxReporter = require('../lib/trx.js');
var should = require('should');

describe('Mocha with mocha-trx-reporter', function () {

    context('having default options', function () {

        var mocha;

        beforeEach(function () {
            mocha = new Mocha({
                reporter: trxReporter,
                timeout: 100
            });
            var suite = new Suite('TRX suite', 'root');
            suite.addTest(new Test('handles errors', function (done) {
                done(new Error({ message: 'omg' }));
            }));
            suite.addTest(new Test('handles pending tests'));
            suite.addTest(new Test('handles async tests', function (done) {
                done();
            }));
            suite.addTest(new Test('handles timeout', function (done) {
                setTimeout(done, 200);
            }));
            mocha.suite = suite;
        });

        describe('run', function () {

            it('should create correct test result', function (done) {

                var runner = mocha.run();
                runner.on('end', function () {
                    runner.failures.should.be.exactly(1);
                    runner.should.have.property('testResults');
                    runner.testResults.should.have.property('tests');
                    runner.testResults.tests.should.be.an.instanceOf(Array);
                    runner.testResults.tests.should.have.a.lengthOf(4);
                    done();
                });
            });
        });
    });

    context('having custom options', function () {

        context('treatPendingAsNotExecuted enabled', function () {

            var mocha;

            beforeEach(function () {
                mocha = new Mocha({
                    reporter: trxReporter,
                    reporterOptions: {
                        treatPendingAsNotExecuted: true
                    }
                });
                var suite = new Suite('TRX suite', 'root');
                suite.addTest(new Test('handles pending tests'));
                mocha.suite = suite;
            });

            describe('run', function () {

                it('should create correct mocha test result', function (done) {

                    var runner = mocha.run();
                    runner.on('end', function () {
                        runner.failures.should.be.exactly(0);
                        runner.should.have.property('testResults');
                        runner.testResults.should.have.property('tests');
                        runner.testResults.tests.should.be.an.instanceOf(Array);
                        runner.testResults.tests.should.have.a.lengthOf(1);
                        done();
                    })
                });
            });
        });
    });
});