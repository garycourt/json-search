/**
 * @constructor
 * @implements {Analyzer}
 */

function IDTokenizer() {};

/**
 * @param {FieldName} field
 * @param {string} value
 * @return {Array.<Token>}
 */

IDTokenizer.prototype.tokenize = function (field, value) {
	return [ /** @type {Token} */ ({
		type : "word",
		value : value,
		startOffset : 0,
		endOffset : value.length,
		positionIncrement : 1
	}) ];
};


exports.IDTokenizer = IDTokenizer;