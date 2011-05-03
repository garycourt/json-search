/**
 * @constructor
 * @param {Query} query
 * @param {Occur} [occur]
 */

function BooleanClause(query, occur) {
	this.query = query;
	this.occur = occur || Occur.SHOULD;
};

/**
 * @type {Query}
 */

BooleanClause.prototype.query;

/**
 * @type {Occur}
 */

BooleanClause.prototype.occur;


/**
 * @const
 * @enum {number}
 */

var Occur = {
	MUST : 1,
	SHOULD : 0,
	MUST_NOT : -1
};


exports.BooleanQuery = BooleanQuery;
exports.Occur = Occur;