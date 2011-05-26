/**
 * @interface
 */

function TermIndexer() {};

/**
 * @param {Object} doc
 * @param {DocumentID} id
 * @return {Array.<TermVectorEntry>}
 */

TermIndexer.prototype.index = function (doc, id) {};

/**
 * @return {String}
 */

TermIndexer.prototype.toSource = function () {};