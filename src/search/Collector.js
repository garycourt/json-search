/**
 * @interface
 */

var Collector = function () {};

/**
 * @type {Scorer}
 */

Collector.prototype.scorer;

/**
 * @param {DocumentID} doc
 */

Collector.prototype.collect = function (doc) {};

/**
 * @param {Index} reader
 * @param {DocumentID|null} docBase
 */

Collector.prototype.setNextReader = function (reader, docBase) {};

/**
 * @return {boolean}
 */

Collector.prototype.acceptsDocsOutOfOrder = function () {};


exports.Collector = Collector;