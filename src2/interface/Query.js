/**
 * @interface
 */

function Query() {};

/**
 * @type {number}
 */

Query.prototype.boost;

/**
 * @param {Searcher} searcher
 * @param {InputStream} output
 * @return {Scorer}
 */

Query.prototype.createScorer = function (searcher, output) {};

/**
 * @return {Array.<string>}
 */

Query.prototype.extractTerms = function () {};