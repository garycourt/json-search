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
 * @param {TermVectorEntry} a
 * @param {TermVectorEntry} b
 * @return {number}
 */

TermIndexer.prototype.compareDocumentIds = function (a, b) {};

/**
 * @param {TermVectorEntry} entry
 * @return {TermVector}
 */

TermIndexer.prototype.toTermVector = function (entry) {};

/**
 * @return {String}
 */

TermIndexer.prototype.toSource = function () {};