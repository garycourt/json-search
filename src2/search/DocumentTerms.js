/**
 * @constructor
 * @param {DocumentID} id
 * @param {Array.<TermDocument>} [terms]
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
 * @type {Array.<TermDocument>}
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