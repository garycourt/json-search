var Query;

Query = function () {};

Query.prototype.boost = 1.0;

Query.prototype.createWeight = function (searcher) {
	throw new Error("Unsupported Operation");
};

Query.prototype.getSimilarity = function (searcher) {
	return searcher.getSimilarity();
};

Query.prototype.weight = function (searcher) {
	var query = searcher.rewrite(this),
		weight = query.createWeight(searcher),
		sum = weight.sumOfSquaredWeights(),
		norm = this.getSimilarity(searcher).queryNorm(sum);
	
	if (norm === Number.POSITIVE_INFINITY || norm === Number.NEGATIVE_INFINITY || isNaN(norm)) {
		norm = 1.0;
	}
	
	weight.normalize(norm);
	return weight;
};

Query.prototype.rewrite = function (reader) {
	return this;
};

Query.prototype.combine = function (queries) {
	throw new Error("Not Implemented");
};

Query.prototype.extractTerms = function (terms) {
	throw new Error("Unsupported Operation");
};


exports.Query = Query;