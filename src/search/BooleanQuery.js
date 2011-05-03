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
};

/**
 * @type {BooleanQuery} 
 */

BooleanScorer.prototype._query;

/**
 * @type {Similarity} 
 */

BooleanScorer.prototype._similarity;

/**
 * @type {Index} 
 */

BooleanScorer.prototype._index;

/**
 * @type {boolean}
 */

BooleanScorer.prototype.readable = true;

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


exports.BooleanQuery = BooleanQuery;