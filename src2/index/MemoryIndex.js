/**
 * @constructor
 * @implements Index
 */

function MemoryIndex() {
	this._docs = {};
	this._termVecs = {};
};

/**
 * @protected
 * @type {Object}
 */

MemoryIndex.prototype._docs;

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
	if (typeof id === "undefined" || typeof id === "null") {
		id = this.generateID();
	} else {
		id = String(id);
	}
	
	this._docs[id] = doc;
	termVecEnts = this._termIndexer.index(doc);
	
	for (i = 0, il = termVecEnts.length; i < il; ++i) {
		vecKey = JSON.stringify([termVecEnts[i].term, termVecEnts[i].field]);
		if (!this._termVecs[vecKey]) {
			this._termVecs[vecKey] = [ termVecEnts[i] ];
		} else {
			this._termVecs[vecKey].push(termVecEnts[i]);
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
		stream = new ArrayStream(entries, this.mapVectorEntry.bind(this));
	return stream.start();
};

/**
 * @param {TermVectorEntry} termVecEnt
 * @return {TermVector}
 */

MemoryIndex.prototype.mapVectorEntry = function (termVecEnt) {
	//TODO
};


exports.MemoryIndex = MemoryIndex;