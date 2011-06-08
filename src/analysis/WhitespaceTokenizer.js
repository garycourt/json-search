/**
 * @constructor
 * @implements {Analyzer}
 */

function WhitespaceTokenizer() {};

/**
 * @param {FieldName} field
 * @param {string} value
 * @return {Array.<Token>}
 */

WhitespaceTokenizer.prototype.tokenize = function (field, value) {
	//TODO
};


exports.WhitespaceTokenizer = WhitespaceTokenizer;