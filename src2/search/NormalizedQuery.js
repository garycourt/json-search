/**
 * @constructor
 * @implements Query
 * @param {Query} query
 */

function NormalizedQuery(query) {
	this.query = query;
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
 * @param {Index} index
 * @param {Similarity} similarity
 * @return {ReadableStream}
 */

NormalizedQuery.prototype.score = function (index, similarity) {
	var scorer = new NormalizedScorer(this, similarity);
	this.query.score(index, similarity).pipe(scorer);
	return scorer;
};

/**
 * @return {Array.<TermVectorEntry>}
 */

NormalizedQuery.prototype.extractTerms = function () {
	return this.query.extractTerms();
};


/**
 * @protected
 * @constructor
 * @extends Stream
 * @implements ReadableStream
 * @implements WritableStream
 * @param {NormalizedQuery} query
 * @param {Similarity} similarity
 */

function NormalizedScorer(query, similarity) {
	Stream.call(this);
	this._query = query;
	this._similarity = similarity;
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

NormalizedScorer.prototype.readable = true;

NormalizedScorer.prototype.writable = true;

/**
 * @param {DocumentTerms} doc
 */

NormalizedScorer.prototype.write = function (doc) {
	var queryTerms = this._query.extractTerms();
	doc.score *= this._similarity.queryNorm(doc) * this._similarity.coord(doc.terms.length, queryTerms.length);
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