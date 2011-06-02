/**
 * @constructor
 * @param {DocumentID} id
 * @param {Array.<TermVector>} [terms]
 */

function DocumentTerms(id, terms) {
	this.id = id;
	this.terms = terms || [];
}

DocumentTerms.compare = function (a, b) {
	if (a.id < b.id) {
		return -1;
	} else if (a.id > b.id) {
		return 1;
	} 
	//else
	return 0;
};

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

DocumentTerms.prototype.sumOfSquaredWeights = 0;

/**
 * @type {number}
 */

DocumentTerms.prototype.score = 0;


exports.DocumentTerms = DocumentTerms;