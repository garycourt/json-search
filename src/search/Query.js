/**
 * @constructor
 */

var Query = function () {};

/**
 * @type {number}
 */

Query.prototype.boost = 1.0;

/**
 * @param {IndexSearcher} searcher
 * @return {Weight}
 */

Query.prototype.createWeight = function (searcher) {
	throw new Error("Unsupported Operation");
};

/**
 * @param {IndexSearcher} searcher
 * @return {Weight}
 */

Query.prototype.weight = function (searcher) {
	var query = searcher.rewrite(this),
		weight = query.createWeight(searcher),
		sum = weight.sumOfSquaredWeights(),
		norm = searcher.similarity.queryNorm(sum);
	
	if (norm === Number.POSITIVE_INFINITY || norm === Number.NEGATIVE_INFINITY || isNaN(norm)) {
		norm = 1.0;
	}
	
	weight.normalize(norm);
	return weight;
};

/**
 * @param {Index} reader
 * @return {Query}
 */

Query.prototype.rewrite = function (reader) {
	return this;
};

/**
 * @param {Array.<Term>} terms
 */

Query.prototype.extractTerms = function (terms) {
	throw new Error("Unsupported Operation");
};


exports.Query = Query;