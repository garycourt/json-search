/**
 * @interface
 */

function TermVector() {};

/**
 * @type {Term}
 */

TermVector.prototype.term;

/**
 * @type {number|undefined}
 */

TermVector.prototype.termFrequency;

/**
 * @type {Array.<number>|null|undefined}
 */

TermVector.prototype.termPositions;

/**
 * @type {Array.<number>|null|undefined}
 */

TermVector.prototype.termOffsets;

/**
 * @type {FieldName}
 */

TermVector.prototype.field;

/**
 * @type {number|undefined}
 */

TermVector.prototype.fieldBoost;

/**
 * @type {number|undefined}
 */

TermVector.prototype.totalFieldTokens;

/**
 * @type {number|undefined}
 */

TermVector.prototype.documentBoost;

/**
 * @type {DocumentID}
 */

TermVector.prototype.documentID;

/**
 * @type {number|undefined}
 */

TermVector.prototype.documentFrequency;

/**
 * @type {number|undefined}
 */

TermVector.prototype.totalDocuments;