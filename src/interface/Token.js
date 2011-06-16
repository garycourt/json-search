/**
 * @constructor
 */

function Token() {};

/**
 * @type {Term}
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