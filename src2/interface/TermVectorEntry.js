/**
 * @interface
 */

function TermVectorEntry() {};

/**
 * @type {string|number|boolean|null}
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
 * @type {string}
 */

TermVectorEntry.prototype.field;

/**
 * @type {number|undefined}
 */

TermVectorEntry.prototype.fieldBoost;

/**
 * @type {number|undefined}
 */

TermVectorEntry.prototype.documentBoost;