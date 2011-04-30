/**
 * @interface
 * @extends {TermVectorEntry}
 */

function TermVector() {};

/**
 * @type {string|number|boolean|null}
 */

TermVector.prototype.term;

/**
 * @type {number}
 */

TermVector.prototype.termFrequency;

/**
 * @type {Array.<number>}
 */

TermVector.prototype.termPositions;

/**
 * @type {Array.<number>}
 */

TermVector.prototype.termOffsets;

/**
 * @type {string}
 */

TermVector.prototype.field;

/**
 * @type {number}
 */

TermVector.prototype.fieldBoost;

/**
 * @type {number}
 */

TermVector.prototype.totalFieldTerms;

/**
 * @type {number}
 */

TermVector.prototype.documentBoost;

/**
 * @type {DocumentID}
 */

TermVector.prototype.documentID;

/**
 * @type {number}
 */

TermVector.prototype.documentFrequency;

/**
 * @type {number}
 */

TermVector.prototype.totalDocuments;