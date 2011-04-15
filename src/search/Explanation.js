/**
 * @constructor
 * @param {number} value
 * @param {string} description
 */

var Explanation = function (value, description) {
	this.value = value;
	this.description = description;
	this.details = [];
};

/**
 * @type {number}
 */

Explanation.prototype.value;

/**
 * @type {string}
 */

Explanation.prototype.description;

/**
 * @type {Array.<Explanation>}
 */

Explanation.prototype.details;

/**
 * @return {boolean}
 */

Explanation.prototype.isMatch = function () {
	return this.value > 0;
};

/**
 * @return {string}
 */

Explanation.prototype.getSummary = function () {
	return this.value + " = " + this.description;
};

/**
 * @param {number} [depth]
 * @return {string}
 */

Explanation.prototype.toString = function (depth) {
	var buffer = [], i, details;
	depth = depth || 0;
	
	for (i = 0; i < depth; i++) {
		buffer.push("  ");
	}
	buffer.push(this.getSummary());
	buffer.push("\n");
	
	if (this.details) {
		for (i = 0; i < this.details.length; i++) {
			buffer.push(this.details[i].toString(depth + 1));
		}
	}
	
	return buffer.join("");
};


exports.Explanation = Explanation;