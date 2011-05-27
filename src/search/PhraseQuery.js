/**
 * @constructor
 * @implements {Query}
 * @param {FieldName} [field]
 * @param {Array.<Term|undefined>} [terms]
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
 * @type {FieldName}
 */

PhraseQuery.prototype.field = null;

/**
 * @type {Array.<Term|undefined>}
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
		return new TermQuery(this.field, /** @type {string} */ (this.terms[0]), this.boost);
	}
	//else
	return this;
};


exports.PhraseQuery = PhraseQuery;