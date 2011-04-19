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
	index.getTermDocuments(this._query.term, this._query.field, this);
};

/**
 * @param {TermDocument} termDoc
 * @override
 */

TermScorer.prototype.push = function (termDoc) {
	var similarity = this._searcher.similarity,
		doc = new DocumentTerms(termDoc.documentID, [termDoc]);
	
	//compute sumOfSquaredWeights
	doc.sumOfSquaredWeights = Math.pow((similarity.idf(termDoc) * this._query.boost), 2);
	
	//compute score
	doc.score = similarity.tf(termDoc) * 
		Math.pow(similarity.idf(termDoc), 2) * 
		this._query.boost * 
		similarity.norm(termDoc);
	
	Pipe.prototype.push.call(this, doc);
};