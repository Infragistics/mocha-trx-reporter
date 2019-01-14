require('should');
const Mocha = require('mocha');
const trxReporter = require('../lib/trx.js');

describe('Mocha with mocha-trx-reporter', function () {
    context('having default options', function () {
        let mocha;

        beforeEach(function () {
            mocha = new Mocha({
                reporter: trxReporter,
                timeout: 100,
            });
            const suite = new Mocha.Suite('TRX suite', 'root');
            suite.addTest(new Mocha.Test('handles errors', ((done) => {
                done(new Error({ message: 'omg' }));
            })));
            suite.addTest(new Mocha.Test('handles pending tests'));
            suite.addTest(new Mocha.Test('handles async tests', ((done) => {
                done();
            })));
            suite.addTest(new Mocha.Test('handles timeout', ((done) => {
                setTimeout(done, 200);
            })));
            mocha.suite = suite;
        });

        describe('run', function () {
            it('should create correct test result', function (done) {
                const runner = mocha.run();
                runner.on('end', () => {
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
            let mocha;

            beforeEach(function () {
                mocha = new Mocha({
                    reporter: trxReporter,
                    reporterOptions: {
                        treatPendingAsNotExecuted: true,
                    },
                });
                const suite = new Mocha.Suite('TRX suite', 'root');
                suite.addTest(new Mocha.Test('handles pending tests'));
                mocha.suite = suite;
            });

            describe('run', function () {
                it('should create correct mocha test result', function (done) {
                    const runner = mocha.run();
                    runner.on('end', () => {
                        runner.failures.should.be.exactly(0);
                        runner.should.have.property('testResults');
                        runner.testResults.should.have.property('tests');
                        runner.testResults.tests.should.be.an.instanceOf(Array);
                        runner.testResults.tests.should.have.a.lengthOf(1);
                        done();
                    });
                });
            });
        });

        context('excludePending and warnExcludedPending enabled', function () {
            context('having 1 pending test', function () {
                let mocha;

                beforeEach(function () {
                    mocha = new Mocha({
                        reporter: trxReporter,
                        reporterOptions: {
                            excludePending: true,
                            warnExcludedPending: true,
                        },
                    });
                    const suite = new Mocha.Suite('TRX suite', 'root');
                    suite.addTest(new Mocha.Test('handles pending tests'));
                    mocha.suite = suite;
                });

                describe('run', function () {
                    it('should create correct mocha test result', (done) => {
                        const runner = mocha.run();
                        runner.on('end', () => {
                            runner.failures.should.be.exactly(0);
                            runner.should.have.property('testResults');
                            runner.testResults.should.have.property('tests');
                            runner.testResults.tests.should.be.an.instanceOf(Array);
                            runner.testResults.tests.should.have.a.lengthOf(1);
                            done();
                        });
                    });
                });
            });

            context('having 2 pending tests', function () {
                let mocha;

                beforeEach(function () {
                    mocha = new Mocha({
                        reporter: trxReporter,
                        reporterOptions: {
                            excludePending: true,
                            warnExcludedPending: true,
                        },
                    });
                    const suite = new Mocha.Suite('TRX suite', 'root');
                    suite.addTest(new Mocha.Test('handles pending test 1'));
                    suite.addTest(new Mocha.Test('handles pending test 2'));
                    mocha.suite = suite;
                });

                describe('run', function () {
                    it('should create correct mocha test result', (done) => {
                        const runner = mocha.run();
                        runner.on('end', () => {
                            runner.failures.should.be.exactly(0);
                            runner.should.have.property('testResults');
                            runner.testResults.should.have.property('tests');
                            runner.testResults.tests.should.be.an.instanceOf(Array);
                            runner.testResults.tests.should.have.a.lengthOf(2);
                            done();
                        });
                    });
                });
            });
        });
    });
});
