var DefaultSimilarity;

DefaultSimilarity = function () {};

DefaultSimilarity.prototype.discountOverlaps = true;

DefaultSimilarity.prototype.computeNorm = function (field, state) {
	var numTerms;
	
	if (this.discountOverlaps) {
		numTerms = state.getLength() - state.getNumOverlap();
	} else {
		numTerms = state.getLength();
	}
	
	return state.getBoost() * (1.0 / Math.sqrt(numTerms));
};

DefaultSimilarity.prototype.queryNorm = function (sumOfSquaredWeights) {
	return 1.0 / Math.sqrt(sumOfSquaredWeights);
};

DefaultSimilarity.prototype.tf = function (freq) {
	return Math.sqrt(freq);
};

DefaultSimilarity.prototype.sloppyFreq = function (distance) {
	return 1.0 / (distance + 1);
};

DefaultSimilarity.prototype.idf = function (docFreq, numDocs) {
	return Math.log(numDocs / (docFreq + 1)) + 1.0;
};

DefaultSimilarity.prototype.coord = function (overlap, maxOverlap) {
	return overlap / maxOverlap;
};

DefaultSimilarity.prototype.scorePayload = function (docId, fieldName, start, end, payload, offset, length) {
	return 1;
};


exports.DefaultSimilarity = DefaultSimilarity;