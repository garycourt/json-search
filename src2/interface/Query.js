/**
 * @interface
 */

function Query() {};

/**
 * @type {number}
 */

Query.prototype.boost;

/**
 * @param {Index} index
 * @param {Similarity} similarity
 * @return {ReadableStream}
 */

Query.prototype.score = function (index, similarity) {};

/**
 * @return {Array.<string>}
 */

Query.prototype.extractTerms = function () {};