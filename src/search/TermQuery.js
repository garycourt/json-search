/**
 * @constructor
 * @implements {Query}
 * @param {string} term
 * @param {string|null} [field]
 * @param {number} [boost]
 */

function TermQuery(term, field, boost) {
	this.term = term;
	this.field = field || null;
	this.boost = boost || 1.0;
};

/**
 * @type {string}
 */

TermQuery.prototype.term;

/**
 * @type {string|null}
 */

TermQuery.prototype.field = null;

/**
 * @type {number}
 */

TermQuery.prototype.boost = 1.0;

/**
 * @param {Similarity} similarity
 * @param {Index} index
 * @return {ReadableStream}
 */

TermQuery.prototype.score = function (similarity, index) {
	var scorer = new TermScorer(this, similarity);
	index.getTermVectors(this.term, this.field).pipe(scorer);
	return scorer;
};

/**
 * @return {Array.<TermVectorEntry>}
 */

TermQuery.prototype.extractTerms = function () {
	return [ /** @type {TermVectorEntry} */ ({
		term : this.term,
		field : this.field
	})];
};

/**
 * @return {Query}
 */

TermQuery.prototype.rewrite = function () {
	return this;  //can not be optimized
};


/**
 * @protected
 * @constructor
 * @extends {Stream}
 * @implements {ReadableStream}
 * @implements {WritableStream}
 * @param {Query} query
 * @param {Similarity} similarity
 */

function TermScorer(query, similarity) {
	Stream.call(this);
	this._boost = query.boost;
	this._similarity = similarity;
}

TermScorer.prototype = Object.create(Stream.prototype);

/**
 * @protected
 * @type {number}
 */

TermScorer.prototype._boost;

/**
 * @protected
 * @type {Similarity}
 */

TermScorer.prototype._similarity;

TermScorer.prototype.readable = true;

TermScorer.prototype.writable = true;

/**
 * @param {TermVector} termVec
 */

TermScorer.prototype.write = function (termVec) {
	var similarity = this._similarity,
		doc = new DocumentTerms(termVec.documentID, [termVec]),
		idf = similarity.idf(termVec);
	
	//compute sumOfSquaredWeights
	doc.sumOfSquaredWeights = (idf * this._boost) * (idf * this._boost);
	
	//compute score
	doc.score = similarity.tf(termVec) * 
		idf * idf *
		this._boost * 
		similarity.norm(termVec);
	
	this.emit('data', doc);
};

/**
 * @param {TermVector} [termVec]
 */

TermScorer.prototype.end = function (termVec) {
	if (typeof termVec !== "undefined") {
		this.write(termVec);
	}
	this.emit('end');
	this.destroy();
};


exports.TermQuery = TermQuery;