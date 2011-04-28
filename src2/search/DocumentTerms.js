/**
 * @constructor
 * @param {DocumentID} id
 * @param {Array.<TermVector>} [terms]
 */

function DocumentTerms(id, terms) {
	this.id = id;
	this.terms = terms || [];
}

/**
 * @type {DocumentID}
 */

DocumentTerms.prototype.id;

/**
 * @type {Array.<TermVector>}
 */

DocumentTerms.prototype.terms = [];

/**
 * @type {number}
 */

DocumentTerms.prototype.sumOfSquaredWeights;

/**
 * @type {number}
 */

DocumentTerms.prototype.score;


exports.DocumentTerms = DocumentTerms;