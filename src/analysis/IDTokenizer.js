/**
 * @constructor
 * @implements {Analyzer}
 */

function IDTokenizer() {};

/**
 * @param {string} value
 * @param {FieldName} [field]
 * @return {Array.<Token>}
 */

IDTokenizer.prototype.parse = function (value, field) {
	return [ /** @type {Token} */ ({
		value : value,
		startOffset : 0,
		endOffset : value.length,
		positionIncrement : 1
	}) ];
};


exports.IDTokenizer = IDTokenizer;