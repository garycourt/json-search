/**
 * @constructor
 * @implements {Query}
 * @param {FieldName} field
 * @param {string} prefix
 * @param {number} [boost]
 */

function PrefixQuery(field, prefix, boost) {
	this.field = field || null;
	this.prefix = prefix;
	this.boost = boost || 1.0;
};

/**
 * @type {string}
 */

PrefixQuery.prototype.prefix;

/**
 * @type {FieldName}
 */

PrefixQuery.prototype.field = null;

/**
 * @type {number}
 */

PrefixQuery.prototype.boost = 1.0;

/**
 * @param {Similarity} similarity
 * @param {Index} index
 * @return {Stream}
 */

PrefixQuery.prototype.score = function (similarity, index) {
	return this.rewrite().score(similarity, index);
};

/**
 * @return {Array.<TermVector>}
 */

PrefixQuery.prototype.extractTerms = function () {
	//since we don't know how many terms have this prefix
	//return the prefix as a term
	return [ /** @type {TermVector} */ ({
		term : this.prefix,
		field : this.field
	})];
};

/**
 * @return {TermRangeQuery}
 */

PrefixQuery.prototype.rewrite = function () {
	var endTerm = this.prefix.replace(/.$/, function (chr) {
		return String.fromCharCode(chr.charCodeAt(0) + 1);
	});
	return new TermRangeQuery(this.field, this.prefix, endTerm, false, true, this.boost);
};


exports.PrefixQuery = PrefixQuery;