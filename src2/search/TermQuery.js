/**
 * @constructor
 * @implements Query
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
 * @param {Searcher} searcher
 * @param {InputStream} output
 * @return {Scorer}
 */

TermQuery.prototype.createScorer = function (searcher, output) {
	return new TermScorer(this, searcher, output);
};

/**
 * @return {Array.<string>}
 */

TermQuery.prototype.extractTerms = function () {
	return [this.term];
};


/**
 * @protected
 * @constructor
 * @extends Pipe
 * @implements Scorer
 * @param {TermQuery} query
 * @param {Searcher} searcher
 * @param {InputStream} output
 */

function TermScorer(query, searcher, output) {
	this._query = query;
	this._searcher = searcher;
	Pipe.call(this, output);
}

TermScorer.prototype = Object.create(Pipe.prototype);

/**
 * @protected
 * @type {TermQuery}
 */

TermScorer.prototype._query;

/**
 * @protected
 * @type {Searcher}
 */

TermScorer.prototype._searcher;

/**
 * @param {Index} index
 */

TermScorer.prototype.scoreDocuments = function (index) {
	index.getTermVectors(this._query.term, this._query.field, this);
};

/**
 * @param {TermVector} termVec
 * @override
 */

TermScorer.prototype.push = function (termVec) {
	var similarity = this._searcher.similarity,
		doc = new DocumentTerms(termVec.documentID, [termVec]);
	
	//compute sumOfSquaredWeights
	doc.sumOfSquaredWeights = Math.pow((similarity.idf(termVec) * this._query.boost), 2);
	
	//compute score
	doc.score = similarity.tf(termVec) * 
		Math.pow(similarity.idf(termVec), 2) * 
		this._query.boost * 
		similarity.norm(termVec);
	
	Pipe.prototype.push.call(this, doc);
};


exports.TermQuery = TermQuery;