/**
 * @interface
 * @extends {Analyzer}
 */

function Indexer() {};

/**
 * @type {FieldName}
 */

Indexer.prototype.defaultField;

/**
 * @param {string} value
 * @param {FieldName} [field]
 * @return {Array.<Token>}
 */

Indexer.prototype.tokenize = function (value, field) {};

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