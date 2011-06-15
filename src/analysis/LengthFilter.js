/**
 * @constructor
 * @implements {Analyzer}
 * @param {Analyzer} analyzer
 * @param {number} [min]
 * @param {number} [max]
 */

function LengthFilter(analyzer, min, max) {
	this.analyzer = analyzer;
	this.min = min || 0;
	this.max = max || Number.POSITIVE_INFINITY;
};

/**
 * @type {Analyzer}
 */

LengthFilter.prototype.analyzer;

/**
 * @type {number}
 */

LengthFilter.prototype.min;

/**
 * @type {number}
 */

LengthFilter.prototype.max;

/**
 * @param {string} value
 * @param {FieldName} [field]
 * @return {Array.<Token>}
 */

LengthFilter.prototype.parse = function (value, field) {
	var x, xl, tokenValue,
		tokens = this.analyzer.parse(value, field),
		min = this.min,
		max = this.max,
		result = [],
		skipped = 0;
	for (x = 0, xl = tokens.length; x < xl; ++x) {
		tokenValue = tokens[x].value;
		if (typeof tokenValue === "string" && tokenValue.length >= min && tokenValue.length <= max) {
			tokens[x].positionIncrement += skipped;
			result[result.length] = tokens[x];
			skipped = 0;
		} else {
			skipped += tokens[x].positionIncrement;
		}
	}
	return result;
};


exports.LengthFilter = LengthFilter;