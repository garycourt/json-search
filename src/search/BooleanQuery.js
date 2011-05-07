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
 * @type {boolean}
 */

BooleanScorer.prototype.readable = true;

/**
 * @param {Array.<BooleanClause>} clauses
 */

BooleanScorer.prototype.addInputs = function (clauses) {
	var self = this, x, xl, clause, collector;
	for (x = 0, xl = clauses.length; x < xl; ++x) {
		clause = clauses[x];
		collector = new SingleCollector(function (err) {
			if (err) {
				self.emit('error', err);
			} else {
				self.process();
			}
		});
		clause.query.score(this._similarity, this._index).pipe(collector);
		this._inputs.push(new BooleanClauseStream(clause.query, clause.occur, collector));
	}
};

/**
 */

BooleanScorer.prototype.process = function () {};  //TODO

/**
 */

BooleanScorer.prototype.pause = function () {};  //TODO

/**
 */

BooleanScorer.prototype.resume = function () {};  //TODO

/**
 */

BooleanScorer.prototype.destroy = function () {};  //TODO

/**
 */

BooleanScorer.prototype.destroySoon = function () {};  //TODO


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