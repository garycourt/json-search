/**
 * @constructor
 * @implements TermIndexer
 */

function DefaultTermIndexer() {};

/**
 * @param {Object} doc
 * @return {Array.<TermVectorEntry>}
 */

DefaultTermIndexer.prototype.index = function (doc) {
	//TODO
};

/**
 * @return {String}
 */

DefaultTermIndexer.prototype.toSource = function () {
	//TODO
};


exports.DefaultTermIndexer = DefaultTermIndexer;