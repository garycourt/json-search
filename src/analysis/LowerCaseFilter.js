/**
 * @constructor
 * @implements {Analyzer}
 * @param {Analyzer} analyzer
 */

function LowerCaseFilter(analyzer) {
	this.analyzer = analyzer;
};

/**
 * @type {Analyzer}
 */

LowerCaseFilter.prototype.analyzer;

/**
 * @param {FieldName} field
 * @param {string} value
 * @return {Array.<Token>}
 */

LowerCaseFilter.prototype.tokenize = function (field, value) {
	var x, xl, result = this.analyzer.tokenize(field, value);
	for (x = 0, xl = result.length; x < xl; ++x) {
		if (typeof result[x].value === "string") {
			result[x].value = result[x].value.toLowerCase();
		}
	}
	return result;
};


exports.LowerCaseFilter = LowerCaseFilter;