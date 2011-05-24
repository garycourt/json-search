/**
 * @constructor
 * @implements {Index}
 */

function MemoryIndex() {
	this._docs = {};
	this._termVecs = {};
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

MemoryIndex.prototype._termVecs;

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
 * @param {DocumentID|null} [id]
 * @param {function(PossibleError)} [callback]
 */

MemoryIndex.prototype.addDocument = function (doc, id, callback) {
	var termVecEnts, i, il, vecKey;
	if (typeof id === "undefined" || typeOf(id) === "null") {
		id = this.generateID();
	} else {
		id = String(id);
	}
	
	this._docs[id] = doc;
	this._docCount++;
	termVecEnts = this._termIndexer.index(doc);
	
	for (i = 0, il = termVecEnts.length; i < il; ++i) {
		termVecEnts[i].documentID = id;
		vecKey = JSON.stringify([termVecEnts[i].term, termVecEnts[i].field]);
		if (!this._termVecs[vecKey]) {
			this._termVecs[vecKey] = [ termVecEnts[i] ];
		} else {
			Array.orderedInsert(this._termVecs[vecKey], termVecEnts[i], MemoryIndex.documentIDComparator);
		}
	}
	
	if (callback) {
		callback(null);
	}
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
	var vecKey = JSON.stringify([term, field]),
		entries = this._termVecs[vecKey] || [],
		self = this,
		stream = new ArrayStream(entries, function (termVecEnt) {
			return /** @type {TermVector} */ ({
				term : termVecEnt.term,
				termFrequency : termVecEnt.termFrequency || 1,
				termPositions : termVecEnt.termPositions || [0],
				termOffsets : termVecEnt.termOffsets || [0],
				field : termVecEnt.field || null,
				fieldBoost : termVecEnt.fieldBoost || 1.0,
				totalFieldTokens : termVecEnt.totalFieldTokens || 1,
				documentBoost : termVecEnt.fieldBoost || 1.0,
				documentID : termVecEnt.documentID,
				documentFrequency : entries.length,
				totalDocuments : self._docCount
			});
		});
	return stream.start();
};


exports.MemoryIndex = MemoryIndex;