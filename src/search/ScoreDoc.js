/** 
 * Expert: Returned by low-level search implementations.
 * @constructor
 * @param {DocumentID} doc
 * @param {number} score
 * @see TopDocs 
 */

var ScoreDoc = function (doc, score) {
	this.doc = doc;
	this.score = score;
}

/** 
 * Expert: The score of this document for the query.
 * @type {number} 
 */

ScoreDoc.prototype.score;

/**
 * Expert: A hit document's ID.
 * @type {DocumentID}
 * @see IndexSearcher#doc
 */

ScoreDoc.prototype.doc;


exports.ScoreDoc = ScoreDoc;