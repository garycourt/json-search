/**
 * @constructor
 * @implements {Index}
 */

function MemoryIndex() {
	this._docs = {};
	this._index = {};
};

/**
 * @param {TermVectorEntry} a
 * @param {TermVectorEntry} b
 * @return {number}
 */

MemoryIndex.documentIDComparator = function (a, b) {
	if (a.documentID < b.documentID) {
		return -1;
	} else if (a.documentID > b.documentID) {
		return 1;
	} 
	//else
	return 0;
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
 * @return {DocumentID}
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
	var entry, i, il, key;
	entry = this._termIndexer.index(doc, id);
	
	for (i = 0, il = entry.length; i < il; ++i) {
		key = JSON.stringify([entry[i].field, entry[i].term]);
		if (!this._index[key]) {
			this._index[key] = [ entry[i] ];
		} else {
			Array.orderedInsert(this._index[key], entry[i], MemoryIndex.documentIDComparator);
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
 * @param {FieldName} field
 * @param {Term} term
 * @return {ReadableStream}
 */

MemoryIndex.prototype.getTermVectors = function (field, term) {
	var key = JSON.stringify([field, term]),
		entries = this._index[key] || [],
		self = this,
		stream = new ArrayStream(entries, function (entry) {
			return /** @type {TermVector} */ ({
				term : entry.term,
				termFrequency : entry.termFrequency || 1,
				termPositions : entry.termPositions || null,
				termOffsets : entry.termOffsets || null,
				field : entry.field || null,
				fieldBoost : entry.fieldBoost || 1.0,
				totalFieldTokens : entry.totalFieldTokens || 1,
				documentBoost : entry.fieldBoost || 1.0,
				documentID : entry.documentID,
				documentFrequency : entries.length,
				totalDocuments : self._docCount
			});
		});
	return stream.start();
};

/**
 * @param {FieldName} field
 * @param {Term} startTerm
 * @param {Term} endTerm
 * @param {boolean} [excludeStart]
 * @param {boolean} [excludeEnd]
 * @return {ReadableStream}
 */

MemoryIndex.prototype.getTermRangeVectors = function (field, startTerm, endTerm, excludeStart, excludeEnd) {
	//TODO
};


exports.MemoryIndex = MemoryIndex;