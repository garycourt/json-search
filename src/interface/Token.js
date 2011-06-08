/**
 * @constructor
 */

function Token() {};

/**
 * @type {string}
 */

Token.prototype.type;

/**
 * @type {string|undefined}
 */

Token.prototype.value;

/**
 * @type {number}
 */

Token.prototype.startOffset;

/**
 * @type {number}
 */

Token.prototype.endOffset;

/**
 * @type {number}
 */

Token.prototype.positionIncrement;