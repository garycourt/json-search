/**
 * @interface
 */

function TermIndexer() {};

/**
 * @param {Object} doc
 * @return {Array.<TermVectorEntry>}
 */

TermIndexer.prototype.index = function (doc) {};

/**
 * @return {String}
 */

TermIndexer.prototype.toSource = function () {};