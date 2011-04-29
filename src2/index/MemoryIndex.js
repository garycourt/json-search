/**
 * @constructor
 * @implements Index
 */

function MemoryIndex() {};

/**
 * @protected
 * @type {TermIndexer}
 */

MemoryIndex.prototype._termIndexer = new DefaultTermIndexer();

/**
 * @param {Object} doc
 * @param {function(PossibleError)} [callback]
 */

MemoryIndex.prototype.addDocument = function (doc, callback) {
	//TODO
};

/**
 * @param {DocumentID} id
 * @param {function(PossibleError, (Object|undefined))} callback
 */

MemoryIndex.prototype.getDocument = function (id, callback) {
	//TODO
};

/**
 * @param {TermIndexer} indexer
 */

MemoryIndex.prototype.setTermIndexer = function (indexer) {
	this._termIndexer = indexer;
};

/**
 * @param {string} term
 * @param {string|null} field
 * @return {ReadableStream}
 */

MemoryIndex.prototype.getTermVectors = function (term, field) {
	//TODO
};


exports.MemoryIndex = MemoryIndex;