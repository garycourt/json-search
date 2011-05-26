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
 * @return {ReadableStream}
 */

FilterQuery.prototype.score = function (similarity, index) {
	var scorer = new FilterScorer(this, similarity);
	this.query.score(similarity, index).pipe(scorer);
	return scorer;
};

/**
 * @return {Array.<TermVectorEntry>}
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
 * @implements {ReadableStream}
 * @implements {WritableStream}
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

FilterScorer.prototype.readable = true;

FilterScorer.prototype.writable = true;

/**
 * @param {DocumentTerms} doc
 */

FilterScorer.prototype.write = function (doc) {
	if (this._query.filter(doc)) {
		doc.score *= this._query.boost;
		doc.sumOfSquaredWeights *= this._query.boost * this._query.boost;
		this.emit('data', doc);
	}
};

/**
 * @param {DocumentTerms} [doc]
 */

FilterScorer.prototype.end = function (doc) {
	if (typeof doc !== "undefined") {
		this.write(doc);
	}
	this.emit('end');
	this.destroy();
};


exports.FilterQuery = FilterQuery;