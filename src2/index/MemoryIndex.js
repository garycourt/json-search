/**
 * @constructor
 * @implements Index
 */

function MemoryIndex() {
	this._docs = {};
	this._termVecs = {};
};

/**
 * @param {function()} func
 */

MemoryIndex.queue = function (func) {
	setTimeout(func, 0);
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
		entries = this._termVecs[vecKey],
		stream = new MemoryIndexVectorizer(entries);
	
	MemoryIndex.queue(function () {
		stream._run();
	});
	
	return stream;
};


/**
 * @constructor
 * @extends {Stream}
 * @implements ReadableStream
 * @param {Array.<TermVectorEntry>} entries
 */

function MemoryIndexVectorizer(entries) {
	this._entries = entries;
	this._index = 0;
};

MemoryIndexVectorizer.prototype = Object.create(Stream.prototype);

/**
 * @type {Array.<TermVectorEntry>}
 */

MemoryIndexVectorizer.prototype._entries;

/**
 * @type {number}
 */

MemoryIndexVectorizer.prototype._index;

/**
 * @type {boolean}
 */

MemoryIndexVectorizer.prototype._started = false;

/**
 * @type {boolean}
 */

MemoryIndexVectorizer.prototype._paused = false;

/**
 * @type {boolean}
 */

MemoryIndexVectorizer.prototype.readable = true;

/**
 */

MemoryIndexVectorizer.prototype._run = function () {
	var termVec;
	this._started = true;
	
	while (!this._paused && this._index < this._entries.length) {
		//TODO
		
		this._index++;
		this.emit('data', termVec);
	}
	
	if (this._index >= this._entries.length) {
		this.emit('end');
		this.destroy();
	}
};

/**
 */

MemoryIndexVectorizer.prototype.pause = function () {
	this._paused = true;
	Stream.prototype.pause.call(this);
};

/**
 */

MemoryIndexVectorizer.prototype.resume = function () {
	var self = this;
	if (this._started && this._paused) {
		this._paused = false;
		MemoryIndex.queue(function () {
			self._run();
		});
		Stream.prototype.resume.call(this);
	}
};

/**
 */

MemoryIndexVectorizer.prototype.destroy = function () {
	this._index = Number.POSITIVE_INFINITY;
	Stream.prototype.destroy.call(this);
};

/**
 */

MemoryIndexVectorizer.prototype.destroySoon = function () {};  //Does nothing


exports.MemoryIndex = MemoryIndex;