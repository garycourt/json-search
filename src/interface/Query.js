/**
 * @interface
 */

function Query() {};

/**
 * @type {number}
 */

Query.prototype.boost;

/**
 * @param {Similarity} similarity
 * @param {Index} index
 * @return {ReadableStream}
 */

Query.prototype.score = function (similarity, index) {};

/**
 * @return {Array.<TermVectorEntry>}
 */

Query.prototype.extractTerms = function () {};