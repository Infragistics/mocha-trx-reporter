/**
 * Module dependencies.
 */

var Base = require('mocha').reporters.Base;

/**
 * Expose `Secondary`.
 */

exports = module.exports = Secondary;

/**
 * Initialize a new `Secondary` test reporter.
 *
 * @api public
 * @param {Runner} runner
 * @param options
 */
function Secondary(runner, options) {
    Base.call(this, runner, options);

    console.log('Secondary options:');
    console.log(options);
}

Secondary.prototype.done = function (failures) {
    console.log('Secondary done with ' + failures + ' failures.')
}