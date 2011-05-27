/**
 * @interface
 */

function TermIndexer() {};

/**
 * @param {Object} doc
 * @param {DocumentID} id
 * @return {Array.<TermVector>}
 */

TermIndexer.prototype.index = function (doc, id) {};

/**
 * @return {string}
 */

TermIndexer.prototype.toSource = function () {};