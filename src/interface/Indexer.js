/**
 * @interface
 */

function Indexer() {};

/**
 * @param {Object} doc
 * @param {DocumentID} id
 * @return {Array.<TermVector>}
 */

Indexer.prototype.index = function (doc, id) {};

/**
 * @return {string}
 */

Indexer.prototype.toSource = function () {};