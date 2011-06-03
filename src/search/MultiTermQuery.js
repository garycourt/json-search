/**
 * @constructor
 * @implements {Query}
 * @param {FieldName} field
 * @param {Array.<Term>} terms
 * @param {boolean} [all]
 * @param {number} [boost]
 */

function MultiTermQuery(field, terms, all, boost) {
	this.field = field;
	this.terms = terms;
	this.all = all || false;
	this.boost = boost || 1.0;
};

/**
 * @type {FieldName}
 */

MultiTermQuery.prototype.field;

/**
 * @type {Array.<Term>}
 */

MultiTermQuery.prototype.terms;

/**
 * @type {boolean}
 */

MultiTermQuery.prototype.all = false;

/**
 * @type {number}
 */

MultiTermQuery.prototype.boost = 1.0;

/**
 * @param {Similarity} similarity
 * @param {Index} index
 * @return {Stream}
 */

MultiTermQuery.prototype.score = function (similarity, index) {
	return this.rewrite().score(similarity, index);
};

/**
 * @return {Array.<TermVector>}
 */

MultiTermQuery.prototype.extractTerms = function () {
	var terms, result, x, xl;
	terms = this.terms;
	result = new Array(terms.length);
	for (x = 0, xl = terms.length; x < xl; ++x) {
		result[x] = /** @type {TermVector} */ ({
			term : terms[x],
			field : this.field
		});
	}
	return result;
};

/**
 * @return {Query}
 */

MultiTermQuery.prototype.rewrite = function () {
	var query, terms, occur, x, xl;
	if (this.terms.length === 1) {
		return new TermQuery(this.field, this.terms[0], this.boost);
	}
	//else
	query = new BooleanQuery();
	query.boost = this.boost;
	terms = this.terms;
	occur = this.all ? Occur.MUST : Occur.SHOULD;
	for (x = 0, xl = terms.length; x < xl; ++x) {
		query.clauses.push(new BooleanClause(new TermQuery(this.field, terms[x]), occur));
	}
	return query;
};


exports.MultiTermQuery = MultiTermQuery;