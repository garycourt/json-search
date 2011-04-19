/**
 * @interface
 */

function Index() {};

/**
 * @param {Document} doc
 * @param {function(PossibleError)} [callback]
 */

Index.prototype.addDocument = function (doc, callback) {};

/**
 * @param {DocumentID} id
 * @param {function(PossibleError, (Document|undefined))} callback
 */

Index.prototype.getDocument = function (id, callback) {};

/**
 * @param {string} term
 * @param {string|null} field
 * @param {InputStream} output
 */

Index.prototype.getTermDocuments = function (term, field, output) {};