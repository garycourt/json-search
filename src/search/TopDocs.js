/**
 * Represents hits returned by {@link IndexSearcher#search}.
 * 
 * @constructor
 * @param {number} [totalHits]
 * @param {Array.<ScoreDoc>} [scoreDocs]
 * @param {number} [maxScore]
 */

var TopDocs = function (totalHits, scoreDocs, maxScore) {
	this.totalHits = totalHits || 0;
	this.scoreDocs = scoreDocs || [];
	this.maxScore = maxScore || NaN;
};

/**
 * The total number of hits for the query.
 * @type {number}
 */

TopDocs.prototype.totalHits;

/**
 * The top hits for the query.
 * @type {Array.<ScoreDoc>}
 */

TopDocs.prototype.scoreDocs;

/**
 * Stores the maximum score value encountered, needed for normalizing.
 * @type {number}
 */

TopDocs.prototype.maxScore;


exports.TopDocs = TopDocs;