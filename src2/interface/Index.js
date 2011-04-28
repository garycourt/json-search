/**
 * @interface
 */

function Index() {};

/**
 * @param {Object} doc
 * @param {function(PossibleError)} [callback]
 */

Index.prototype.addDocument = function (doc, callback) {};

/**
 * @param {DocumentID} id
 * @param {function(PossibleError, (Object|undefined))} callback
 */

Index.prototype.getDocument = function (id, callback) {};

/**
 * @param {TermIndexer} indexer
 */

Index.prototype.setTermIndexer = function (indexer) {};

/**
 * @param {string} term
 * @param {string|null} field
 * @param {InputStream} output
 */

Index.prototype.getTermVectors = function (term, field, output) {};