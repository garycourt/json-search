/**
 * @constructor
 * @implements {Query}
 * @param {FieldName} field
 * @param {Term} startTerm
 * @param {Term} endTerm
 * @param {boolean} [excludeStart]
 * @param {boolean} [excludeEnd]
 * @param {number} [boost]
 */

function TermRangeQuery(field, startTerm, endTerm, excludeStart, excludeEnd, boost) {
	this.field = field || null;
	this.startTerm = startTerm;
	this.endTerm = endTerm;
	this.excludeStart = excludeStart || false;
	this.excludeEnd = excludeEnd || false;
	this.boost = boost || 1.0;
};

/**
 * @type {FieldName}
 */

TermRangeQuery.prototype.field = null;

/**
 * @type {Term}
 */

TermRangeQuery.prototype.startTerm;

/**
 * @type {Term}
 */

TermRangeQuery.prototype.endTerm;

/**
 * @type {boolean}
 */

TermRangeQuery.prototype.excludeStart = false;

/**
 * @type {boolean}
 */

TermRangeQuery.prototype.excludeEnd = false;

/**
 * @type {number}
 */

TermRangeQuery.prototype.boost = 1.0;

/**
 * @param {Similarity} similarity
 * @param {Index} index
 * @return {ReadableStream}
 */

TermRangeQuery.prototype.score = function (similarity, index) {
	var scorer = new TermScorer(this, similarity);
	index.getTermRangeVectors(this.field, this.startTerm, this.endTerm, this.excludeStart, this.excludeEnd).pipe(scorer);
	return scorer;
};

/**
 * @return {Array.<TermVector>}
 */

TermRangeQuery.prototype.extractTerms = function () {
	return [ /** @type {TermVector} */ ({
		term : this.startTerm,
		field : this.field
	})];
};

/**
 * @return {Query}
 */

TermRangeQuery.prototype.rewrite = function () {
	return this;  //can not be optimized
};


exports.TermRangeQuery = TermRangeQuery;