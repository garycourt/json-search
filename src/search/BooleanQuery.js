/**
 * @constructor
 * @param {Array.<BooleanClause>} [clauses]
 * @param {number} [minimumOptionalMatches]
 */

function BooleanQuery(clauses, minimumOptionalMatches) {
	this.clauses = clauses || [];
	this.minimumOptionalMatches = minimumOptionalMatches || 0;
};

/**
 * @type {Array.<BooleanClause>}
 */

BooleanQuery.prototype.clauses;

/**
 * @type {number}
 */

BooleanQuery.prototype.minimumOptionalMatches = 0;

/**
 * @type {number}
 */

BooleanQuery.prototype.boost = 1.0;

/**
 * @param {Similarity} similarity
 * @param {Index} index
 * @return {ReadableStream}
 */

BooleanQuery.prototype.score = function (similarity, index) {
	return new BooleanScorer(this, similarity, index);
};

/**
 * @return {Array.<TermVectorEntry>}
 */

BooleanQuery.prototype.extractTerms = function () {
	var x, xl, result = [];
	for (x = 0, xl = this.clauses.length; x < xl; ++x) {
		result = result.concat(this.clauses[x].query.extractTerms());
	}
	return result;
};


/**
 * @protected
 * @constructor
 * @extends Stream
 * @implements ReadableStream
 * @implements WritableStream
 * @param {BooleanQuery} query
 * @param {Similarity} similarity
 * @param {Index} index
 */

function BooleanScorer(query, similarity, index) {
	this._query = query;
	this._similarity = similarity;
	this._index = index;
	this._inputs = [];
	
	this.addInputs(query.clauses);
};

BooleanScorer.prototype = Object.create(Stream.prototype);

/**
 * @protected
 * @type {BooleanQuery} 
 */

BooleanScorer.prototype._query;

/**
 * @protected
 * @type {Similarity} 
 */

BooleanScorer.prototype._similarity;

/**
 * @protected
 * @type {Index} 
 */

BooleanScorer.prototype._index;

/**
 * @protected
 * @type {Array.<BooleanClauseStream>}
 */

BooleanScorer.prototype._inputs;

/**
 * @protected
 * @type {number}
 */

BooleanScorer.prototype._collectorCount = 0;

/**
 * @protected
 * @type {boolean}
 */

BooleanScorer.prototype._paused = false;

/**
 * @type {boolean}
 */

BooleanScorer.prototype.readable = true;

/**
 * @type {boolean}
 */

BooleanScorer.prototype.writable = true;

/**
 * @param {Array.<BooleanClause>} clauses
 */

BooleanScorer.prototype.addInputs = function (clauses) {
	var self = this, x, xl, clause, collector, bcs, remover;
	for (x = 0, xl = clauses.length; x < xl; ++x) {
		clause = clauses[x];
		collector = new SingleCollector();
		bcs = new BooleanClauseStream(clause.query, clause.occur, collector);
		
		collector.pipe(this, {end : false});
		clause.query.score(this._similarity, this._index).pipe(collector);
		
		this._inputs.push(bcs);
		this._collectorCount++;
		
		remover = (function (b) {
			return function () {
				b.collector = null;
				self._collectorCount--;
				
				if (!self._collectorCount || b.occur === Occur.MUST) {
					self._collectorCount = 0;  //to pass sanity checks
					self.end();
				}
			}
		})(bcs);
		
		collector.on('end', remover);
		collector.on('close', remover);
	}
};

/**
 * @return {boolean}
 */

BooleanScorer.prototype.write = function () {
	var x, xl, docs = [], lowestIndex = 0, lowestID, match = false, optionalMatches = 0, doc;
	
	if (this._paused) {
		return true;  //scorer is paused, proceed no further
	}
	
	//collect all documents, find lowest document ID
	for (x = 0, xl = this._inputs.length; x < xl; ++x) {
		if (this._inputs[x].collector) {
			docs[x] = this._inputs[x].collector.data;
			
			if (typeof docs[x] === "undefined") {
				return true;  //not all collectors are full
			}
		} else {
			docs[x] = undefined;
		}
		
		if (x > 0 && (!docs[lowestIndex] || (docs[x] && docs[x].id < docs[lowestIndex].id))) {
			lowestIndex = x;
		}
	}
	
	lowestID = docs[lowestIndex].id;
	doc = new DocumentTerms(lowestID);
	
	//perform boolean logic
	for (x = 0, xl = this._inputs.length; x < xl; ++x) {
		if (docs[x] && docs[x].id === lowestID) {
			if (this._inputs[x].occur === Occur.MUST_NOT) {
				match = false;
				break;  //this document has a forbidden term
			} else {  //MUST or SHOULD
				if (this._inputs[x].occur === Occur.SHOULD) {
					optionalMatches++;
				}
				match = true;
				doc.terms = doc.terms.concat(docs[x].terms);
				doc.sumOfSquaredWeights += docs[x].sumOfSquaredWeights;
				doc.score += docs[x].score;
			}
		} else if (this._inputs[x].occur === Occur.MUST) {
			match = false;
			break;  //this document does not have a required term
		}
	}
	
	if (match && optionalMatches >= this._query.minimumOptionalMatches) {
		doc.sumOfSquaredWeights *= this._query.boost * this._query.boost;
		this.emit('data', doc);
	}
	
	//remove documents with lowestID
	for (x = 0, xl = this._inputs.length; x < xl; ++x) {
		if (docs[x] && docs[x].id === lowestID) {
			this._inputs[x].collector.drain();
		}
	}
	
	return true;
};

/**
 */

BooleanScorer.prototype.end = function () {
	//sanity check
	if (this._collectorCount) {
		throw new Error("BooleanScorer#end called while there are still collectors attached!");
	}
	
	this.emit('end');
	this.destroy();
};

/**
 */

BooleanScorer.prototype.pause = function () {
	this._paused = true;
};

/**
 */

BooleanScorer.prototype.resume = function () {
	this._paused = false;
	this.write();
};

/**
 */

BooleanScorer.prototype.destroy = function () {
	var x, xl;
	for (x = 0, xl = this._inputs.length; x < xl; ++x) {
		if (this._inputs[x].collector) {
			this._inputs[x].collector.destroy();
		}
	}
	Stream.prototype.destroy.call(this);
};

/**
 */

BooleanScorer.prototype.destroySoon = BooleanScorer.prototype.destroy;


/**
 * @protected
 * @constructor
 * @param {Query} query
 * @param {Occur} occur
 * @param {WritableStream} collector
 */

function BooleanClauseStream(query, occur, collector) {
	//BooleanClause.call(this, query, occur);
	this.query = query;
	this.occur = occur;
	this.collector = collector;
};

BooleanClauseStream.prototype = Object.create(BooleanClause.prototype);

/**
 * @type {WritableStream}
 */

BooleanClauseStream.prototype.collector;


exports.BooleanQuery = BooleanQuery;