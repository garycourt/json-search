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
 * @param {InputStream} output
 * @return {Scorer}
 */

TermQuery.prototype.createScorer = function (output) {
	return new TermScorer(this, output);
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
 * @param {InputStream} output
 */

function TermScorer(query, output) {
	Pipe.call(this, output);
	this._query = query;
}

TermScorer.prototype = Object.create(Pipe.prototype);

/**
 * @protected
 * @type {TermQuery}
 */

TermScorer.prototype._query;

/**
 * @param {Index} index
 */

TermScorer.prototype.scoreDocuments = function (index) {
	index.getTermDocuments(this._query.term, this._query.field, this);
};

/**
 * @param {TermDocument} doc
 * @override
 */

TermScorer.prototype.push = function (doc) {
	//compute score (TODO: get handle to Similarity)
	doc.score = similarity.tf(doc) * 
		Math.pow(similarity.idf(doc), 2) * 
		this._query.boost * 
		similarity.norm(doc);
	
	Pipe.prototype.push.apply(this, arguments);
};