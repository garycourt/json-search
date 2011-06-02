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
 * @return {Stream}
 */

TermRangeQuery.prototype.score = function (similarity, index) {
	var scorer = new TermRangeScorer(this, similarity),
		collector = new Collector(function (err, terms) {
			var x, xl, docs = {}, id, result = [];
			if (!err) {
				for (x = 0, xl = terms.length; x < xl; ++x) {
					id = terms[x].documentID;
					if (!docs[id]) {
						docs[id] = new DocumentTerms(terms[x].documentID, terms[x]);
					} else {
						docs[id].terms.push(terms[x]);
					}
				}
				
				for (id in docs) {
					if (terms.hasOwnProperty(id)) {
						result[result.length] = docs[id];
					}
				}
				docs = null;  //release memory
				result = result.sort(DocumentTerms.compare);
				
				scorer.bulkWrite(result);
			} else {
				scorer.error(err);
			}
		});
	index.getTermRangeVectors(this.field, this.startTerm, this.endTerm, this.excludeStart, this.excludeEnd).pipe(collector);
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