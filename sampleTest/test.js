var should = require('should');

describe('On sample test', function() {

    it('1 should be 1', function(done) {

        setTimeout(function () {

            should(1).be.equal(1);
            done();
        }, 1234);
    });

    it('1 should be 2', function() {

        should(1).be.equal(2);
    });

    it('1 should be 3', function() {

        should(1).be.equal(3);
    });
});

describe('On sample test', function() {

    it.skip('1 should be 1', function() {

        should(1).be.equal(1);
    });
});