/**
 * @interface
 */

function Index() {};

/**
 * @param {Object} doc
 * @param {DocumentID} id
 * @param {function(PossibleError)} [callback]
 */

Index.prototype.indexDocument = function (doc, id, callback) {};

/**
 * @param {Object} doc
 * @param {DocumentID|null} [id]
 * @param {function(PossibleError)} [callback]
 */

Index.prototype.addDocument = function (doc, id, callback) {};

/**
 * @param {DocumentID} id
 * @param {function(PossibleError, (Object|undefined))} callback
 */

Index.prototype.getDocument = function (id, callback) {};

/**
 * @param {TermIndexer} indexer
 * @param {function(PossibleError)} [callback]
 */

Index.prototype.setTermIndexer = function (indexer, callback) {};

/**
 * @param {string|null} field
 * @param {string} term
 * @return {ReadableStream}
 */

Index.prototype.getTermVectors = function (field, term) {};

/**
 * @param {string|null} field
 * @param {string} startTerm
 * @param {string} endTerm
 * @param {boolean} [excludeStart]
 * @param {boolean} [excludeEnd]
 * @return {ReadableStream}
 */

Index.prototype.getTermRangeVectors = function (field, startTerm, endTerm, excludeStart, excludeEnd) {};