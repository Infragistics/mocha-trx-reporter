var Mocha = require('mocha')
var Suite = Mocha.Suite,
    Runner = Mocha.Runner,
    Test = Mocha.Test;

var trxReporter = require('../lib/trx.js');
var should = require('should');

describe('On trx reporter', function(){
    var suite, runner;

    beforeEach(function(){
        var mocha = new Mocha({
            reporter: trxReporter
        });
        suite = new Suite('TRX suite', 'root');
        suite.timeout(100);
        runner = new Runner(suite);
        var mochaReporter = new mocha._reporter(runner);

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
    });

    it('should create correct mocha test result', function (done) {

        runner.run(function(failureCount) {
            failureCount.should.be.exactly(2);
            runner.should.have.property('testResults');
            runner.testResults.should.have.property('tests');
            runner.testResults.tests.should.be.an.instanceOf(Array);
            runner.testResults.tests.should.have.a.lengthOf(4);

            done();
        });
    });

});