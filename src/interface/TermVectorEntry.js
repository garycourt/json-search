/**
 * @interface
 */

function TermVectorEntry() {};

/**
 * @type {Term}
 */

TermVectorEntry.prototype.term;

/**
 * @type {number|undefined}
 */

TermVectorEntry.prototype.termFrequency;

/**
 * @type {Array.<number>|undefined}
 */

TermVectorEntry.prototype.termPositions;

/**
 * @type {Array.<number>|undefined}
 */

TermVectorEntry.prototype.termOffsets;

/**
 * @type {FieldName}
 */

TermVectorEntry.prototype.field;

/**
 * @type {number|undefined}
 */

TermVectorEntry.prototype.fieldBoost;

/**
 * @type {number|undefined}
 */

TermVectorEntry.prototype.totalFieldTokens;

/**
 * @type {number|undefined}
 */

TermVectorEntry.prototype.documentBoost;

/**
 * @type {DocumentID|undefined}
 */

TermVectorEntry.prototype.documentID;