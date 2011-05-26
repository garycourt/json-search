/**
 * @constructor
 * @implements {Index}
 */

function MemoryIndex() {
	this._docs = {};
	this._index = {};
};

/**
 * @protected
 * @type {Object}
 */

MemoryIndex.prototype._docs;

/**
 * @protected
 * @type {number}
 */

MemoryIndex.prototype._docCount = 0;

/**
 * @protected
 * @type {Object.<Array.<TermVectorEntry>>}
 */

MemoryIndex.prototype._index;

/**
 * @protected
 * @type {TermIndexer}
 */

MemoryIndex.prototype._termIndexer = new DefaultTermIndexer();

/**
 * @return {string}
 */

MemoryIndex.prototype.generateID = function () {
	return String(Math.random());  //FIXME
};

/**
 * @param {Object} doc
 * @param {DocumentID} id
 * @param {function(PossibleError)} [callback]
 */

MemoryIndex.prototype.indexDocument = function (doc, id, callback) {
	var termVecEnts, i, il, vecKey;
	termVecEnts = this._termIndexer.index(doc, id);
	
	for (i = 0, il = termVecEnts.length; i < il; ++i) {
		vecKey = JSON.stringify([termVecEnts[i].term, termVecEnts[i].field]);
		if (!this._index[vecKey]) {
			this._index[vecKey] = [ termVecEnts[i] ];
		} else {
			Array.orderedInsert(this._index[vecKey], termVecEnts[i], this._termIndexer.compareDocumentIds);
		}
	}
	
	if (callback) {
		callback(null);
	}
};

/**
 * @param {Object} doc
 * @param {DocumentID|null} [id]
 * @param {function(PossibleError)} [callback]
 */

MemoryIndex.prototype.addDocument = function (doc, id, callback) {
	if (typeof id === "undefined" || typeOf(id) === "null") {
		id = this.generateID();
	} else {
		id = String(id);
	}
	
	this._docs[id] = doc;
	this._docCount++;
	
	this.indexDocument(doc, id, callback);
};

/**
 * @param {DocumentID} id
 * @param {function(PossibleError, (Object|undefined))} callback
 */

MemoryIndex.prototype.getDocument = function (id, callback) {
	callback(null, this._docs[id]);
};

/**
 * @param {TermIndexer} indexer
 * @param {function(PossibleError)} [callback]
 */

MemoryIndex.prototype.setTermIndexer = function (indexer, callback) {
	var docs = this._docs, id;
	this._termIndexer = indexer;
	
	//reindex all documents
	this._index = {};
	for (id in docs) {
		if (docs.hasOwnProperty(id)) {
			this.indexDocument(docs[id], id);
		}
	}
	
	if (callback) {
		callback(null);
	}
};

/**
 * @param {string} term
 * @param {string|null} field
 * @return {ReadableStream}
 */

MemoryIndex.prototype.getTermVectors = function (term, field) {
	var vecKey = JSON.stringify([term, field]),
		entries = this._index[vecKey] || [],
		self = this,
		stream = new ArrayStream(entries, function (entry) {
			var termVector = self._termIndexer.toTermVector(entry);
			termVector.documentFrequency = entries.length;
			termVector.totalDocuments = self._docCount;
			return termVector;
		});
	return stream.start();
};


exports.MemoryIndex = MemoryIndex;