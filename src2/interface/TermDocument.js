/**
 * @interface
 */

function TermDocument() {};

/**
 * @type {string}
 */

TermDocument.prototype.term;

/**
 * @type {number}
 */

TermDocument.prototype.termFrequency;

/**
 * @type {Array.<number>}
 */

TermDocument.prototype.termPositions;

/**
 * @type {number}
 */

TermDocument.prototype.fieldBoost;

/**
 * @type {number}
 */

TermDocument.prototype.totalFieldTerms;

/**
 * @type {DocumentID}
 */

TermDocument.prototype.documentID;

/**
 * @type {number}
 */

TermDocument.prototype.documentBoost;

/**
 * @type {number}
 */

TermDocument.prototype.documentFrequency;

/**
 * @type {number}
 */

TermDocument.prototype.totalDocuments;