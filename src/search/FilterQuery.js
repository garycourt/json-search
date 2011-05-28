/**
 * @constructor
 * @implements {Query}
 * @param {Query} query
 * @param {function(DocumentTerms)} filter
 * @param {number} [boost]
 */

function FilterQuery(query, filter, boost) {
	this.query = query;
	this.filter = filter;
	this.boost = boost || 1.0;
};

/**
 * @type {Query}
 */

FilterQuery.prototype.query;

/**
 * @type {function(DocumentTerms)}
 */

FilterQuery.prototype.filter;

/**
 * @type {number}
 */

FilterQuery.prototype.boost = 1.0;

/**
 * @param {Similarity} similarity
 * @param {Index} index
 * @return {Stream}
 */

FilterQuery.prototype.score = function (similarity, index) {
	var scorer = new FilterScorer(this, similarity);
	this.query.score(similarity, index).pipe(scorer);
	return scorer;
};

/**
 * @return {Array.<TermVector>}
 */

FilterQuery.prototype.extractTerms = function () {
	return this.query.extractTerms();
};

/**
 * @return {Query}
 */

FilterQuery.prototype.rewrite = function () {
	var oldQuery;
	do {
		oldQuery = this.query;
		this.query = this.query.rewrite();
	} while (this.query !== oldQuery);
	return this;
};


/**
 * @protected
 * @constructor
 * @extends {Stream}
 * @param {FilterQuery} query
 * @param {Similarity} similarity
 */

function FilterScorer(query, similarity) {
	Stream.call(this);
	this._query = query;
	this._similarity = similarity;
	this._maxOverlap = query.extractTerms().length;
}

FilterScorer.prototype = Object.create(Stream.prototype);

/**
 * @protected
 * @type {FilterQuery}
 */

FilterScorer.prototype._query;

/**
 * @protected
 * @type {Similarity}
 */

FilterScorer.prototype._similarity;

/**
 * @protected
 * @type {number}
 */

FilterScorer.prototype._maxOverlap;

/**
 * @param {DocumentTerms} doc
 */

FilterScorer.prototype.onWrite = function (doc) {
	var boost = this._query.boost;
	if (this._query.filter(doc)) {
		doc.score *= boost;
		doc.sumOfSquaredWeights *= boost * boost;
		this.emit(doc);
	}
};

/**
 * @param {Array.<DocumentTerms>} docs
 */

FilterScorer.prototype.onBulkWrite = function (docs) {
	var x, xl 
	boost = this._query.boost;
	
	docs = docs.filter(this._query.filter);
	for (x = 0, xl = docs.length; x < xl; ++x) {
		if (filter(docs[x])) {
			docs[x].score *= boost;
			docs[x].sumOfSquaredWeights *= boost * boost;
		}
	}
	
	this.emitBulk(docs);
};


exports.FilterQuery = FilterQuery;