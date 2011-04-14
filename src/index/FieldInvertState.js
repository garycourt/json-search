/**
 * @constructor
 * @param {number} [position]
 * @param {number} [length]
 * @param {number} [numOverlap]
 * @param {number} [offset]
 * @param {number} [boost]
 */

var FieldInvertState = function (position, length, numOverlap, offset, boost) {
	this.position = position || 0;
	this.length = length || 0;
	this.numOverlap = numOverlap || 0;
	this.offset = offset || 0;
	this.maxTermFrequency = 0;
	this.boost = boost || 1;
};

/**
 * @type {number}
 */

FieldInvertState.prototype.position = 0;
  
/**
 * @type {number}
 */
  
FieldInvertState.prototype.length = 0;

/**
 * @type {number}
 */
  
FieldInvertState.prototype.numOverlap = 0;

/**
 * @type {number}
 */
  
FieldInvertState.prototype.offset = 0;

/**
 * @type {number}
 */
  
FieldInvertState.prototype.maxTermFrequency = 0;

/**
 * @type {number}
 */
  
FieldInvertState.prototype.boost = 1;

/**
 * @param {number} docBoost
 */

FieldInvertState.prototype.reset = function (docBoost) {
	this.position = 0;
	this.length = 0;
	this.numOverlap = 0;
	this.offset = 0;
	this.maxTermFrequency = 0;
	this.boost = docBoost;
};


exports.FieldInvertState = FieldInvertState;