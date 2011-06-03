/**
 * @constructor
 * @implements {Index}
 */

function MemoryIndex() {
	this._docs = {};
	this._index = {};
	this._indexKeys = new ScapegoatTree();
};

/**
 * @param {TermVector} a
 * @param {TermVector} b
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
 * @param {string} a
 * @param {string} b
 * @return {number}
 */

MemoryIndex.stringComparator = function (a, b) {
	if (a < b) {
		return -1;
	} else if (a > b) {
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
 * @type {Object.<Array.<TermVector>>}
 */

MemoryIndex.prototype._index;

/**
 * @protected
 * @type {ScapegoatTree}
 */

MemoryIndex.prototype._indexKeys;

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
			this._indexKeys.insert(key);
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
 * @return {Stream}
 */

MemoryIndex.prototype.getTermVectors = function (field, term) {
	var key = JSON.stringify([field, term]),
		entries = this._index[key] || [],
		self = this,
		stream = new Stream();
		
	stream.pause();             //allow caller to attach to stream
	stream.bulkWrite(entries);  //buffered
	stream.end();               //buffered
	stream.resume();            //asynchronous
	
	return stream;
};

/**
 * @param {FieldName} field
 * @param {Term} startTerm
 * @param {Term} endTerm
 * @param {boolean} [excludeStart]
 * @param {boolean} [excludeEnd]
 * @return {Stream}
 */

MemoryIndex.prototype.getTermRangeVectors = function (field, startTerm, endTerm, excludeStart, excludeEnd) {
	var startKey = JSON.stringify([field, startTerm]),
		endKey = JSON.stringify([field, endTerm]),
		keys = this._indexKeys.range(startKey, endKey, excludeStart, excludeEnd),
		i, il
		stream = new Stream();

	stream.pause();             //allow caller to attach to stream	

	for (i = 0, il = keys.length; i < il; ++i) {
		stream.bulkWrite(this._index[keys[i]]);  //buffered
	}
	
	stream.end();               //buffered
	stream.resume();            //asynchronous
	return stream;
};

/**
 * @param {FieldName} field
 * @param {Term} startTerm
 * @param {Term} endTerm
 * @param {boolean} excludeStart
 * @param {boolean} excludeEnd
 * @param {function(PossibleError, Array.<string>)} [callback]
 */

MemoryIndex.prototype.getTermRange = function (field, startTerm, endTerm, excludeStart, excludeEnd, callback) {
	var startKey = JSON.stringify([field, startTerm]),
		endKey = JSON.stringify([field, endTerm]),
		keys = this._indexKeys.range(startKey, endKey, excludeStart, excludeEnd).map(function (key) {
			return JSON.parse(key)[1];
		});
	
	setTimeout(function () {
		callback(null, keys);
	}, 0);
};


exports.MemoryIndex = MemoryIndex;