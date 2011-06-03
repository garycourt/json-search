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
 * @return {Stream}
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

/**
 * @protected
 * @type {number}
 */

NormalizedScorer.prototype._maxOverlap;

/**
 * @param {DocumentTerms} doc
 */

NormalizedScorer.prototype.onWrite = function (doc) {
	if (!this._maxOverlap) {
		this._maxOverlap = this._query.extractTerms().length;
	}
	
	doc.score *= this._query.boost * this._similarity.queryNorm(doc) * this._similarity.coord(doc.terms.length, this._maxOverlap);
	//doc.sumOfSquaredWeights *= this._query.boost * this._query.boost;  //normally this operation is useless
	this.emit(doc);
};

/**
 * @param {Array.<DocumentTerms>} docs
 */

NormalizedScorer.prototype.onBulkWrite = function (docs) {
	var x, xl, doc;
	
	if (!this._maxOverlap) {
		this._maxOverlap = this._query.extractTerms().length;
	}
	
	for (x = 0, xl = docs.length; x < xl; ++x) {
		doc = docs[x];
		doc.score *= this._query.boost * this._similarity.queryNorm(doc) * this._similarity.coord(doc.terms.length, this._maxOverlap);
		//doc.sumOfSquaredWeights *= this._query.boost * this._query.boost;  //normally this operation is useless
	}
	this.emitBulk(docs);
};


exports.NormalizedQuery = NormalizedQuery;