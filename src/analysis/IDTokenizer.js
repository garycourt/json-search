/**
 * @constructor
 * @implements {Analyzer}
 */

function IDTokenizer() {};

/**
 * @param {Term} value
 * @param {FieldName} [field]
 * @return {Array.<Token>}
 */

IDTokenizer.prototype.parse = function (value, field) {
	if (typeof value === "string") {
		return [ /** @type {Token} */ ({
			value : value,
			startOffset : 0,
			endOffset : value.length,
			positionIncrement : 1
		}) ];
	} else {
		return [ /** @type {Token} */ ({
			value : value,
			positionIncrement : 1
		}) ];
	}
};


exports.IDTokenizer = IDTokenizer;