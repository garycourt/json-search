/**
 * @interface
 */

function Query() {};

/**
 * @type {number}
 */

Query.prototype.boost;

/**
 * @param {InputStream} output
 * @return {Scorer}
 */

Query.prototype.createScorer = function (output) {};

/**
 * @return {Array.<string>}
 */

Query.prototype.extractTerms = function () {};