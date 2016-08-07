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

        context('excludePending and warnExcludedPending enabled', function () {

            context('having 1 pending test', function () {

                var mocha;

                beforeEach(function () {
                    mocha = new Mocha({
                        reporter: trxReporter,
                        reporterOptions: {
                            excludePending: true,
                            warnExcludedPending: true
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

            context('having 2 pending tests', function () {

                var mocha;

                beforeEach(function () {
                    mocha = new Mocha({
                        reporter: trxReporter,
                        reporterOptions: {
                            excludePending: true,
                            warnExcludedPending: true
                        }
                    });
                    var suite = new Suite('TRX suite', 'root');
                    suite.addTest(new Test('handles pending test 1'));
                    suite.addTest(new Test('handles pending test 2'));
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
                            runner.testResults.tests.should.have.a.lengthOf(2);
                            done();
                        })
                    });
                });
            });
        });

        context('output file and secondary set to spec', function () {

            var mocha;

            beforeEach(function () {
                mocha = new Mocha({
                    reporter: trxReporter,
                    reporterOptions: {
                        output: 'test/trx.test.output.trx',
                        secondary: 'spec'
                    }
                });
                var suite = new Suite('TRX suite', 'root');
                firstSuite = new Suite('first suite');
                firstSuite.addTest(new Test('handles pass', function(done){
                    done();
                }));
                firstSuite.addTest(new Test('handles fail', function(done){
                    done(new Error('oops'));
                }));
                suite.addSuite(firstSuite);
                suite.addTest(new Test('handles pending'));
                mocha.suite = suite;
            });

            describe('run', function () {

                it('outputs mocha spec to stdout and trx to file', function (done) {

                    var runner = mocha.run();
                    runner.on('end', function () {
                        runner.failures.should.be.exactly(1);
                        runner.should.have.property('testResults');
                        runner.testResults.should.have.property('tests');
                        runner.testResults.tests.should.be.an.instanceOf(Array);
                        runner.testResults.tests.should.have.a.lengthOf(3);
                        done();
                    })
                });
            });
        });

        context('output file and secondary set to Secondary with options', function () {

            var mocha;

            beforeEach(function () {
                mocha = new Mocha({
                    reporter: trxReporter,
                    reporterOptions: {
                        output: 'test/trx.test.output.trx',
                        secondary: './../test/secondary-reporter',
                        secondary_option: 'value'
                    }
                });
                var suite = new Suite('TRX suite', 'root');
                suite.addTest(new Test('handles pending'));
                mocha.suite = suite;
            });

            describe('run', function () {

                it('outputs mocha Secondary reporter to stdout and trx to file', function (done) {

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