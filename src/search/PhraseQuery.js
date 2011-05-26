/**
 * @constructor
 * @implements {Query}
 * @param {string|null} [field]
 * @param {Array.<string|undefined>} [terms]
 * @param {number} [slop]
 * @param {number} [boost]
 */

function PhraseQuery(field, terms, slop, boost) {
	this.field = field || null;
	this.terms = terms || [];
	this.slop = slop || 0;
	this.boost = boost || 1.0;
};

/**
 * @type {string|null}
 */

PhraseQuery.prototype.field = null;

/**
 * @type {Array.<string|undefined>}
 */

PhraseQuery.prototype.terms;

/**
 * @type {number}
 */

PhraseQuery.prototype.slop = 0;

/**
 * @type {number}
 */

PhraseQuery.prototype.boost = 1.0;

/**
 * @param {Similarity} similarity
 * @param {Index} index
 * @return {ReadableStream}
 */

PhraseQuery.prototype.score = function (similarity, index) {
	//TODO
};

/**
 * @return {Array.<TermVectorEntry>}
 */

PhraseQuery.prototype.extractTerms = function () {
	var x, xl, terms = [];
	for (x = 0, xl = this.terms.length; x < xl; ++x) {
		if (typeof this.terms[x] !== "undefined") {
			terms.push(/** @type {TermVectorEntry} */ ({
				term : this.terms[x],
				field : this.field
			}));
		}
	}
	return terms;
};

/**
 * @return {Query}
 */

PhraseQuery.prototype.rewrite = function () {
	//TODO: Remove useless undefineds from start/end of array
	
	if (this.terms.length === 1 && typeof this.terms[0] !== "undefined") {
		return new TermQuery(/** @type {string} */ (this.terms[0]), this.field, this.boost);
	}
	//else
	return this;
};


exports.PhraseQuery = PhraseQuery;