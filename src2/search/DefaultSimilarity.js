/**
 * @constructor
 * @implements Similarity
 */

var DefaultSimilarity = function () {};

/**
 * @param {TermDocument} termDoc
 * @return {number}
 */

DefaultSimilarity.prototype.norm = function (termDoc) {
	return termDoc.documentBoost * termDoc.fieldBoost * (1.0 / Math.sqrt(termDoc.totalFieldTerms));
};

/**
 * @param {DocumentTerms} doc
 * @return {number}
 */

DefaultSimilarity.prototype.queryNorm = function (doc) {
	return 1.0 / Math.sqrt(doc.sumOfSquaredWeights);
};

/**
 * @param {TermDocument} termDoc
 * @return {number}
 */

DefaultSimilarity.prototype.tf = function (termDoc) {
	return Math.sqrt(termDoc.termFrequency);
};

/**
 * @param {number} distance
 * @return {number}
 */

DefaultSimilarity.prototype.sloppyFreq = function (distance) {
	return 1.0 / (distance + 1);
};

/**
 * @param {TermDocument} termDoc
 * @return {number}
 */

DefaultSimilarity.prototype.idf = function (termDoc) {
	return Math.log(termDoc.totalDocuments / (termDoc.documentFrequency + 1)) + 1.0;
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