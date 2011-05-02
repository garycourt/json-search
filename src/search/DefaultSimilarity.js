/**
 * @constructor
 * @implements Similarity
 */

var DefaultSimilarity = function () {};

/**
 * @param {TermVector} termVec
 * @return {number}
 */

DefaultSimilarity.prototype.norm = function (termVec) {
	return termVec.documentBoost * termVec.fieldBoost * (1.0 / Math.sqrt(termVec.totalFieldTokens));
};

/**
 * @param {DocumentTerms} doc
 * @return {number}
 */

DefaultSimilarity.prototype.queryNorm = function (doc) {
	return 1.0 / Math.sqrt(doc.sumOfSquaredWeights);
};

/**
 * @param {TermVector} termVec
 * @return {number}
 */

DefaultSimilarity.prototype.tf = function (termVec) {
	return Math.sqrt(termVec.termFrequency);
};

/**
 * @param {number} distance
 * @return {number}
 */

DefaultSimilarity.prototype.sloppyFreq = function (distance) {
	return 1.0 / (distance + 1);
};

/**
 * @param {TermVector} termVec
 * @return {number}
 */

DefaultSimilarity.prototype.idf = function (termVec) {
	return Math.log(termVec.totalDocuments / (termVec.documentFrequency + 1)) + 1.0;
};

/**
 * @param {number} overlap
 * @param {number} maxOverlap
 * @return {number}
 */

DefaultSimilarity.prototype.coord = function (overlap, maxOverlap) {
	return overlap / maxOverlap;
};


exports.DefaultSimilarity = DefaultSimilarity;