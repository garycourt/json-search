/**
 * @interface
 */

var DocIdSetIterator = function () {};

/**
 * @const
 * @type {number}
 */

DocIdSetIterator.NO_MORE_DOCS = Number.MAX_VALUE;

/**
 * @return {DocumentID}
 */

DocIdSetIterator.prototype.docID = function () {};

/**
 * @return {DocumentID}
 */

DocIdSetIterator.prototype.nextDoc = function () {};

/**
 * @param {DocumentID} target
 * @return {DocumentID}
 */

DocIdSetIterator.prototype.advance = function (target) {};


exports.DocIdSetIterator = DocIdSetIterator;