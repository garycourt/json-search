/**
 * @interface
 * @extends {TermVectorEntry}
 */

function TermVector() {};

/**
 * @type {Term}
 */

TermVector.prototype.term;

/**
 * @type {number}
 */

TermVector.prototype.termFrequency;

/**
 * @type {Array.<number>|null}
 */

TermVector.prototype.termPositions;

/**
 * @type {Array.<number>|null}
 */

TermVector.prototype.termOffsets;

/**
 * @type {FieldName}
 */

TermVector.prototype.field;

/**
 * @type {number}
 */

TermVector.prototype.fieldBoost;

/**
 * @type {number}
 */

TermVector.prototype.totalFieldTokens;

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