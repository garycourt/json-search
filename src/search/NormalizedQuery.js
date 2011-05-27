/**
 * Used only by Searcher. Do not include this in your queries.
 * 
 * @constructor
 * @implements {Query}
 * @param {Query} query
 * @param {number} [boost]
 */

function NormalizedQuery(query, boost) {
	this.query = query;
	this.boost = boost || 1.0;
};

/**
 * @type {Query}
 */

NormalizedQuery.prototype.query;

/**
 * @type {number}
 */

NormalizedQuery.prototype.boost = 1.0;

/**
 * @param {Similarity} similarity
 * @param {Index} index
 * @return {ReadableStream}
 */

NormalizedQuery.prototype.score = function (similarity, index) {
	var scorer = new NormalizedScorer(this, similarity);
	this.query.score(similarity, index).pipe(scorer);
	return scorer;
};

/**
 * @return {Array.<TermVector>}
 */

NormalizedQuery.prototype.extractTerms = function () {
	return this.query.extractTerms();
};

/**
 * @return {Query}
 */

NormalizedQuery.prototype.rewrite = function () {
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
 * @param {NormalizedQuery} query
 * @param {Similarity} similarity
 */

function NormalizedScorer(query, similarity) {
	Stream.call(this);
	this._query = query;
	this._similarity = similarity;
	this._maxOverlap = query.extractTerms().length;
}

NormalizedScorer.prototype = Object.create(Stream.prototype);

/**
 * @protected
 * @type {NormalizedQuery}
 */

NormalizedScorer.prototype._query;

/**
 * @protected
 * @type {Similarity}
 */

NormalizedScorer.prototype._similarity;

/**
 * @protected
 * @type {number}
 */

NormalizedScorer.prototype._maxOverlap;

NormalizedScorer.prototype.readable = true;

NormalizedScorer.prototype.writable = true;

/**
 * @param {DocumentTerms} doc
 */

NormalizedScorer.prototype.write = function (doc) {
	doc.score *= this._query.boost * this._similarity.queryNorm(doc) * this._similarity.coord(doc.terms.length, this._maxOverlap);
	//doc.sumOfSquaredWeights *= this._query.boost * this._query.boost;  //normally this operation is useless
	this.emit('data', doc);
};

/**
 * @param {DocumentTerms} [doc]
 */

NormalizedScorer.prototype.end = function (doc) {
	if (typeof doc !== "undefined") {
		this.write(doc);
	}
	this.emit('end');
	this.destroy();
};


exports.NormalizedQuery = NormalizedQuery;