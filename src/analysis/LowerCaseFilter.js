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
 * @param {Term} value
 * @param {FieldName} [field]
 * @return {Array.<Token>}
 */

LowerCaseFilter.prototype.parse = function (value, field) {
	var x, xl, result = this.analyzer.parse(value, field);
	for (x = 0, xl = result.length; x < xl; ++x) {
		if (typeof result[x].value === "string") {
			result[x].value = result[x].value.toLowerCase();
		}
	}
	return result;
};


exports.LowerCaseFilter = LowerCaseFilter;