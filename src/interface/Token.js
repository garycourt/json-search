/**
 * @constructor
 */

function Token() {};

/**
 * @type {Term|undefined}
 */

Token.prototype.value;

/**
 * @type {number|undefined}
 */

Token.prototype.startOffset;

/**
 * @type {number|undefined}
 */

Token.prototype.endOffset;

/**
 * @type {number}
 */

Token.prototype.positionIncrement;