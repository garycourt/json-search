/**
 * @constructor
 * @implements {Query}
 * @param {FieldName} field
 * @param {Term} term
 * @param {number} [boost]
 */

function TermQuery(field, term, boost) {
	this.field = field || null;
	this.term = term;
	this.boost = boost || 1.0;
};

/**
 * @type {FieldName}
 */

TermQuery.prototype.field = null;

/**
 * @type {Term}
 */

TermQuery.prototype.term;

/**
 * @type {number}
 */

TermQuery.prototype.boost = 1.0;

/**
 * @param {Similarity} similarity
 * @param {Index} index
 * @return {Stream}
 */

TermQuery.prototype.score = function (similarity, index) {
	var scorer = new TermScorer(this, similarity);
	index.getTermVectors(this.field, this.term).pipe(scorer);
	return scorer;
};

/**
 * @return {Array.<TermVector>}
 */

TermQuery.prototype.extractTerms = function () {
	return [ /** @type {TermVector} */ ({
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

/**
 * @param {TermVector} termVec
 */

TermScorer.prototype.onWrite = function (termVec) {
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
	
	this.emit(doc);
};

/**
 * @param {Array.<TermVector>} termVecs
 */

TermScorer.prototype.onBulkWrite = function (termVecs) {
	var similarity = this._similarity,
		termVec, doc, idf,
		docs = new Array(termVecs.length);
	
	for (x = 0, xl = termVecs.length; x < xl; ++x) {
		termVec = termVecs[x];
		doc = new DocumentTerms(termVec.documentID, [termVec]);
		idf = similarity.idf(termVec);
		
		//compute sumOfSquaredWeights
		doc.sumOfSquaredWeights = (idf * this._boost) * (idf * this._boost);
		
		//compute score
		doc.score = similarity.tf(termVec) * 
			idf * idf *
			this._boost * 
			similarity.norm(termVec);
		
		docs[x] = doc;
	}
	
	this.emitBulk(docs);
};


exports.TermQuery = TermQuery;