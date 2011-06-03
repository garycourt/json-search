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
 * @private
 * @type {Array.<Term>|null}
 */
 
TermRangeQuery.prototype._terms = null;

/**
 * @param {Similarity} similarity
 * @param {Index} index
 * @return {Stream}
 */

TermRangeQuery.prototype.score = function (similarity, index) {
	var self = this,
		stream = new Stream();
	
	index.getTermRange(this.field, this.startTerm, this.endTerm, this.excludeStart, this.excludeEnd, function (err, terms) {
		if (!err) {
			try {
				self._terms = terms;
				(new MultiTermQuery(self.field, terms, false, self.boost)).score(similarity, index).pipe(stream);
			} catch (e) {
				stream.error(e);
			}
		} else {
			stream.error(err);
		}
	});
	
	return stream;
};

/**
 * @return {Array.<TermVector>}
 */

TermRangeQuery.prototype.extractTerms = function () {
	var terms, result, x, xl;
	if (this._terms) {
		terms = this._terms;
		result = new Array(terms.length);
		for (x = 0, xl = terms.length; x < xl; ++x) {
			result[x] = /** @type {TermVector} */ ({
				term : terms[x],
				field : this.field
			});
		}
		return result;
	} else {
		//we don't know how many terms this range encompasses
		//the best we can do is return at least one term
		return [ /** @type {TermVector} */ ({
			term : this.startTerm,
			field : this.field
		})];
	}
};

/**
 * @return {Query}
 */

TermRangeQuery.prototype.rewrite = function () {
	return this;  //can not be optimized
};


exports.TermRangeQuery = TermRangeQuery;