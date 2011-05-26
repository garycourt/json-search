/**
 * @constructor
 * @implements {Query}
 * @param {string} prefix
 * @param {string|null} [field]
 * @param {number} [boost]
 */

function PrefixQuery(prefix, field, boost) {
	this.prefix = prefix;
	this.field = field || null;
	this.boost = boost || 1.0;
};

/**
 * @type {string}
 */

PrefixQuery.prototype.prefix;

/**
 * @type {string|null}
 */

PrefixQuery.prototype.field = null;

/**
 * @type {number}
 */

PrefixQuery.prototype.boost = 1.0;

/**
 * @param {Similarity} similarity
 * @param {Index} index
 * @return {ReadableStream}
 */

PrefixQuery.prototype.score = function (similarity, index) {
	return this.rewrite().score(similarity, index);
};

/**
 * @return {Array.<TermVectorEntry>}
 */

PrefixQuery.prototype.extractTerms = function () {
	return [ /** @type {TermVectorEntry} */ ({
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