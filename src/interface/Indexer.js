/**
 * @interface
 * @extends {Analyzer}
 */

function Indexer() {};

/**
 * @param {Term} value
 * @param {FieldName} [field]
 * @return {Array.<Token>}
 */

Indexer.prototype.parse = function (value, field) {};

/**
 * @param {*} doc
 * @param {DocumentID} id
 * @return {Array.<TermVector>}
 */

Indexer.prototype.index = function (doc, id) {};

/**
 * @return {string}
 */

Indexer.prototype.toSource = function () {};