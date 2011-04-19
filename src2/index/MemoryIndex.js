/**
 * @constructor
 * @implements Index
 */

function MemoryIndex() {};

/**
 * @param {Document} doc
 * @param {function(PossibleError)} [callback]
 */

MemoryIndex.prototype.addDocument = function (doc, callback) {};

/**
 * @param {DocumentID} id
 * @param {function(PossibleError, (Document|undefined))} callback
 */

MemoryIndex.prototype.getDocument = function (id, callback) {};

/**
 * @param {string} term
 * @param {string|null} field
 * @param {InputStream} output
 */

MemoryIndex.prototype.getTermDocuments = function (term, field, output) {
	//TODO
	output.start(null);
	output.end(null);
};