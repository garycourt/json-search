/**
 * @interface
 */

var Weight = function () {};

/**
 * @param {Index} reader
 * @param {DocumentID} doc
 * @return {Explanation}
 */

Weight.prototype.explain = function (reader, doc) {};

/**
 * @return {Query} 
 */

Weight.prototype.getQuery = function () {};

/**
 * @return {number}
 */

Weight.prototype.getValue = function () {};

/**
 * @param {number} norm
 */

Weight.prototype.normalize = function (norm) {};

/**
 * @param {Index} reader
 * @param {boolean} scoreDocsInOrder
 * @param {boolean} topScorer
 * @return {Scorer}
 */

Weight.prototype.scorer = function (reader, scoreDocsInOrder, topScorer) {};

/**
 * @return {number}
 */

Weight.prototype.sumOfSquaredWeights = function () {};

/**
 * @return {boolean}
 */

Weight.prototype.scoresDocsOutOfOrder = function () {};


exports.Weight = Weight;