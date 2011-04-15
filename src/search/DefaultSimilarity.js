/**
 * @constructor
 * @implements Similarity
 */

var DefaultSimilarity = function () {};

/**
 * @type {boolean}
 */

DefaultSimilarity.prototype.discountOverlaps = true;

/**
 * @param {string} field
 * @param {FieldInvertState} state
 * @return {number}
 */

DefaultSimilarity.prototype.computeNorm = function (field, state) {
	var numTerms;
	
	if (this.discountOverlaps) {
		numTerms = state.length - state.numOverlap;
	} else {
		numTerms = state.length;
	}
	
	return state.boost * (1.0 / Math.sqrt(numTerms));
};

/**
 * @param {number} sumOfSquaredWeights
 * @return {number}
 */

DefaultSimilarity.prototype.queryNorm = function (sumOfSquaredWeights) {
	return 1.0 / Math.sqrt(sumOfSquaredWeights);
};

/**
 * @param {number} freq
 * @return {number}
 */

DefaultSimilarity.prototype.tf = function (freq) {
	return Math.sqrt(freq);
};

/**
 * @param {number} distance
 * @return {number}
 */

DefaultSimilarity.prototype.sloppyFreq = function (distance) {
	return 1.0 / (distance + 1);
};

/**
 * @param {number} docFreq
 * @param {number} numDocs
 * @return {number}
 */

DefaultSimilarity.prototype.idf = function (docFreq, numDocs) {
	return Math.log(numDocs / (docFreq + 1)) + 1.0;
};

/**
 * @param {number} overlap
 * @param {number} maxOverlap
 * @return {number}
 */

DefaultSimilarity.prototype.coord = function (overlap, maxOverlap) {
	return overlap / maxOverlap;
};

/**
 * @param {DocumentID} docId
 * @param {string} fieldName
 * @param {number} start
 * @param {number} end
 * @param {Array} payload
 * @param {number} offset
 * @param {number} length
 * 
 * @return {number}
 */

DefaultSimilarity.prototype.scorePayload = function (docId, fieldName, start, end, payload, offset, length) {
	return 1;
};

/**
 * @param {Term} term
 * @param {SearchResult} search
 * @param {number} [docFreq]
 * @return {Explanation}
 */

DefaultSimilarity.prototype.explainTermIDF = function (term, search, docFreq) {
	var max = search.numDocs || 0;
	if (docFreq === undefined) {
		docFreq = search.termDocFreq[term] || 0;
	}
	return new Explanation(this.idf(docFreq, max), "idf(docFreq=" + docFreq + ", maxDocs=" + max + ")");
};

/**
 * @param {Array.<Term>} terms
 * @param {SearchResult} search
 * @return {Explanation}
 */

DefaultSimilarity.prototype.explainPhraseIDF = function (terms, search) {
	var max = search.numDocs || 0,
		idf = 0.0,
		exp = [],
		i,
		df;
	
	for (i = 0; i < terms.length; i++) {
		df = search.termDocFreq[terms[i]] || 0;
		idf += this.idf(df, max);
		exp.push(" ");
		exp.push(terms[i].text);
		exp.push("=");
		exp.push(df);
	}
	
	return new Explanation(idf, exp.join(""));
};


exports.DefaultSimilarity = DefaultSimilarity;